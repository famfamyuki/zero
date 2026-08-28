import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  importCrewAISource,
  CREWAI_IMPORT_MAX_BYTES,
} from "../lib/crewai-import";
import { validateGraph } from "../lib/transpiler/validation";
import { serializeGraph, deserializeGraph } from "../lib/graph-json";
import { transpileToCrewAI } from "../lib/transpiler/crewai";

const root = fileURLToPath(
  new URL("./fixtures/crewai-import/", import.meta.url),
);
const load = (name: string) => new Uint8Array(readFileSync(`${root}${name}`));
const run = (name: string) => importCrewAISource(name, load(name));

describe("CrewAI Static Import v0", () => {
  test("maps supported fixtures deterministically into current Graph V1", () => {
    for (const name of [
      "supported-minimal.py",
      "supported-tools-context.py",
      "supported-hierarchical.py",
      "supported-agent-guards.py",
    ]) {
      const a = run(name),
        b = run(name);
      assert.equal(
        a.state,
        "READY",
        `${name}: ${a.report.diagnostics.filter((d) => d.blocking).map((d) => d.code)}`,
      );
      assert.deepEqual(a, b);
      assert.ok(a.graph);
      assert.equal(
        validateGraph(
          a.graph!.nodes,
          a.graph!.edges,
          a.graph!.crewConfig,
          "scaffold",
        ).isValid,
        true,
      );
      const json = serializeGraph(a.graph!);
      assert.match(json, /"schemaVersion": 1/);
      assert.deepEqual(deserializeGraph(json).graph, a.graph);
      assert.doesNotThrow(() =>
        transpileToCrewAI(
          a.graph!.nodes,
          a.graph!.edges,
          a.graph!.crewConfig,
          "scaffold",
        ),
      );
      assert.equal(a.report.frameworkVersion, null);
      assert.equal(a.report.frameworkVersionKnowledge, "UNKNOWN");
    }
  });
  test("projects all canonical relation directions and task order", () => {
    const r = run("supported-tools-context.py");
    assert.ok(r.graph);
    const types = new Map(r.graph!.nodes.map((n) => [n.id, n.type]));
    assert.deepEqual(
      new Set(
        r.graph!.edges.map(
          (e) => `${types.get(e.source)}->${types.get(e.target)}`,
        ),
      ),
      new Set(["tool->agent", "tool->task", "agent->task", "task->task"]),
    );
    assert.deepEqual(
      r.graph!.nodes.filter((n) => n.type === "task").map((n) => n.data.label),
      ["Research", "Write"],
    );
  });
  test("maps aliases, guards, task options and generated name metadata", () => {
    const r = run("supported-agent-guards.py");
    assert.ok(r.graph);
    assert.equal(r.graph!.crewConfig.name, "Guarded Crew");
    const a: any = r.graph!.nodes.find((n) => n.type === "agent")!.data,
      t: any = r.graph!.nodes.find((n) => n.type === "task")!.data;
    assert.deepEqual(
      {
        verbose: a.verbose,
        allowDelegation: a.allowDelegation,
        maxIter: a.maxIter,
        maxRpm: a.maxRpm,
        maxExecutionTime: a.maxExecutionTime,
        respectContextWindow: a.respectContextWindow,
        cache: a.cache,
      },
      {
        verbose: false,
        allowDelegation: true,
        maxIter: 7,
        maxRpm: 20,
        maxExecutionTime: 60,
        respectContextWindow: false,
        cache: false,
      },
    );
    assert.deepEqual(
      {
        asyncExecution: t.asyncExecution,
        markdown: t.markdown,
        outputFile: t.outputFile,
        humanInput: t.humanInput,
      },
      {
        asyncExecution: true,
        markdown: true,
        outputFile: "result.md",
        humanInput: true,
      },
    );
  });
  test("blocks dynamic, custom, structured, multiple roots, decorator and order conflict", () => {
    const cases: Record<string, string> = {
      "blocked-dynamic-value.py": "SOURCE_VALUE_DYNAMIC",
      "blocked-dynamic-tools.py": "SOURCE_VALUE_DYNAMIC",
      "blocked-custom-tool.py": "CUSTOM_TOOL_UNSUPPORTED",
      "blocked-structured-output.py": "STRUCTURED_OUTPUT_UNSUPPORTED",
      "blocked-multiple-crews.py": "MULTIPLE_CREW_ROOTS",
      "blocked-decorator-crewbase.py": "SOURCE_CONSTRUCT_UNSUPPORTED",
      "blocked-task-order-conflict.py": "TASK_ORDER_CONTEXT_CONFLICT",
      "syntax-error.py": "SOURCE_SYNTAX_INVALID",
    };
    for (const [name, code] of Object.entries(cases)) {
      const r = run(name);
      assert.equal(r.state, "BLOCKED", name);
      assert.equal(r.graph, null);
      assert.ok(
        r.report.diagnostics.some((d) => d.code === code && d.blocking),
        `${name}: ${r.report.diagnostics.map((d) => d.code)}`,
      );
    }
  });
  test("enforces file, byte, UTF-8 and empty boundaries", () => {
    assert.equal(
      importCrewAISource("x.txt", new Uint8Array([1])).report.diagnostics[0]
        .code,
      "SOURCE_FILE_TYPE_UNSUPPORTED",
    );
    assert.equal(
      importCrewAISource("x.py", new Uint8Array()).report.diagnostics[0].code,
      "SOURCE_EMPTY",
    );
    assert.equal(
      importCrewAISource("x.py", new Uint8Array([0xff])).report.diagnostics[0]
        .code,
      "SOURCE_ENCODING_INVALID",
    );
    assert.equal(
      importCrewAISource("x.py", new Uint8Array(CREWAI_IMPORT_MAX_BYTES + 1))
        .report.diagnostics[0].code,
      "SOURCE_FILE_TOO_LARGE",
    );
  });
  test("parsing malicious source performs no file/process/network/runtime side effects", () => {
    const marker = "CREWAI_IMPORT_MUST_NOT_EXIST";
    assert.equal(existsSync(marker), false);
    const r = run("malicious-never-execute.py");
    assert.equal(r.state, "READY");
    assert.equal(existsSync(marker), false);
    assert.ok(
      r.report.diagnostics.some((d) => d.code === "BOOTSTRAP_CODE_EXCLUDED"),
    );
  });
  test("provenance is sanitized, located, deterministic, and separate from graph", () => {
    const r = importCrewAISource(
      "C:\\private\\supported-minimal.py",
      load("supported-minimal.py"),
    );
    assert.equal(r.report.sourceFile, "supported-minimal.py");
    assert.ok(
      r.report.diagnostics.some((d) => d.source?.line && d.source.symbol),
    );
    assert.equal(JSON.stringify(r.graph).includes("adapterVersion"), false);
    assert.equal(
      JSON.stringify(r.graph).includes("supported-minimal.py"),
      false,
    );
  });
});
