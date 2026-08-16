import {
  CustomNode,
  AgentNodeData,
  TaskNodeData,
  ToolNodeData,
  CrewConfig,
  ExportMode,
  ProjectFile,
  ProjectExportResult,
} from '@/types/editor';
import { Edge } from '@xyflow/react';
import { DEFAULT_LLM_MODEL } from '@/lib/models';
import {
  validateGraph,
  toPythonIdentifier,
  toPythonClassName,
} from './validation';

export function normalizeModel(rawModel?: string): string {
  const model = String(rawModel || DEFAULT_LLM_MODEL).trim();
  if (!model) return `openai/${DEFAULT_LLM_MODEL}`;
  if (
    model.startsWith('openai/') ||
    model.startsWith('anthropic/') ||
    model.startsWith('gemini/') ||
    model.startsWith('groq/') ||
    model.startsWith('ollama/')
  ) {
    return model;
  }
  const lower = model.toLowerCase();
  if (
    lower.startsWith('gpt-') ||
    lower.startsWith('o1') ||
    lower.startsWith('o3') ||
    lower.startsWith('text-davinci') ||
    lower.startsWith('dall-e')
  ) {
    return `openai/${model}`;
  }
  if (lower.includes('claude')) return `anthropic/${model}`;
  if (lower.includes('gemini')) return `gemini/${model}`;
  if (lower.includes('deepseek')) return `groq/${model}`;
  if (lower.includes('llama')) return `groq/${model}`;
  return model;
}

export function escapePythonString(str?: string): string {
  if (!str) return '""';
  if (str.includes('\n') || str.includes('"')) {
    const escaped = str.replace(/"""/g, '\\"\\"\\"');
    return `"""${escaped}"""`;
  }
  return `"${str}"`;
}

export function getRequiredEnvVars(nodes: CustomNode[], crewConfig?: CrewConfig): string[] {
  const keys = new Set<string>();

  const checkModel = (modelStr?: string) => {
    const m = normalizeModel(modelStr).toLowerCase();
    if (m.startsWith('openai/')) keys.add('OPENAI_API_KEY');
    else if (m.startsWith('anthropic/')) keys.add('ANTHROPIC_API_KEY');
    else if (m.startsWith('gemini/')) keys.add('GEMINI_API_KEY');
    else if (m.startsWith('groq/')) keys.add('GROQ_API_KEY');
  };

  if (crewConfig?.process === 'hierarchical' && crewConfig.managerLlm) {
    checkModel(crewConfig.managerLlm);
  }

  (nodes || []).forEach((node) => {
    if (node?.type === 'agent') {
      const data = node.data as AgentNodeData;
      checkModel(data?.model);
    } else if (node?.type === 'tool') {
      const data = node.data as ToolNodeData;
      if (data?.toolType === 'SerperDevTool') keys.add('SERPER_API_KEY');
      if (data?.toolType === 'GithubSearchTool') keys.add('GITHUB_TOKEN');
    }
  });

  if (keys.size === 0) {
    keys.add('OPENAI_API_KEY');
  }

  return Array.from(keys).sort();
}

export function transpileToCrewAI(
  nodes: CustomNode[] = [],
  edges: Edge[] = [],
  crewConfig: CrewConfig = { name: 'My Crew', process: 'sequential', verbose: true, memory: false },
  mode: ExportMode = 'scaffold'
): string {
  const validation = validateGraph(nodes, edges, crewConfig, mode);
  if (!validation.isValid) {
    const errorDetails = validation.errors.map((e) => `- [${e.code}] ${e.message}`).join('\n');
    throw new Error(`Graph validation failed:\n${errorDetails}`);
  }

  const agentNodes = (nodes || []).filter((n) => n?.type === 'agent');
  const taskNodes = (nodes || []).filter((n) => n?.type === 'task');
  const toolNodes = (nodes || []).filter((n) => n?.type === 'tool');

  // Map Predefined Tool Imports needed
  const requiredPrebuiltTools = new Set<string>();
  const customToolList = validation.customTools;

  toolNodes.forEach((tNode) => {
    const data = (tNode?.data || {}) as ToolNodeData;
    if (data?.toolType && data.toolType !== 'CustomTool') {
      requiredPrebuiltTools.add(data.toolType);
    }
  });

  // Tool node variable names
  const toolVarNames: Record<string, string> = {};
  toolNodes.forEach((tNode, idx) => {
    const data = (tNode?.data || {}) as ToolNodeData;
    if (data.toolType === 'CustomTool') {
      const ct = customToolList.find((c) => c.id === tNode.id);
      toolVarNames[tNode.id] = ct?.varName || `custom_tool_${idx + 1}`;
    } else {
      const baseName = data?.label ? toPythonIdentifier(data.label, 'tool') : 'tool';
      toolVarNames[tNode.id] = `${baseName}_${idx + 1}`;
    }
  });

  // Agent node variable names
  const agentVarNames: Record<string, string> = {};
  agentNodes.forEach((aNode, idx) => {
    const data = (aNode?.data || {}) as AgentNodeData;
    const baseName = data?.role ? toPythonIdentifier(data.role, 'agent') : `agent_${idx + 1}`;
    agentVarNames[aNode.id] = `${baseName}_agent`;
  });

  // Task node variable names
  const taskVarNames: Record<string, string> = {};
  taskNodes.forEach((tNode, idx) => {
    const data = (tNode?.data || {}) as TaskNodeData;
    const baseName = data?.label ? toPythonIdentifier(data.label, 'task') : `task_${idx + 1}`;
    taskVarNames[tNode.id] = `${baseName}_task`;
  });

  // Map tools to agents and tasks based on edges
  const agentToolMap: Record<string, string[]> = {};
  const taskToolMap: Record<string, string[]> = {};

  (edges || []).forEach((edge) => {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);
    if (!sourceNode || !targetNode) return;

    if (sourceNode.type === 'tool' && targetNode.type === 'agent') {
      if (!agentToolMap[targetNode.id]) agentToolMap[targetNode.id] = [];
      const varName = toolVarNames[sourceNode.id];
      if (varName && !agentToolMap[targetNode.id].includes(varName)) {
        agentToolMap[targetNode.id].push(varName);
      }
    } else if (sourceNode.type === 'tool' && targetNode.type === 'task') {
      if (!taskToolMap[targetNode.id]) taskToolMap[targetNode.id] = [];
      const varName = toolVarNames[sourceNode.id];
      if (varName && !taskToolMap[targetNode.id].includes(varName)) {
        taskToolMap[targetNode.id].push(varName);
      }
    }
  });

  // LLM Instance Resolution & Deduplication
  const usedModelsMap = new Map<string, string>(); // normalizedModel -> varName
  const agentModelNormalized: Record<string, string> = {};

  agentNodes.forEach((aNode) => {
    const data = (aNode?.data || {}) as AgentNodeData;
    const norm = normalizeModel(data?.model);
    agentModelNormalized[aNode.id] = norm;
    if (!usedModelsMap.has(norm)) {
      usedModelsMap.set(norm, '');
    }
  });

  let managerModelNormalized = '';
  if (crewConfig?.process === 'hierarchical') {
    managerModelNormalized = normalizeModel(crewConfig?.managerLlm);
    if (!usedModelsMap.has(managerModelNormalized)) {
      usedModelsMap.set(managerModelNormalized, '');
    }
  }

  // Name LLM variables
  if (usedModelsMap.size === 1) {
    const [singleModel] = Array.from(usedModelsMap.keys());
    usedModelsMap.set(singleModel, 'llm');
  } else {
    usedModelsMap.forEach((_, modelStr) => {
      const safeSuffix = modelStr.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      usedModelsMap.set(modelStr, `llm_${safeSuffix}`);
    });
  }

  // Environment checks
  const requiredEnvVars = getRequiredEnvVars(nodes, crewConfig);

  // Build Code Header
  let code = `# ==============================================================================
# Code generated by AgentGraph Studio
# CrewAI Autonomous Agent Flow: ${crewConfig?.name || 'My Crew'}
# Mode: ${mode === 'production' ? 'Production' : 'Scaffold (Stubs included)'}
# ==============================================================================

import os
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, Process, LLM
`;

  if (customToolList.length > 0) {
    code += `from crewai.tools import BaseTool\n`;
  }

  if (requiredPrebuiltTools.size > 0) {
    code += `from crewai_tools import (\n    ${Array.from(requiredPrebuiltTools).sort().join(',\n    ')}\n)\n`;
  }

  // 1. Environment & API Keys
  code += `\n# ------------------------------------------------------------------------------
# 1. API Keys & Environment Configuration
# ------------------------------------------------------------------------------
# Load environment variables securely from .env file
load_dotenv()

REQUIRED_ENV_VARS = [
${requiredEnvVars.map((k) => `    "${k}",`).join('\n')}
]

missing_vars = [var for var in REQUIRED_ENV_VARS if not os.getenv(var)]
if missing_vars:
    raise RuntimeError(
        f"Missing required environment variable(s): {', '.join(missing_vars)}. "
        "Please create a .env file based on .env.example."
    )
`;

  // 2. Custom Tools (BaseTool Stubs) & Prebuilt Tool Instantiation
  code += `\n# ------------------------------------------------------------------------------
# 2. Tools Instantiation
# ------------------------------------------------------------------------------
`;

  if (customToolList.length > 0) {
    code += `# --- Custom Tool Stubs (Inherits from BaseTool) ---\n`;
    customToolList.forEach((ct) => {
      code += `class ${ct.className}(BaseTool):
    name: str = "${ct.varName}"
    description: str = ${escapePythonString(ct.description)}

    def _run(self, *args, **kwargs) -> str:
        """Execute custom tool logic for ${ct.label}."""
        # TODO: Implement production execution logic here
        raise NotImplementedError(
            "${ct.className} is a scaffold tool. Implement execution logic before production execution."
        )


`;
    });
  }

  if (toolNodes.length === 0) {
    code += `# No tools connected in current graph\n`;
  } else {
    toolNodes.forEach((tNode) => {
      const data = (tNode?.data || {}) as ToolNodeData;
      const varName = toolVarNames[tNode.id];
      if (data?.toolType === 'CustomTool') {
        const ct = customToolList.find((c) => c.id === tNode.id);
        const className = ct?.className || 'CustomTool';
        code += `${varName} = ${className}()\n`;
      } else {
        const toolType = data?.toolType || 'SerperDevTool';
        code += `${varName} = ${toolType}()\n`;
      }
    });
  }

  // 3. LLM Configurations
  code += `\n# ------------------------------------------------------------------------------
# 3. LLM Configurations
# ------------------------------------------------------------------------------
`;

  usedModelsMap.forEach((varName, modelStr) => {
    code += `${varName} = LLM(
    model="${modelStr}",
    temperature=0.1
)

`;
  });

  // 4. Agents Definition
  code += `# ------------------------------------------------------------------------------
# 4. Agents Definition
# ------------------------------------------------------------------------------
`;

  if (agentNodes.length === 0) {
    code += `# Warning: No Agent nodes defined in graph\n`;
  } else {
    agentNodes.forEach((aNode) => {
      const data = (aNode?.data || {}) as AgentNodeData;
      const varName = agentVarNames[aNode.id];
      const toolsList = agentToolMap[aNode.id] && agentToolMap[aNode.id].length > 0
        ? `[${agentToolMap[aNode.id].join(', ')}]`
        : '[]';

      const normModel = agentModelNormalized[aNode.id];
      const llmVarName = usedModelsMap.get(normModel) || 'llm';

      code += `${varName} = Agent(
    role=${escapePythonString(data?.role || 'AI Agent')},
    goal=${escapePythonString(data?.goal || 'Achieve objective')},
    backstory=${escapePythonString(data?.backstory || 'An intelligent assistant.')},
    verbose=${data?.verbose !== false ? 'True' : 'False'},
    allow_delegation=${data?.allowDelegation ? 'True' : 'False'},
    tools=${toolsList},
    llm=${llmVarName}
)

`;
    });
  }

  // 5. Tasks Definition (with context and ordered by topological sort)
  code += `# ------------------------------------------------------------------------------
# 5. Tasks Definition
# ------------------------------------------------------------------------------
`;

  const sortedTaskNodes = validation.sortedTaskIds
    .map((id) => taskNodes.find((t) => t.id === id)!)
    .filter(Boolean);

  if (sortedTaskNodes.length === 0) {
    code += `# Warning: No Task nodes defined in graph\n`;
  } else {
    sortedTaskNodes.forEach((tNode) => {
      const data = (tNode?.data || {}) as TaskNodeData;
      const varName = taskVarNames[tNode.id];
      const assignedAgentId = validation.taskAgentMap[tNode.id];
      const assignedAgentVar = assignedAgentId ? agentVarNames[assignedAgentId] : undefined;

      const toolsList = taskToolMap[tNode.id] && taskToolMap[tNode.id].length > 0
        ? `tools=[${taskToolMap[tNode.id].join(', ')}],\n    `
        : '';

      const predecessorIds = validation.taskContextMap[tNode.id] || [];
      const contextList = predecessorIds.length > 0
        ? `context=[${predecessorIds.map((pId) => taskVarNames[pId]).filter(Boolean).join(', ')}],\n    `
        : '';

      let agentAssignment = '';
      if (crewConfig?.process !== 'hierarchical' && assignedAgentVar) {
        agentAssignment = `agent=${assignedAgentVar},\n    `;
      }

      code += `${varName} = Task(
    description=${escapePythonString(data?.description || 'Perform task')},
    expected_output=${escapePythonString(data?.expectedOutput || 'Task result summary')},
    ${agentAssignment}${toolsList}${contextList}async_execution=${data?.asyncExecution ? 'True' : 'False'}
)

`;
    });
  }

  // 6. Crew Assembly & Execution
  const allAgentsList = agentNodes.map((a) => agentVarNames[a.id]).join(', ');
  const allTasksList = sortedTaskNodes.map((t) => taskVarNames[t.id]).join(', ');
  const processType = crewConfig?.process === 'hierarchical' ? 'Process.hierarchical' : 'Process.sequential';

  let managerLlmStr = '';
  if (crewConfig?.process === 'hierarchical' && managerModelNormalized) {
    const managerVar = usedModelsMap.get(managerModelNormalized) || 'llm';
    managerLlmStr = `\n    manager_llm=${managerVar},`;
  }

  const inputVars = validation.inputVariables;
  let executionBlock = '';
  if (inputVars.length > 0) {
    const inputsFormatted = inputVars.map((v) => `        "${v}": "./",`).join('\n');
    executionBlock = `    inputs = {\n${inputsFormatted}\n    }\n    result = crew.kickoff(inputs=inputs)\n`;
  } else {
    executionBlock = `    result = crew.kickoff()\n`;
  }

  code += `# ------------------------------------------------------------------------------
# 6. Crew Assembly & Execution
# ------------------------------------------------------------------------------
crew = Crew(
    agents=[${allAgentsList}],
    tasks=[${allTasksList}],
    process=${processType},${managerLlmStr}
    verbose=${crewConfig?.verbose !== false ? 'True' : 'False'},
    memory=${crewConfig?.memory ? 'True' : 'False'}
)

if __name__ == "__main__":
    print("🚀 Starting AgentGraph Studio Crew execution...")
${executionBlock}    print("\\n" + "=" * 60)
    print("🎯 FINAL CREW EXECUTION OUTPUT:")
    print("=" * 60)
    print(result)
`;

  return code;
}

export function generateProjectFiles(
  nodes: CustomNode[] = [],
  edges: Edge[] = [],
  crewConfig: CrewConfig = { name: 'My Crew', process: 'sequential', verbose: true, memory: false },
  mode: ExportMode = 'scaffold'
): ProjectExportResult {
  const validation = validateGraph(nodes, edges, crewConfig, mode);
  if (!validation.isValid) {
    return {
      mode,
      validation,
      files: [],
      mainCode: '',
    };
  }

  const mainCode = transpileToCrewAI(nodes, edges, crewConfig, mode);

  const files: ProjectFile[] = [];

  // 1. main.py
  files.push({
    path: 'main.py',
    filename: 'main.py',
    content: mainCode,
    language: 'python',
    description: 'Main CrewAI execution entrypoint',
  });

  // 2. tools/custom_tools.py
  if (validation.customTools.length > 0) {
    let customToolsContent = `# Custom Tool Implementations for ${crewConfig.name}
from crewai.tools import BaseTool
from pydantic import Field

`;
    validation.customTools.forEach((ct) => {
      customToolsContent += `class ${ct.className}(BaseTool):
    name: str = "${ct.varName}"
    description: str = ${escapePythonString(ct.description)}

    def _run(self, *args, **kwargs) -> str:
        """Domain execution logic for ${ct.label}."""
        # TODO: Implement your custom tool execution here
        raise NotImplementedError(
            "${ct.className} is not implemented. Please provide custom tool logic."
        )


`;
    });

    files.push({
      path: 'tools/custom_tools.py',
      filename: 'custom_tools.py',
      content: customToolsContent,
      language: 'python',
      description: 'Custom BaseTool stub implementations',
    });
  }

  // 3. schemas.py
  const taskNodes = (nodes || []).filter((n) => n?.type === 'task');
  let schemasContent = `# Pydantic Output Schemas for ${crewConfig.name}
from pydantic import BaseModel, Field
from typing import List, Optional

class TaskResultSchema(BaseModel):
    """Generic structured result container for CrewAI tasks."""
    summary: str = Field(description="Executive summary of task execution")
    details: List[str] = Field(default_factory=list, description="Key actionable findings or output points")
    is_success: bool = Field(default=True, description="Whether the task completed successfully")

`;

  taskNodes.forEach((t, idx) => {
    const data = t.data as TaskNodeData;
    const expOut = (data.expectedOutput || '').toLowerCase();
    if (expOut.includes('json') || expOut.includes('structured') || expOut.includes('schema')) {
      const baseName = data.label ? toPythonClassName(data.label, `Task${idx + 1}`) : `Task${idx + 1}Output`;
      schemasContent += `class ${baseName}Schema(BaseModel):
    """Structured output schema for task: ${data.label || t.id}."""
    title: str = Field(description="Result title")
    findings: List[str] = Field(default_factory=list, description="Specific findings or output rows")
    metadata: Optional[dict] = Field(default=None, description="Additional structured metadata")


`;
    }
  });

  files.push({
    path: 'schemas.py',
    filename: 'schemas.py',
    content: schemasContent,
    language: 'python',
    description: 'Pydantic data models for structured task outputs',
  });

  // 4. .env.example
  const requiredEnvVars = getRequiredEnvVars(nodes, crewConfig);
  const envExampleContent = `# Environment Configuration for ${crewConfig.name}
# Copy this file to .env and fill in your actual API keys.
${requiredEnvVars.map((k) => `${k}=your_${k.toLowerCase()}_here`).join('\n')}
`;

  files.push({
    path: '.env.example',
    filename: '.env.example',
    content: envExampleContent,
    language: 'bash',
    description: 'Template for required environment variables',
  });

  // 5. requirements.txt
  const requirementsContent = `# Python Dependencies for CrewAI Workflow: ${crewConfig.name}
crewai>=0.100.0
crewai-tools>=0.30.0
pydantic>=2.7.0
python-dotenv>=1.0.1
`;

  files.push({
    path: 'requirements.txt',
    filename: 'requirements.txt',
    content: requirementsContent,
    language: 'text',
    description: 'Python package dependencies',
  });

  // 6. pyproject.toml
  const pyprojectContent = `[project]
name = "${toPythonIdentifier(crewConfig.name, 'crewai_flow')}"
version = "0.1.0"
description = "Autonomous Agent Workflow generated by AgentGraph Studio"
authors = [{ name = "AgentGraph Studio User" }]
dependencies = [
    "crewai>=0.100.0",
    "crewai-tools>=0.30.0",
    "pydantic>=2.7.0",
    "python-dotenv>=1.0.1",
]
requires-python = ">=3.10"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
`;

  files.push({
    path: 'pyproject.toml',
    filename: 'pyproject.toml',
    content: pyprojectContent,
    language: 'toml',
    description: 'Modern Python project definition',
  });

  // 7. README.md
  const readmeContent = `# 🚀 ${crewConfig.name} (CrewAI Workflow)

Generated by **AgentGraph Studio**.

## Quick Start

### 1. Setup Virtual Environment
\`\`\`bash
python3 -m venv venv
source venv/bin/activate  # On Windows: .\\venv\\Scripts\\activate
pip install -r requirements.txt
\`\`\`

### 2. Configure Environment Variables
\`\`\`bash
cp .env.example .env
# Open .env and add your valid API keys:
# ${requiredEnvVars.join(', ')}
\`\`\`

### 3. Run Workflow
\`\`\`bash
python main.py
\`\`\`

## Graph Summary
- **Process**: \`${crewConfig.process}\`
- **Agents**: ${nodes.filter((n) => n.type === 'agent').length}
- **Tasks**: ${nodes.filter((n) => n.type === 'task').length}
- **Tools**: ${nodes.filter((n) => n.type === 'tool').length}
- **Export Mode**: \`${mode.toUpperCase()}\`
`;

  files.push({
    path: 'README.md',
    filename: 'README.md',
    content: readmeContent,
    language: 'markdown',
    description: 'Setup and execution guide',
  });

  // 8. tests/test_crew.py
  const testCrewContent = `import unittest
from main import crew

class TestCrewWorkflow(unittest.TestCase):
    def test_crew_initialization(self):
        """Verify that the Crew and agents/tasks initialize properly."""
        self.assertIsNotNone(crew)
        self.assertGreater(len(crew.agents), 0)
        self.assertGreater(len(crew.tasks), 0)

if __name__ == "__main__":
    unittest.main()
`;

  files.push({
    path: 'tests/test_crew.py',
    filename: 'test_crew.py',
    content: testCrewContent,
    language: 'python',
    description: 'Basic integration test scaffold',
  });

  return {
    mode,
    validation,
    files,
    mainCode,
  };
}
