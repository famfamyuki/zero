import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { CustomNode, CrewConfig } from '../types/editor';
import { Edge } from '@xyflow/react';
import { validateGraph } from '../lib/transpiler/validation';
import { transpileToCrewAI, generateProjectFiles, getRequiredEnvVars, normalizeModel } from '../lib/transpiler/crewai';
import { PRESET_TEMPLATES } from '../lib/presets';
import { translations } from '../lib/i18n/translations';
import { LLM_MODEL_OPTIONS, isKnownModel } from '../lib/models';

describe('CrewAI Exporter & Graph Validation Test Suite', () => {
  // Helper to validate Python AST using local python
  function assertValidPythonSyntax(code: string) {
    try {
      execSync(`python -c "import ast, sys; ast.parse(sys.stdin.read())"`, {
        input: code,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
    } catch (err: any) {
      assert.fail(`Generated Python failed AST syntax check: ${err.stderr?.toString() || err.message}`);
    }
  }

  // Sample Nodes Factory
  function createSampleGraph() {
    const nodes: CustomNode[] = [
      {
        id: 'agent-1',
        type: 'agent',
        position: { x: 100, y: 100 },
        data: {
          label: 'Senior Auditor',
          role: 'Lead Security Auditor',
          goal: 'Perform static repository code audit on {repository_path}',
          backstory: 'Expert security reviewer specialized in vulnerability detection.',
          model: 'gpt-5.6-terra',
          verbose: true,
          allowDelegation: false,
        },
      },
      {
        id: 'agent-2',
        type: 'agent',
        position: { x: 100, y: 300 },
        data: {
          label: 'Report Generator',
          role: 'Release Report Specialist',
          goal: 'Generate final markdown audit report to {output_directory}',
          backstory: 'Technical documentation specialist.',
          model: 'gpt-5.6-terra',
          verbose: true,
          allowDelegation: false,
        },
      },
      {
        id: 'tool-1',
        type: 'tool',
        position: { x: 0, y: 100 },
        data: {
          label: 'Repository Reader',
          toolType: 'CustomTool',
          description: 'Read local source files safely from repository',
        },
      },
      {
        id: 'task-1',
        type: 'task',
        position: { x: 400, y: 100 },
        data: {
          label: 'Static Audit Task',
          description: 'Scan code in {repository_path} for common security bugs',
          expectedOutput: 'Summary report of detected vulnerabilities',
          asyncExecution: false,
        },
      },
      {
        id: 'task-2',
        type: 'task',
        position: { x: 400, y: 300 },
        data: {
          label: 'Release Report Task',
          description: 'Synthesize findings and write report to {output_directory}',
          expectedOutput: 'Structured JSON release audit report format',
          asyncExecution: false,
        },
      },
    ];

    const edges: Edge[] = [
      { id: 'e-tool', source: 'tool-1', target: 'agent-1' },
      { id: 'e-a1-t1', source: 'agent-1', target: 'task-1' },
      { id: 'e-a2-t2', source: 'agent-2', target: 'task-2' },
      { id: 'e-t1-t2', source: 'task-1', target: 'task-2' }, // Task dependency!
    ];

    const crewConfig: CrewConfig = {
      name: 'Security Audit Crew',
      process: 'sequential',
      verbose: true,
      memory: false,
    };

    return { nodes, edges, crewConfig };
  }

  test('1. Tool is NOT passed as None to Agent; BaseTool scaffold stub is generated', () => {
    const { nodes, edges, crewConfig } = createSampleGraph();
    const code = transpileToCrewAI(nodes, edges, crewConfig, 'scaffold');

    assert.ok(!code.includes('None  # Replace with custom tool instance'), 'Must not declare tools as None');
    assert.ok(!code.includes('tools=[None]'), 'Must not pass None to tools list');
    assert.ok(code.includes('class RepositoryReaderTool(BaseTool):'), 'Must define BaseTool subclass');
    assert.ok(code.includes('raise NotImplementedError'), 'Scaffold tool must raise NotImplementedError');
    assert.ok(code.includes('repository_reader_1 = RepositoryReaderTool()'), 'Must instantiate custom tool');
    assert.ok(code.includes('tools=[repository_reader_1]'), 'Must pass tool instance to agent');
  });

  test('2. Task->Task Edge is converted to context=[...] in target Task', () => {
    const { nodes, edges, crewConfig } = createSampleGraph();
    const code = transpileToCrewAI(nodes, edges, crewConfig, 'scaffold');

    assert.ok(code.includes('context=[static_audit_task_task]'), 'Release report task must have static audit task in context');
  });

  test('3. Multiple Agents -> 1 Task fails export with explicit error in sequential mode', () => {
    const { nodes, edges, crewConfig } = createSampleGraph();
    // Connect both agent-1 and agent-2 to task-1
    const invalidEdges: Edge[] = [
      ...edges,
      { id: 'e-a2-t1', source: 'agent-2', target: 'task-1' },
    ];

    const validation = validateGraph(nodes, invalidEdges, crewConfig);
    assert.equal(validation.isValid, false, 'Validation should fail');
    const multiAgentError = validation.errors.find((e) => e.code === 'MULTIPLE_AGENTS_PER_TASK');
    assert.ok(multiAgentError, 'Should report MULTIPLE_AGENTS_PER_TASK error');
    assert.ok(multiAgentError.message.includes('Static Audit Task'), 'Error message must identify the task');
    assert.ok(multiAgentError.message.includes('Lead Security Auditor'), 'Error message must identify connected agents');
    assert.ok(multiAgentError.suggestion?.includes('split it into 2 agent-owned tasks'), 'Error must explain how to fix the graph');

    assert.throws(
      () => transpileToCrewAI(nodes, invalidEdges, crewConfig),
      /Graph validation failed/,
      'transpileToCrewAI must throw error'
    );
  });

  test('4. Dangling edge referencing non-existent node fails validation', () => {
    const { nodes, edges, crewConfig } = createSampleGraph();
    const brokenEdges: Edge[] = [
      ...edges,
      { id: 'e-ghost', source: 'ghost-node', target: 'task-1' },
    ];

    const validation = validateGraph(nodes, brokenEdges, crewConfig);
    assert.equal(validation.isValid, false);
    const danglingError = validation.errors.find((e) => e.code === 'DANGLING_EDGE');
    assert.ok(danglingError, 'Should report DANGLING_EDGE error');
  });

  test('5. Task dependency cycle fails validation', () => {
    const { nodes, edges, crewConfig } = createSampleGraph();
    // Create cycle: task-1 -> task-2 -> task-1
    const cyclicEdges: Edge[] = [
      ...edges,
      { id: 'e-t2-t1', source: 'task-2', target: 'task-1' },
    ];

    const validation = validateGraph(nodes, cyclicEdges, crewConfig);
    assert.equal(validation.isValid, false);
    const cycleError = validation.errors.find((e) => e.code === 'TASK_CYCLE_DETECTED');
    assert.ok(cycleError, 'Should report TASK_CYCLE_DETECTED error');
  });

  test('6. Task without assigned Agent fails validation in sequential process', () => {
    const { nodes, edges, crewConfig } = createSampleGraph();
    // Remove edge connecting agent to task-2
    const unassignedEdges = edges.filter((e) => e.id !== 'e-a2-t2');

    const validation = validateGraph(nodes, unassignedEdges, crewConfig);
    assert.equal(validation.isValid, false);
    const unassignedError = validation.errors.find((e) => e.code === 'UNASSIGNED_TASK');
    assert.ok(unassignedError, 'Should report UNASSIGNED_TASK error');
  });

  test('7. Unused Agent triggers warning', () => {
    const { nodes, edges, crewConfig } = createSampleGraph();
    // Add isolated agent
    const extendedNodes: CustomNode[] = [
      ...nodes,
      {
        id: 'agent-idle',
        type: 'agent',
        position: { x: 100, y: 500 },
        data: {
          label: 'Idle Agent',
          role: 'Idle Specialist',
          goal: 'Waiting',
          backstory: 'Idle',
          model: 'gpt-5.6-terra',
          verbose: true,
          allowDelegation: false,
        },
      },
    ];

    const validation = validateGraph(extendedNodes, edges, crewConfig);
    const unusedWarning = validation.warnings.find((w) => w.code === 'UNUSED_AGENT');
    assert.ok(unusedWarning, 'Should warn about unused agent');
    assert.ok(unusedWarning.message.includes('Idle Specialist'));
  });

  test('8. Identical LLM instances are reused across agents', () => {
    const { nodes, edges, crewConfig } = createSampleGraph();
    const code = transpileToCrewAI(nodes, edges, crewConfig, 'scaffold');

    // Both agents use 'gpt-5.6-terra'
    assert.ok(code.includes('llm = LLM('), 'Must create single default llm instance');
    assert.ok(code.includes('model="openai/gpt-5.6-terra"'), 'Must prefix known OpenAI model with openai/');
    // Count occurrences of 'llm = LLM('
    const matches = code.match(/llm = LLM\(/g);
    assert.equal(matches?.length, 1, 'Should instantiate LLM only once when models match');
  });

  test('9. No dummy API key values generated; safe runtime check included', () => {
    const { nodes, edges, crewConfig } = createSampleGraph();
    const code = transpileToCrewAI(nodes, edges, crewConfig, 'scaffold');

    assert.ok(!code.includes('YOUR_OPENAI_API_KEY'), 'Must not generate dummy API key strings');
    assert.ok(!code.includes('YOUR_SERPER_API_KEY'), 'Must not generate dummy Serper API key');
    assert.ok(code.includes('REQUIRED_ENV_VARS = ['), 'Must define REQUIRED_ENV_VARS');
    assert.ok(code.includes('raise RuntimeError('), 'Must raise RuntimeError on missing keys');
  });

  test('10. Generated Python syntax parses cleanly via Python AST', () => {
    const { nodes, edges, crewConfig } = createSampleGraph();
    const code = transpileToCrewAI(nodes, edges, crewConfig, 'scaffold');
    assertValidPythonSyntax(code);

    // Also test preset templates
    PRESET_TEMPLATES.forEach((preset) => {
      const pCode = transpileToCrewAI(
        preset.graphData.nodes,
        preset.graphData.edges,
        preset.graphData.crewConfig,
        'scaffold'
      );
      assertValidPythonSyntax(pCode);
    });
  });

  test('11. Deterministic generation: identical JSON produces identical code', () => {
    const { nodes, edges, crewConfig } = createSampleGraph();
    const codeA = transpileToCrewAI(nodes, edges, crewConfig, 'scaffold');
    const codeB = transpileToCrewAI(nodes, edges, crewConfig, 'scaffold');

    assert.equal(codeA, codeB, 'Consecutive transpiles of same graph must produce byte-identical code');
  });

  test('12. Input variables {repository_path}, {output_directory} extracted and passed to kickoff', () => {
    const { nodes, edges, crewConfig } = createSampleGraph();
    const validation = validateGraph(nodes, edges, crewConfig);

    assert.deepEqual(validation.inputVariables, ['output_directory', 'repository_path']);

    const code = transpileToCrewAI(nodes, edges, crewConfig, 'scaffold');
    assert.ok(code.includes('inputs = {'), 'Must declare inputs dict');
    assert.ok(code.includes('"repository_path": "./"'), 'Must include repository_path');
    assert.ok(code.includes('"output_directory": "./"'), 'Must include output_directory');
    assert.ok(code.includes('result = crew.kickoff(inputs=inputs)'), 'Must pass inputs to crew.kickoff');
  });

  test('13. Multi-file project export generates all expected project files', () => {
    const { nodes, edges, crewConfig } = createSampleGraph();
    const project = generateProjectFiles(nodes, edges, crewConfig, 'scaffold');

    const fileNames = project.files.map((f) => f.path);
    assert.ok(fileNames.includes('main.py'));
    assert.ok(fileNames.includes('tools/custom_tools.py'));
    assert.ok(fileNames.includes('schemas.py'));
    assert.ok(fileNames.includes('.env.example'));
    assert.ok(fileNames.includes('requirements.txt'));
    assert.ok(fileNames.includes('pyproject.toml'));
    assert.ok(fileNames.includes('README.md'));
    assert.ok(fileNames.includes('tests/test_crew.py'));

    assertValidPythonSyntax(project.mainCode);
    const customToolFile = project.files.find((f) => f.path === 'tools/custom_tools.py');
    assert.ok(customToolFile);
    assertValidPythonSyntax(customToolFile.content);
  });

  test('14. Validation errors never produce misleading or downloadable project files', () => {
    const { nodes, edges, crewConfig } = createSampleGraph();
    const invalidEdges: Edge[] = [
      ...edges,
      { id: 'e-a2-t1', source: 'agent-2', target: 'task-1' },
    ];

    const project = generateProjectFiles(nodes, invalidEdges, crewConfig, 'scaffold');
    assert.equal(project.validation.isValid, false);
    assert.equal(project.mainCode, '');
    assert.deepEqual(project.files, []);
    assert.ok(project.validation.errors[0]?.suggestion?.includes('Keep one primary agent'));
  });

  test('15. Repository Red-Team preset uses one owner per task and exports successfully', () => {
    const preset = PRESET_TEMPLATES.find((item) => item.id === 'repository-red-team-audit');
    assert.ok(preset, 'Red-Team preset must exist');
    assert.equal(preset.previewNodesCount.agents, 6);
    assert.equal(preset.previewNodesCount.tasks, 7);

    const validation = validateGraph(
      preset.graphData.nodes,
      preset.graphData.edges,
      preset.graphData.crewConfig
    );
    assert.equal(validation.isValid, true, validation.errors.map((error) => error.message).join('\n'));

    const releaseContext = validation.taskContextMap['rt-task-release'];
    assert.deepEqual(
      new Set(releaseContext),
      new Set([
        'rt-task-architecture',
        'rt-task-security',
        'rt-task-reliability',
        'rt-task-adversarial',
        'rt-task-cost',
      ])
    );

    const code = transpileToCrewAI(
      preset.graphData.nodes,
      preset.graphData.edges,
      preset.graphData.crewConfig,
      'scaffold'
    );
    assertValidPythonSyntax(code);
  });

  test('16. Retired Cloudways promotion is absent from localized product copy', () => {
    assert.doesNotMatch(JSON.stringify(translations), /cloudways|SUMMER404/i);
  });

  test('17. Empty workflows and unsupported edge directions are blocked', () => {
    const empty = validateGraph([], [], { name: 'Empty', process: 'sequential', verbose: true, memory: false });
    assert.equal(empty.isValid, false);
    assert.ok(empty.errors.some((error) => error.code === 'NO_AGENTS'));
    assert.ok(empty.errors.some((error) => error.code === 'NO_TASKS'));

    const { nodes, edges, crewConfig } = createSampleGraph();
    const invalid = validateGraph(nodes, [...edges, { id: 'bad', source: 'agent-1', target: 'agent-2' }], crewConfig);
    assert.ok(invalid.errors.some((error) => error.code === 'UNSUPPORTED_EDGE'));
  });

  test('18. Multi-file export imports custom tools once from their generated module', () => {
    const { nodes, edges, crewConfig } = createSampleGraph();
    const project = generateProjectFiles(nodes, edges, crewConfig, 'scaffold');
    assert.match(project.mainCode, /from tools\.custom_tools import RepositoryReaderTool/);
    assert.doesNotMatch(project.mainCode, /class RepositoryReaderTool\(BaseTool\):/);
    assert.ok(project.files.some((file) => file.path === 'tools/__init__.py'));
  });

  test('19. JSON template output is bound to a generated Pydantic model', () => {
    const preset = PRESET_TEMPLATES.find((item) => item.id === 'repository-red-team-audit');
    assert.ok(preset);
    const project = generateProjectFiles(preset.graphData.nodes, preset.graphData.edges, preset.graphData.crewConfig);
    assert.match(project.mainCode, /from schemas import ReleaseReportOutput5/);
    assert.match(project.mainCode, /output_pydantic=ReleaseReportOutput5/);
    assert.match(project.files.find((file) => file.path === 'schemas.py')?.content || '', /class ReleaseReportOutput5\(BaseModel\):/);
    assert.ok(!project.validation.warnings.some((warning) => warning.code === 'STRUCTURED_OUTPUT_NOT_ENABLED'));
  });

  test('20. Generated identifiers remain unique and hostile strings remain valid Python', () => {
    const { nodes, edges, crewConfig } = createSampleGraph();
    const duplicateAgent = structuredClone(nodes.find((node) => node.id === 'agent-1')!);
    duplicateAgent.id = 'agent-3';
    duplicateAgent.position = { x: 100, y: 500 };
    (duplicateAgent.data as any).backstory = 'Quotes " and backslash \\ and newline\nremain safe';
    const extraTask = structuredClone(nodes.find((node) => node.id === 'task-1')!);
    extraTask.id = 'task-3';
    extraTask.position = { x: 400, y: 500 };
    const code = transpileToCrewAI(
      [...nodes, duplicateAgent, extraTask],
      [...edges, { id: 'e-a3-t3', source: 'agent-3', target: 'task-3' }],
      crewConfig
    );
    assert.match(code, /lead_security_auditor_agent_2 = Agent\(/);
    assert.match(code, /static_audit_task_task_2 = Task\(/);
    assertValidPythonSyntax(code);
  });

  test('21. Every preset has accurate counts and exports as a syntax-valid project', () => {
    PRESET_TEMPLATES.forEach((preset) => {
      const { nodes, edges, crewConfig } = preset.graphData;
      assert.equal(preset.previewNodesCount.agents, nodes.filter((node) => node.type === 'agent').length, `${preset.id}: agent count`);
      assert.equal(preset.previewNodesCount.tasks, nodes.filter((node) => node.type === 'task').length, `${preset.id}: task count`);
      assert.equal(preset.previewNodesCount.tools, nodes.filter((node) => node.type === 'tool').length, `${preset.id}: tool count`);
      const project = generateProjectFiles(nodes, edges, crewConfig);
      assert.equal(project.validation.isValid, true, `${preset.id}: ${project.validation.errors.map((error) => error.message).join('; ')}`);
      project.files.filter((file) => file.path.endsWith('.py')).forEach((file) => assertValidPythonSyntax(file.content));
    });
  });

  test('22. Every preset includes complete bilingual selection guidance', () => {
    PRESET_TEMPLATES.forEach((preset) => {
      assert.ok(preset.useCase, `${preset.id}: use case`);
      assert.ok(preset.useCaseEn && preset.useCaseJa, `${preset.id}: localized use case`);
      assert.ok(preset.codePattern, `${preset.id}: code pattern`);
      assert.ok(preset.codePatternEn && preset.codePatternJa, `${preset.id}: localized code pattern`);
      assert.ok(preset.difficulty, `${preset.id}: difficulty`);
      assert.ok(preset.bestForEn && preset.bestForJa, `${preset.id}: best-for guide`);
      assert.ok(preset.codeGuideEn && preset.codeGuideJa, `${preset.id}: code guide`);
      assert.ok((preset.prerequisitesEn?.length || 0) > 0 && (preset.prerequisitesJa?.length || 0) > 0, `${preset.id}: prerequisites`);
      assert.ok((preset.deliverablesEn?.length || 0) > 0 && (preset.deliverablesJa?.length || 0) > 0, `${preset.id}: deliverables`);

      if (preset.codePattern === 'HIERARCHICAL') {
        assert.equal(preset.graphData.crewConfig.process, 'hierarchical', `${preset.id}: hierarchical process`);
      }
      if (preset.codePattern === 'PARALLEL') {
        const asyncTasks = preset.graphData.nodes.filter((node) => node.type === 'task' && Boolean((node.data as any).asyncExecution));
        assert.ok(asyncTasks.length >= 2, `${preset.id}: parallel async tasks`);
      }
    });
  });

  test('23. Refined templates are parameterized and do not overclaim external actions', () => {
    PRESET_TEMPLATES.forEach((preset) => {
      const validation = validateGraph(preset.graphData.nodes, preset.graphData.edges, preset.graphData.crewConfig);
      assert.ok(validation.inputVariables.length > 0, `${preset.id}: reusable input variables`);
      const taskText = preset.graphData.nodes
        .filter((node) => node.type === 'task')
        .map((node) => `${(node.data as any).description} ${(node.data as any).expectedOutput}`)
        .join(' ');
      assert.doesNotMatch(taskText, /automatically (publish|post|schedule|send)/i, `${preset.id}: unsupported automation claim`);
    });

    const redTeam = PRESET_TEMPLATES.find((preset) => preset.id === 'repository-red-team-audit');
    assert.ok(redTeam);
    const redTeamToolTypes = redTeam.graphData.nodes
      .filter((node) => node.type === 'tool')
      .map((node) => (node.data as any).toolType);
    assert.deepEqual(new Set(redTeamToolTypes), new Set(['DirectoryReadTool', 'FileReadTool']));

    const research = PRESET_TEMPLATES.find((preset) => preset.id === 'parallel-web-research');
    assert.ok(research);
    const researchCode = transpileToCrewAI(research.graphData.nodes, research.graphData.edges, research.graphData.crewConfig);
    assert.match(researchCode, /"research_question": "Replace with research question"/);
  });

  test('24. Model catalog spans current and legacy providers and accepts local models without an OpenAI key', () => {
    const requiredModels = [
      'gpt-5.6-sol',
      'anthropic/claude-sonnet-5',
      'anthropic/claude-sonnet-4-6',
      'gemini/gemini-3.7-flash',
      'gemini/gemini-2.5-pro',
      'groq/openai/gpt-oss-120b',
      'ollama/qwen3',
    ];
    requiredModels.forEach((model) => assert.ok(isKnownModel(model), model));
    assert.equal(new Set(LLM_MODEL_OPTIONS.map((model) => model.value)).size, LLM_MODEL_OPTIONS.length, 'model IDs must be unique');

    const { nodes, edges, crewConfig } = createSampleGraph();
    const localNodes = nodes.map((node) => node.type === 'agent'
      ? { ...node, data: { ...node.data, model: 'ollama/qwen3' } }
      : node) as CustomNode[];
    const project = generateProjectFiles(localNodes, edges, crewConfig);
    const envFile = project.files.find((file) => file.path === '.env.example');
    assert.ok(envFile);
    assert.doesNotMatch(envFile.content, /OPENAI_API_KEY/);
  });

  test('25. Missing tool types are rejected before broken Python can be generated', () => {
    const { nodes, edges, crewConfig } = createSampleGraph();
    const brokenNodes = nodes.map((node) => node.id === 'tool-1'
      ? { ...node, data: { ...node.data, toolType: undefined } }
      : node) as CustomNode[];
    const validation = validateGraph(brokenNodes, edges, crewConfig);
    assert.equal(validation.isValid, false);
    assert.ok(validation.errors.some((error) => error.code === 'MISSING_TOOL_TYPE'));
    assert.throws(() => transpileToCrewAI(brokenNodes, edges, crewConfig), /MISSING_TOOL_TYPE/);
  });

  test('26. Memory and RAG exports include their default OpenAI embedding dependency', () => {
    const { nodes, crewConfig } = createSampleGraph();
    const localNodes = nodes.map((node) => {
      if (node.type === 'agent') return { ...node, data: { ...node.data, model: 'ollama/qwen3' } };
      if (node.id === 'tool-1') return { ...node, data: { ...node.data, toolType: 'TXTSearchTool' } };
      return node;
    }) as CustomNode[];
    assert.ok(getRequiredEnvVars(localNodes, { ...crewConfig, memory: true }).includes('OPENAI_API_KEY'));
    assert.ok(getRequiredEnvVars(localNodes, { ...crewConfig, memory: false }).includes('OPENAI_API_KEY'));
  });

  test('27. Provider normalization handles o4 and DeepSeek without misrouting', () => {
    assert.equal(normalizeModel('o4-mini'), 'openai/o4-mini');
    assert.equal(normalizeModel('deepseek-chat'), 'deepseek/deepseek-chat');
  });

  test('28. Literal JSON braces are escaped while declared input placeholders remain active', () => {
    const { nodes, edges, crewConfig } = createSampleGraph();
    const jsonNodes = nodes.map((node) => node.id === 'task-1'
      ? { ...node, data: { ...node.data, description: 'Read {repository_path} and return {"status": "ok"}' } }
      : node) as CustomNode[];
    const code = transpileToCrewAI(jsonNodes, edges, crewConfig);
    assert.ok(code.includes('Read {repository_path} and return {{\\"status\\": \\"ok\\"}}'));
    assertValidPythonSyntax(code);
  });

  test('29. Retired Claude 3 API models are not offered as runnable options', () => {
    assert.equal(isKnownModel('anthropic/claude-3-7-sonnet-latest'), false);
    assert.equal(isKnownModel('anthropic/claude-3-5-sonnet-latest'), false);
    assert.equal(isKnownModel('anthropic/claude-3-opus-latest'), false);
  });

  test('30. Tool-specific parameters are validated, generated, and exposed as kickoff inputs', () => {
    const { nodes, edges, crewConfig } = createSampleGraph();
    const configuredNodes = nodes.map((node) => node.id === 'tool-1'
      ? { ...node, data: { ...node.data, toolType: 'FileReadTool', parameters: { file_path: '{source_file}' } } }
      : node) as CustomNode[];
    const validation = validateGraph(configuredNodes, edges, crewConfig);
    assert.equal(validation.isValid, true);
    assert.ok(validation.inputVariables.includes('source_file'));
    const code = transpileToCrewAI(configuredNodes, edges, crewConfig);
    assert.match(code, /FileReadTool\(file_path="\{source_file\}"\)/);
    assert.match(code, /"source_file": "\.\/"/);

    const invalidNodes = configuredNodes.map((node) => node.id === 'tool-1'
      ? { ...node, data: { ...node.data, parameters: { arbitrary_python_kwarg: 'bad' } } }
      : node) as CustomNode[];
    assert.ok(validateGraph(invalidNodes, edges, crewConfig).errors.some((error) => error.code === 'UNSUPPORTED_TOOL_PARAMETER'));
  });

  test('31. Agent, task, and crew settings reach generated code', () => {
    const { nodes, edges, crewConfig } = createSampleGraph();
    const configuredNodes = nodes.map((node) => {
      if (node.id === 'agent-1') return { ...node, data: { ...node.data, verbose: false, allowDelegation: true, maxIter: 12, maxRpm: 30, maxExecutionTime: 90, respectContextWindow: false, cache: false } };
      if (node.id === 'task-1') return { ...node, data: { ...node.data, asyncExecution: true, outputFormat: 'json', outputSchema: '{"summary":"string","score":"number","approved":"boolean"}', markdown: true, outputFile: 'report.md', humanInput: true } };
      return node;
    }) as CustomNode[];
    const code = transpileToCrewAI(configuredNodes, edges, { ...crewConfig, verbose: false, memory: true });
    assert.match(code, /role="Lead Security Auditor"/);
    assert.match(code, /model="openai\/gpt-5\.6-terra"/);
    assert.match(code, /verbose=False,\n    allow_delegation=True/);
    assert.match(code, /max_iter=12/);
    assert.match(code, /max_rpm=30/);
    assert.match(code, /max_execution_time=90/);
    assert.match(code, /respect_context_window=False/);
    assert.match(code, /cache=False/);
    assert.match(code, /summary: str/);
    assert.match(code, /score: float/);
    assert.match(code, /approved: bool/);
    assert.match(code, /markdown=True/);
    assert.match(code, /output_file="report\.md"/);
    assert.match(code, /human_input=True/);
    assert.match(code, /async_execution=True/);
    assert.match(code, /process=Process\.sequential/);
    assert.match(code, /verbose=False,\n    memory=True/);
    assertValidPythonSyntax(code);
  });

  test('32. Hierarchical manager model is reflected in crew configuration', () => {
    const { nodes, edges, crewConfig } = createSampleGraph();
    const code = transpileToCrewAI(nodes, edges, {
      ...crewConfig,
      process: 'hierarchical',
      managerLlm: 'anthropic/claude-sonnet-4-6',
    });
    assert.match(code, /model="anthropic\/claude-sonnet-4-6"/);
    assert.match(code, /process=Process\.hierarchical/);
    assert.match(code, /manager_llm=llm_anthropic_claude_sonnet_4_6/);
    assertValidPythonSyntax(code);
  });

  test('33. Invalid strict JSON schemas are blocked with an actionable validation error', () => {
    const { nodes, edges, crewConfig } = createSampleGraph();
    const invalidNodes = nodes.map((node) => node.id === 'task-1'
      ? { ...node, data: { ...node.data, outputFormat: 'json', outputSchema: '{"score":"unsupported"}' } }
      : node) as CustomNode[];
    const validation = validateGraph(invalidNodes, edges, crewConfig);
    assert.equal(validation.isValid, false);
    assert.ok(validation.errors.some((error) => error.code === 'INVALID_OUTPUT_SCHEMA'));
  });
});
