'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useNodesState, useEdgesState, Edge } from '@xyflow/react';
import confetti from 'canvas-confetti';
import { Header } from '@/components/editor/Header';
import { Sidebar } from '@/components/editor/Sidebar';
import { Canvas } from '@/components/editor/Canvas';
import { Inspector } from '@/components/editor/Inspector';
import { CodeExportModal } from '@/components/editor/CodeExportModal';
import { CustomNode, CrewConfig, WorkflowTemplate, GraphData } from '@/types/editor';
import { transpileToCrewAI } from '@/lib/transpiler/crewai';
import { PRESET_TEMPLATES } from '@/lib/presets';

const STORAGE_KEY = 'agentgraph_active_flow';

const initialDefaultPreset = PRESET_TEMPLATES[0];

import { Code2, Zap } from 'lucide-react';

export default function EditorPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>(
    initialDefaultPreset.graphData.nodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(
    initialDefaultPreset.graphData.edges
  );
  const [crewConfig, setCrewConfig] = useState<CrewConfig>(
    initialDefaultPreset.graphData.crewConfig
  );

  const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [purchaseSuccessMessage, setPurchaseSuccessMessage] = useState<string | null>(null);

  // Load state from localStorage or query params on initial mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const searchParams = new URLSearchParams(window.location.search);
    const isSuccess = searchParams.get('success');
    const templateId = searchParams.get('template_id');

    if (isSuccess === 'true' && templateId) {
      const template = PRESET_TEMPLATES.find((t) => t.id === templateId);
      if (template) {
        setNodes(template.graphData.nodes);
        setEdges(template.graphData.edges);
        setCrewConfig(template.graphData.crewConfig);
        setPurchaseSuccessMessage(`🎉 Successfully purchased and unlocked "${template.title}"!`);

        // Confetti celebration
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        // Clean up URL parameters
        window.history.replaceState({}, '', '/');
        return;
      }
    }

    // Otherwise load from localStorage if available
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: GraphData = JSON.parse(saved);
        if (parsed.nodes && parsed.edges) {
          setNodes(parsed.nodes);
          setEdges(parsed.edges);
          if (parsed.crewConfig) setCrewConfig(parsed.crewConfig);
        }
      } catch (err) {
        console.error('Failed to parse saved graph:', err);
      }
    }
  }, [setNodes, setEdges]);

  // Save state to localStorage on node/edge/config changes
  useEffect(() => {
    if (nodes.length > 0) {
      const graphData: GraphData = { nodes, edges, crewConfig };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(graphData));
    }
  }, [nodes, edges, crewConfig]);

  // Node selection sync
  const handleNodeSelect = useCallback((node: CustomNode | null) => {
    setSelectedNode(node);
  }, []);

  // Update selected node data from Inspector
  const handleUpdateNodeData = useCallback(
    (nodeId: string, newData: Record<string, unknown>) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...newData,
              },
            };
          }
          return node;
        })
      );
      setSelectedNode((prev) =>
        prev && prev.id === nodeId ? { ...prev, data: { ...prev.data, ...newData } } : prev
      );
    },
    [setNodes]
  );

  // Delete node from Canvas or Inspector
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
      setSelectedNode(null);
    },
    [setNodes, setEdges]
  );

  // Load preset template
  const handleLoadPreset = useCallback(
    (tmpl: WorkflowTemplate) => {
      setNodes(tmpl.graphData.nodes);
      setEdges(tmpl.graphData.edges);
      setCrewConfig(tmpl.graphData.crewConfig);
      setSelectedNode(null);
    },
    [setNodes, setEdges]
  );

  // Clear Canvas
  const handleClearCanvas = useCallback(() => {
    if (confirm('Are you sure you want to clear the canvas?')) {
      setNodes([]);
      setEdges([]);
      setSelectedNode(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [setNodes, setEdges]);

  // Transpile to Python Code
  const handleGenerateCode = useCallback(() => {
    const code = transpileToCrewAI(nodes, edges, crewConfig);
    setGeneratedCode(code);
    setIsCodeModalOpen(true);
  }, [nodes, edges, crewConfig]);

  // Export Graph JSON
  const handleExportJson = useCallback(() => {
    const data: GraphData = { nodes, edges, crewConfig };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agentgraph_${crewConfig.name.toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges, crewConfig]);

  // Import Graph JSON
  const handleImportJson = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed: GraphData = JSON.parse(event.target?.result as string);
          if (parsed.nodes && parsed.edges) {
            setNodes(parsed.nodes);
            setEdges(parsed.edges);
            if (parsed.crewConfig) setCrewConfig(parsed.crewConfig);
            setSelectedNode(null);
          } else {
            alert('Invalid Workflow JSON format');
          }
        } catch (err) {
          alert('Failed to parse JSON file');
        }
      };
      reader.readAsText(file);
    },
    [setNodes, setEdges]
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Header */}
      <Header
        onGenerateCode={handleGenerateCode}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onClearCanvas={handleClearCanvas}
        onLoadPreset={handleLoadPreset}
        nodeCount={nodes.length}
      />

      {/* Developer & Marketer Target Value Proposition Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-violet-950 border-b border-indigo-900/50 px-4 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 z-20 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-md bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
            <span className="font-extrabold text-xs text-white tracking-wide uppercase bg-indigo-600/40 px-2 py-0.5 rounded border border-indigo-500/40">
              Visual Builder for CrewAI - No Vendor Lock-in
            </span>
            <span className="text-xs text-slate-300">
              ブラウザ上でAIエージェントを設計し、実行可能な生のPythonコード（<code className="text-indigo-300 font-mono">main.py</code>）を1秒で出力します。APIキーの入力不要・100%ローカル実行対応。
            </span>
          </div>
        </div>
      </div>

      {/* Purchase Success Banner */}
      {purchaseSuccessMessage && (
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-b border-emerald-800/60 px-4 py-2 flex items-center justify-between text-xs text-emerald-300 z-40 animate-in slide-in-from-top">
          <span>{purchaseSuccessMessage}</span>
          <button
            onClick={() => setPurchaseSuccessMessage(null)}
            className="text-emerald-400 hover:text-emerald-200 underline text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Palette & Presets Sidebar */}
        <Sidebar onLoadPreset={handleLoadPreset} />

        {/* Central React Flow Canvas */}
        <Canvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          setNodes={setNodes}
          setEdges={setEdges}
          onNodeSelect={handleNodeSelect}
        />

        {/* Right Parameter Inspector Panel */}
        <Inspector
          selectedNode={selectedNode}
          onUpdateNodeData={handleUpdateNodeData}
          onDeleteNode={handleDeleteNode}
          crewConfig={crewConfig}
          onUpdateCrewConfig={(newConfig) => setCrewConfig((prev) => ({ ...prev, ...newConfig }))}
        />
      </div>

      {/* Transpiled Python Code Export Modal */}
      <CodeExportModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        code={generatedCode}
      />
    </div>
  );
}
