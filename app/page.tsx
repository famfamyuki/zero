'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useNodesState, useEdgesState, Edge } from '@xyflow/react';
import confetti from 'canvas-confetti';
import { Header } from '@/components/editor/Header';
import { Sidebar } from '@/components/editor/Sidebar';
import { Canvas } from '@/components/editor/Canvas';
import { Inspector } from '@/components/editor/Inspector';
import { CodeExportModal } from '@/components/editor/CodeExportModal';
import { CustomNode, CrewConfig, WorkflowTemplate, GraphData, NodeType, AgentNodeData, TaskNodeData, ToolNodeData } from '@/types/editor';
import { transpileToCrewAI } from '@/lib/transpiler/crewai';
import { PRESET_TEMPLATES } from '@/lib/presets';
import { Code2, Zap, Layers, Sliders } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const STORAGE_KEY = 'agentgraph_active_flow';
const initialDefaultPreset = PRESET_TEMPLATES[0];

export default function EditorPage() {
  const { t } = useLanguage();

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

  // Mobile Drawer State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileInspectorOpen, setIsMobileInspectorOpen] = useState(false);

  // Load from LocalStorage or Active Flow
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: GraphData = JSON.parse(saved);
        if (parsed.nodes && parsed.edges) {
          setNodes(parsed.nodes);
          setEdges(parsed.edges);
          if (parsed.crewConfig) setCrewConfig(parsed.crewConfig);
        }
      }
    } catch (e) {
      console.error('Failed to load active flow:', e);
    }
  }, [setNodes, setEdges]);

  // Listen for explicit node edit clicks (gear button on node card)
  useEffect(() => {
    const handleOpenInspector = (e: Event) => {
      const customEvt = e as CustomEvent<{ nodeId: string }>;
      const nodeId = customEvt.detail?.nodeId;
      if (nodeId) {
        const target = nodes.find((n) => n.id === nodeId);
        if (target) setSelectedNode(target);
      }
      if (window.innerWidth < 768) {
        setIsMobileInspectorOpen(true);
      }
    };
    window.addEventListener('open-node-inspector', handleOpenInspector);
    return () => window.removeEventListener('open-node-inspector', handleOpenInspector);
  }, [nodes]);

  // Listen for explicit node delete clicks from node card action toolbar
  useEffect(() => {
    const handleDeleteEvent = (e: Event) => {
      const customEvt = e as CustomEvent<{ nodeId: string }>;
      const nodeId = customEvt.detail?.nodeId;
      if (nodeId) {
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));
        setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
        setSelectedNode((prev) => (prev && prev.id === nodeId ? null : prev));
      }
    };
    window.addEventListener('delete-node-id', handleDeleteEvent);
    return () => window.removeEventListener('delete-node-id', handleDeleteEvent);
  }, [setNodes, setEdges]);

  // Handle Preset Loading
  const handleLoadPreset = useCallback(
    (template: WorkflowTemplate) => {
      setNodes(template.graphData.nodes);
      setEdges(template.graphData.edges);
      setCrewConfig(template.graphData.crewConfig);
      setSelectedNode(null);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    },
    [setNodes, setEdges]
  );

  // Add Node from Tap/Click Handler (Mobile Ergonomics)
  const handleAddNode = useCallback(
    (type: NodeType) => {
      let data: AgentNodeData | TaskNodeData | ToolNodeData;
      if (type === 'agent') {
        data = {
          label: 'New Agent',
          role: 'AI Specialist',
          goal: 'Perform analysis and execution',
          backstory: 'Expert assistant in specialized domain',
          model: 'gpt-4o',
          verbose: true,
          allowDelegation: false,
        };
      } else if (type === 'task') {
        data = {
          label: 'New Task',
          description: 'Define specific task details here',
          expectedOutput: 'Clear summary output format',
          asyncExecution: false,
        };
      } else {
        data = {
          label: 'New Tool',
          toolType: 'SerperDevTool',
          description: 'Search Google API Tool',
        };
      }

      const offset = (nodes.length % 5) * 35;
      const newNode: CustomNode = {
        id: `${type}-${Date.now()}`,
        type,
        position: { x: 200 + offset, y: 150 + offset },
        data,
      };

      setNodes((nds) => nds.concat(newNode));
      setSelectedNode(newNode);
    },
    [nodes.length, setNodes]
  );

  // Node Selection Handler
  const handleNodeSelect = useCallback((node: CustomNode | null) => {
    setSelectedNode(node);
  }, []);

  // Update Node Data Field
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
      setSelectedNode((prev) => (prev && prev.id === nodeId ? { ...prev, data: { ...prev.data, ...newData } } : prev));
    },
    [setNodes]
  );

  // Delete Node Handler
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
      setSelectedNode((prev) => (prev && prev.id === nodeId ? null : prev));
    },
    [setNodes, setEdges]
  );

  // Clear Canvas Handler
  const handleClearCanvas = useCallback(() => {
    if (window.confirm('Clear all nodes and connections?')) {
      setNodes([]);
      setEdges([]);
      setSelectedNode(null);
    }
  }, [setNodes, setEdges]);

  // Transpile CrewAI Python Code
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
              {t('mainCopy')}
            </span>
            <span className="text-xs text-slate-300">
              {t('subCopy')}
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
        <Sidebar
          onLoadPreset={handleLoadPreset}
          onAddNode={handleAddNode}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

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

        {/* Mobile Floating Drawer Toolbar */}
        <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-slate-900/90 border border-slate-800 backdrop-blur-md p-1.5 rounded-full shadow-2xl">
          <button
            onClick={() => {
              setIsMobileSidebarOpen(!isMobileSidebarOpen);
              setIsMobileInspectorOpen(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Palette</span>
          </button>

          <button
            onClick={() => {
              setIsMobileInspectorOpen(!isMobileInspectorOpen);
              setIsMobileSidebarOpen(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-md"
          >
            <Sliders className="w-3.5 h-3.5 text-white" />
            <span>Inspector</span>
          </button>
        </div>

        {/* Right Parameter Inspector Panel */}
        <Inspector
          selectedNode={selectedNode}
          onUpdateNodeData={handleUpdateNodeData}
          onDeleteNode={handleDeleteNode}
          crewConfig={crewConfig}
          onUpdateCrewConfig={(newConfig) => setCrewConfig((prev) => ({ ...prev, ...newConfig }))}
          isMobileOpen={isMobileInspectorOpen}
          onCloseMobile={() => setIsMobileInspectorOpen(false)}
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
