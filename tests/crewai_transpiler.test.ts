import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { CustomNode, CrewConfig } from '../types/editor';
import { Edge } from '@xyflow/react';
import { validateGraph } from '../lib/transpiler/validation';
import { transpileToCrewAI, generateProjectFiles } from '../lib/transpiler/crewai';
import { PRESET_TEMPLATES } from '../lib/presets';
import { translations } from '../lib/i18n/translations';

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

  test('16. Cloudways summer offer copy includes the code, discount period, and deadline', () => {
    assert.match(translations.en.cloudwaysTitle, /40% Off for 4 Months/);
    assert.match(translations.en.cloudwaysPromoCode, /SUMMER404/);
    assert.match(translations.en.cloudwaysDeadline, /September 15, 2026/);
    assert.match(translations.ja.cloudwaysTitle, /4か月間40%オフ/);
    assert.match(translations.ja.cloudwaysPromoCode, /SUMMER404/);
    assert.match(translations.ja.cloudwaysDeadline, /2026年9月15日/);
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
    assert.match(project.mainCode, /from schemas import ReleaseReportOutput7/);
    assert.match(project.mainCode, /output_pydantic=ReleaseReportOutput7/);
    assert.match(project.files.find((file) => file.path === 'schemas.py')?.content || '', /class ReleaseReportOutput7\(BaseModel\):/);
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
});
