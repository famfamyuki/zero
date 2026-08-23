'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNodesState, useEdgesState, Edge } from '@xyflow/react';
import confetti from 'canvas-confetti';
import { Header } from '@/components/editor/Header';
import { Sidebar } from '@/components/editor/Sidebar';
import { Canvas } from '@/components/editor/Canvas';
import { Inspector } from '@/components/editor/Inspector';
import { CodeExportModal } from '@/components/editor/CodeExportModal';
import { CustomNode, CrewConfig, WorkflowTemplate, GraphData, NodeType, AgentNodeData, TaskNodeData, ToolNodeData } from '@/types/editor';
import { PRESET_TEMPLATES } from '@/lib/presets';
import { DEFAULT_LLM_MODEL } from '@/lib/models';
import Link from 'next/link';
import { Code2, Zap, Layers, Sliders, Sparkles, Coffee, ExternalLink, Upload } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { trackEvent } from '@/lib/analytics';
import { deserializeGraph, GraphDeserializationError, serializeGraph } from '@/lib/graph-json';
import { validateGraph } from '@/lib/transpiler/validation';
import { useReadinessEvaluation } from '@/hooks/useReadinessEvaluation';
import { ReadinessPanel } from '@/components/editor/readiness/ReadinessPanel';
import type { ReadinessFinding } from '@/types/readiness';

const STORAGE_KEY = 'agentgraph_active_flow';
const initialDefaultPreset = PRESET_TEMPLATES[0];

export default function EditorPage() {
  const { lang, t } = useLanguage();

  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>(
    initialDefaultPreset.graphData.nodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(
    initialDefaultPreset.graphData.edges
  );
  const [crewConfig, setCrewConfig] = useState<CrewConfig>(
    initialDefaultPreset.graphData.crewConfig
  );

  // History State for Undo/Redo
  const historyRef = useRef([{ nodes: initialDefaultPreset.graphData.nodes, edges: initialDefaultPreset.graphData.edges }]);
  const historyIndexRef = useRef(0);
  const latestNodes = useRef(nodes);
  const latestEdges = useRef(edges);
  const isLoadedRef = useRef(false);
  const skipNextAutosaveRef = useRef(false);

  useEffect(() => {
    latestNodes.current = nodes;
    latestEdges.current = edges;
  }, [nodes, edges]);

  const takeSnapshot = useCallback(() => {
    setTimeout(() => {
      const currentNodes = latestNodes.current;
      const currentEdges = latestEdges.current;
      const currentHistory = historyRef.current;
      const currentIndex = historyIndexRef.current;
      
      const lastState = currentHistory[currentIndex];
      if (lastState && JSON.stringify(lastState.nodes) === JSON.stringify(currentNodes) && JSON.stringify(lastState.edges) === JSON.stringify(currentEdges)) {
        return;
      }
      
      const nextHistory = currentHistory.slice(0, currentIndex + 1);
      nextHistory.push({ nodes: currentNodes, edges: currentEdges });
      if (nextHistory.length > 50) nextHistory.shift();
      
      historyRef.current = nextHistory;
      historyIndexRef.current = nextHistory.length - 1;
    }, 10);
  }, []);

  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      const newIndex = historyIndexRef.current - 1;
      historyIndexRef.current = newIndex;
      setNodes(historyRef.current[newIndex].nodes);
      setEdges(historyRef.current[newIndex].edges);
      setSelectedNode(null);
    }
  }, [setNodes, setEdges]);

  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      const newIndex = historyIndexRef.current + 1;
      historyIndexRef.current = newIndex;
      setNodes(historyRef.current[newIndex].nodes);
      setEdges(historyRef.current[newIndex].edges);
      setSelectedNode(null);
    }
  }, [setNodes, setEdges]);

  // Keyboard shortcut listener for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
      
      if (cmdOrCtrl && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      } else if (
        (cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'z') ||
        (cmdOrCtrl && e.key.toLowerCase() === 'y')
      ) {
        e.preventDefault();
        redo();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [purchaseSuccessMessage, setPurchaseSuccessMessage] = useState<string | null>(null);
  const [recoveryNotice, setRecoveryNotice] = useState(false);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isReadinessOpen, setIsReadinessOpen] = useState(false);
  const [readinessNotice, setReadinessNotice] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isJsonDragActive, setIsJsonDragActive] = useState(false);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const readinessGraph = useMemo<GraphData>(() => ({ nodes, edges, crewConfig }), [nodes, edges, crewConfig]);
  const readiness = useReadinessEvaluation(readinessGraph);

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!workspaceRef.current) return;
    if (!document.fullscreenElement) {
      if (workspaceRef.current.requestFullscreen) {
        workspaceRef.current.requestFullscreen().catch((err) => console.warn(err));
      } else if ((workspaceRef.current as any).webkitRequestFullscreen) {
        (workspaceRef.current as any).webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
  }, []);

  // Load from LocalStorage on Mount (Rehydration)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { graph } = deserializeGraph(saved);
        setNodes(graph.nodes);
        setEdges(graph.edges);
        setCrewConfig(graph.crewConfig);
        historyRef.current = [{ nodes: graph.nodes, edges: graph.edges }];
        historyIndexRef.current = 0;
      }
    } catch (e) {
      skipNextAutosaveRef.current = true;
      setRecoveryNotice(true);
      console.error('Failed to load active flow:', e instanceof GraphDeserializationError ? e.issue.code : e);
    } finally {
      isLoadedRef.current = true;
    }
  }, [setNodes, setEdges]);

  // Auto-sync state changes to LocalStorage
  useEffect(() => {
    if (!isLoadedRef.current) return;
    if (skipNextAutosaveRef.current) {
      skipNextAutosaveRef.current = false;
      return;
    }
    try {
      const dataToSave: GraphData = {
        nodes,
        edges,
        crewConfig,
      };
      localStorage.setItem(STORAGE_KEY, serializeGraph(dataToSave));
    } catch (e) {
      console.error('Failed to auto-save flow to localStorage:', e);
    }
  }, [nodes, edges, crewConfig]);

  // Listen for explicit node edit clicks (gear button on node card)
  useEffect(() => {
    const handleOpenInspector = (e: Event) => {
      const customEvt = e as CustomEvent<{ nodeId: string }>;
      const nodeId = customEvt.detail?.nodeId;
      if (nodeId) {
        const target = nodes.find((n) => n.id === nodeId);
        if (target) {
          setSelectedNode(target);
          setIsInspectorOpen(true);
          setIsReadinessOpen(false);
        }
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
        takeSnapshot();
      }
    };
    window.addEventListener('delete-node-id', handleDeleteEvent);
    return () => window.removeEventListener('delete-node-id', handleDeleteEvent);
  }, [setNodes, setEdges, takeSnapshot]);

  // Handle Preset Loading
  const handleLoadPreset = useCallback(
    (template: WorkflowTemplate) => {
      const validation = validateGraph(template.graphData.nodes, template.graphData.edges, template.graphData.crewConfig, 'scaffold');
      if (!validation.isValid) {
        console.error('Internal preset validation failed:', validation.errors.map((issue) => issue.code));
        alert(t('presetValidationFailed'));
        return;
      }
      setNodes(template.graphData.nodes);
      setEdges(template.graphData.edges);
      setCrewConfig(template.graphData.crewConfig);
      setSelectedNode(null);
      try {
        localStorage.setItem(STORAGE_KEY, serializeGraph(template.graphData));
      } catch (e) {
        console.error('Failed to save preset to localStorage:', e);
      }
      takeSnapshot();
      trackEvent('template_selected', { template_id: template.id, source: 'sidebar' });
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    },
    [setNodes, setEdges, takeSnapshot, t]
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
          model: DEFAULT_LLM_MODEL,
          verbose: true,
          allowDelegation: false,
        };
      } else if (type === 'task') {
        data = {
          label: 'New Task',
          description: 'Define specific task details here',
          expectedOutput: 'Clear summary output format',
          outputFormat: 'text',
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
      takeSnapshot();
    },
    [nodes.length, setNodes, takeSnapshot]
  );

  // Node Selection Handler
  const handleNodeSelect = useCallback((node: CustomNode | null) => {
    setSelectedNode(node);
    if (node) {
      setIsInspectorOpen(true);
      setIsReadinessOpen(false);
    }
  }, []);

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
    setIsInspectorOpen(false);
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
      takeSnapshot();
    },
    [setNodes, takeSnapshot]
  );

  // Delete Node Handler
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
      setSelectedNode((prev) => (prev && prev.id === nodeId ? null : prev));
      takeSnapshot();
    },
    [setNodes, setEdges, takeSnapshot]
  );

  // Clear Canvas Handler
  const handleClearCanvas = useCallback(() => {
    if (window.confirm('Clear all nodes and connections?')) {
      setNodes([]);
      setEdges([]);
      setSelectedNode(null);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error('Failed to remove flow from localStorage:', e);
      }
      takeSnapshot();
    }
  }, [setNodes, setEdges, takeSnapshot]);

  // Transpile CrewAI Python Code & Open Modal
  const handleGenerateCode = useCallback(() => {
    trackEvent('code_generated');
    setIsCodeModalOpen(true);
  }, []);

  const handleOpenReadiness = useCallback(() => {
    const current = readiness.evaluateNow();
    setIsInspectorOpen(false);
    setIsMobileSidebarOpen(false);
    setReadinessNotice(null);
    setIsReadinessOpen(true);
    if (current) trackEvent('readiness_opened', { status: current.status, evaluable: current.evaluable, ruleset_version: current.rulesetVersion });
  }, [readiness]);

  const handleLocateFinding = useCallback((finding: ReadinessFinding) => {
    const target = finding.target;
    trackEvent('readiness_finding_selected', { rule_id: finding.ruleId, impact: finding.impact, category: finding.category, target_scope: target.scope });
    if (target.nodeId) {
      const node = latestNodes.current.find((item) => item.id === target.nodeId);
      if (!node) {
        readiness.evaluateNow();
        setReadinessNotice(lang === 'ja' ? '対象が変更されたため、Readinessを更新しました。' : 'Target changed. Readiness was refreshed.');
        return;
      }
      setNodes((items) => items.map((item) => ({ ...item, selected: item.id === target.nodeId })));
      setEdges((items) => items.map((item) => ({ ...item, selected: false })));
      setSelectedNode(node);
      setIsReadinessOpen(false);
      setIsMobileSidebarOpen(false);
      setIsInspectorOpen(true);
      requestAnimationFrame(() => {
        window.dispatchEvent(new CustomEvent('focus-flow-node', { detail: { nodeId: target.nodeId } }));
        window.dispatchEvent(new Event('focus-inspector-heading'));
      });
      return;
    }
    if (target.edgeId) {
      const edge = latestEdges.current.find((item) => item.id === target.edgeId);
      if (!edge) {
        readiness.evaluateNow();
        setReadinessNotice(lang === 'ja' ? '対象が変更されたため、Readinessを更新しました。' : 'Target changed. Readiness was refreshed.');
        return;
      }
      setNodes((items) => items.map((item) => ({ ...item, selected: false })));
      setEdges((items) => items.map((item) => ({ ...item, selected: item.id === target.edgeId })));
      setSelectedNode(null); setIsInspectorOpen(false); setIsReadinessOpen(false);
      requestAnimationFrame(() => window.dispatchEvent(new CustomEvent('focus-flow-edge', { detail: { edgeId: target.edgeId } })));
      return;
    }
    setSelectedNode(null); setIsReadinessOpen(false); setIsMobileSidebarOpen(false); setIsInspectorOpen(true);
    requestAnimationFrame(() => window.dispatchEvent(new Event('focus-inspector-heading')));
  }, [lang, readiness, setEdges, setNodes]);

  const readinessTargetSummary = useCallback((finding: ReadinessFinding) => {
    const target = finding.target;
    if (target.nodeId) return `${latestNodes.current.find((node) => node.id === target.nodeId)?.data.label || target.nodeId}${target.field ? ` · ${target.field}` : ''}`;
    if (target.edgeId) { const edge = latestEdges.current.find((item) => item.id === target.edgeId); return edge ? `${edge.source} → ${edge.target}` : target.edgeId; }
    if (target.field) return `Crew Config · ${target.field}`;
    return lang === 'ja' ? 'ワークフロー全体' : 'Whole workflow';
  }, [lang]);

  const handleEditExportError = useCallback((nodeId?: string) => {
    setIsCodeModalOpen(false);
    if (!nodeId) return;

    const targetNode = nodes.find((node) => node.id === nodeId);
    if (!targetNode) return;

    setNodes((currentNodes) =>
      currentNodes.map((node) => ({ ...node, selected: node.id === nodeId }))
    );
    setSelectedNode(targetNode);
    setIsInspectorOpen(true);
    setIsMobileSidebarOpen(false);
    requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent('focus-flow-node', { detail: { nodeId } }));
    });
  }, [nodes, setNodes]);

  // Export Graph JSON
  const handleExportJson = useCallback(() => {
    const data: GraphData = { nodes, edges, crewConfig };
    const blob = new Blob([serializeGraph(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agentgraph_${crewConfig.name.toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges, crewConfig]);

  // Import Graph JSON from either the file picker or a desktop file drop.
  const importGraphFile = useCallback(
    async (file: File, source: 'button' | 'drag_drop') => {
      if (!file.name.toLowerCase().endsWith('.json')) {
        alert(t('jsonFileOnly'));
        return;
      }

      try {
        const { graph } = deserializeGraph(await file.text());
        if ((nodes.length > 0 || edges.length > 0) && !window.confirm(t('replaceWorkflowConfirm'))) {
          return;
        }
        setNodes(graph.nodes);
        setEdges(graph.edges);
        setCrewConfig(graph.crewConfig);
        setSelectedNode(null);
        historyRef.current = [{ nodes: graph.nodes, edges: graph.edges }];
        historyIndexRef.current = 0;

        try {
          localStorage.setItem(STORAGE_KEY, serializeGraph(graph));
        } catch (err) {
          console.error('Failed to save imported JSON to localStorage:', err);
        }

        trackEvent('json_imported', { source });
      } catch (err) {
        if (err instanceof GraphDeserializationError) {
          console.error('JSON import rejected:', err.issue.code);
          alert(err.issue.code === 'JSON_SYNTAX_INVALID'
            ? t('jsonParseFailed')
            : err.issue.code === 'GRAPH_SCHEMA_VERSION_UNSUPPORTED'
              ? t('jsonSchemaUnsupported')
              : t('jsonDocumentInvalid'));
        } else {
          alert(t('jsonDocumentInvalid'));
        }
      }
    },
    [edges.length, nodes.length, setNodes, setEdges, t]
  );

  const handleImportJson = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (file) void importGraphFile(file, 'button');
    },
    [importGraphFile]
  );

  const handleWorkspaceDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    if (Array.from(event.dataTransfer.types).includes('Files')) {
      event.preventDefault();
      setIsJsonDragActive(true);
    }
  }, []);

  const handleJsonDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsJsonDragActive(false);

    const files = Array.from(event.dataTransfer.files);
    if (files.length !== 1) {
      alert(t('singleJsonFileOnly'));
      return;
    }
    void importGraphFile(files[0], 'drag_drop');
  }, [importGraphFile, t]);

  useEffect(() => {
    const clearFileDragState = () => setIsJsonDragActive(false);
    window.addEventListener('drop', clearFileDragState);
    window.addEventListener('dragend', clearFileDragState);
    return () => {
      window.removeEventListener('drop', clearFileDragState);
      window.removeEventListener('dragend', clearFileDragState);
    };
  }, []);

  return (
    <div className="min-h-[100dvh] h-[100dvh] w-full max-w-full flex flex-col bg-slate-950 text-slate-100 overflow-x-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Header */}
      <Header
        onGenerateCode={handleGenerateCode}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onClearCanvas={handleClearCanvas}
        onLoadPreset={handleLoadPreset}
        onToggleSettings={() => {
          setSelectedNode(null);
          setIsReadinessOpen(false);
          setIsInspectorOpen(!isInspectorOpen);
        }}
        nodeCount={nodes.length}
      />

      {/* Developer & Marketer Target Value Proposition Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-violet-950 border-b border-indigo-900/50 px-3 sm:px-4 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 z-20 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="font-extrabold text-[10px] sm:text-xs text-white tracking-wide uppercase bg-indigo-600/40 px-1.5 py-0.5 rounded border border-indigo-500/40">
              {t('mainCopy')}
            </span>
            <span className="text-[11px] sm:text-xs text-slate-300">
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

      {recoveryNotice && (
        <div className="z-40 flex items-center justify-between border-b border-amber-700/60 bg-amber-950 px-4 py-2 text-xs text-amber-200">
          <span>{t('storageRecoveryNotice')}</span>
          <button type="button" onClick={() => setRecoveryNotice(false)} className="text-amber-300 underline hover:text-amber-100">
            {lang === 'ja' ? '閉じる' : 'Dismiss'}
          </button>
        </div>
      )}

      {/* Main Workspace Area */}
      <div
        className="flex-1 flex overflow-hidden relative"
        ref={workspaceRef}
        onDragEnter={handleWorkspaceDragEnter}
      >
        {isJsonDragActive && (
          <div
            className="absolute inset-0 z-[70] flex items-center justify-center bg-slate-950/85 p-5 backdrop-blur-sm"
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = 'copy';
            }}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setIsJsonDragActive(false);
              }
            }}
            onDrop={handleJsonDrop}
          >
            <div className="pointer-events-none flex max-w-md flex-col items-center rounded-3xl border-2 border-dashed border-emerald-400/80 bg-emerald-950/45 px-8 py-10 text-center shadow-2xl shadow-emerald-950/50">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/50 bg-emerald-500/15">
                <Upload className="h-7 w-7 text-emerald-300" />
              </div>
              <strong className="text-base font-extrabold text-emerald-100">{t('dropJsonTitle')}</strong>
              <span className="mt-2 text-xs leading-relaxed text-slate-300">{t('dropJsonHint')}</span>
            </div>
          </div>
        )}
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
          onPaneClick={handlePaneClick}
          onNodeDragStop={takeSnapshot}
          toggleFullscreen={toggleFullscreen}
          isFullscreen={isFullscreen}
          readinessStatus={readiness.result?.status ?? 'not_evaluable'}
          isReadinessOpen={isReadinessOpen}
          onOpenReadiness={handleOpenReadiness}
        />

        {/* Mobile Floating Drawer & Navigation Toolbar */}
        {!isReadinessOpen && <div className="md:hidden absolute bottom-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-slate-900/95 border border-slate-800 backdrop-blur-md p-1.5 rounded-full shadow-2xl max-w-[95vw] overflow-x-auto">
          <button
            onClick={() => {
              setIsMobileSidebarOpen(!isMobileSidebarOpen);
              setIsInspectorOpen(false);
              setIsReadinessOpen(false);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition shrink-0"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="shrink-0">{t('mobilePalette') || 'Palette'}</span>
          </button>

          <Link
            href="/templates"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-semibold transition shrink-0 border border-amber-500/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="shrink-0">{t('mobileTemplates') || 'Templates'}</span>
          </Link>

          <label className="flex cursor-pointer items-center gap-1 rounded-full border border-emerald-500/30 bg-slate-800 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-300 transition hover:bg-slate-700 shrink-0">
            <Upload className="h-3.5 w-3.5 shrink-0" />
            <span className="shrink-0">{t('importJson')}</span>
            <input type="file" accept=".json,application/json" onChange={handleImportJson} className="hidden" />
          </label>

          <button
            onClick={handleGenerateCode}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-[11px] transition shadow-lg shadow-emerald-500/30 shrink-0"
          >
            <Code2 className="w-3.5 h-3.5 text-slate-950 shrink-0" />
            <span className="shrink-0">{t('mobileExport') || 'Export Code'}</span>
          </button>

          <button
            onClick={() => {
              setIsInspectorOpen(!isInspectorOpen);
              setIsMobileSidebarOpen(false);
              setIsReadinessOpen(false);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition shrink-0"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <span className="shrink-0">{t('mobileInspector') || 'Inspector'}</span>
          </button>
        </div>}

        {/* Dedicated Mobile Bottom Sticky Support Banner (sm:hidden) */}
        {!isReadinessOpen && <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 px-3 py-2 bg-slate-950/95 border-t border-emerald-500/60 backdrop-blur-md flex items-center justify-between gap-2 shadow-2xl">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border-amber-400/50 text-amber-300 flex items-center justify-center shrink-0 border">
              <Coffee className="w-3.5 h-3.5 shrink-0" />
            </div>
            <div className="truncate">
              <span className="font-extrabold text-[11px] text-amber-300 block leading-tight truncate">
                Support AgentGraph Studio
              </span>
              <span className="text-[9px] text-slate-400 block truncate">
                Help fund free templates, documentation, and continued development.
              </span>
            </div>
          </div>

          <a
            href="https://www.buymeacoffee.com/agentgraph"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('buymeacoffee_clicked', { placement: 'mobile_sticky' })}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/30 border-amber-300/60 font-extrabold text-[11px] shadow-lg shrink-0 border whitespace-nowrap active:scale-95 transition"
          >
            <span className="shrink-0">Buy me a coffee</span>
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
        </div>}

        {/* Right Parameter Inspector Panel */}
        <Inspector
          selectedNode={selectedNode}
          onUpdateNodeData={handleUpdateNodeData}
          onDeleteNode={handleDeleteNode}
          crewConfig={crewConfig}
          onUpdateCrewConfig={(newConfig) => setCrewConfig((prev) => ({ ...prev, ...newConfig }))}
          isOpen={isInspectorOpen}
          onClose={() => setIsInspectorOpen(false)}
        />
        <ReadinessPanel isOpen={isReadinessOpen} result={readiness.result} error={readiness.error} isRefreshing={readiness.isRefreshing} lang={lang} targetSummary={readinessTargetSummary} onClose={() => setIsReadinessOpen(false)} onRetry={readiness.evaluateNow} onLocate={handleLocateFinding} onOpenValidation={() => { setIsReadinessOpen(false); setIsCodeModalOpen(true); }} />
        {isReadinessOpen && readinessNotice && <div role="status" className="absolute bottom-[72dvh] right-3 z-[60] rounded-lg bg-cyan-950 px-3 py-2 text-xs text-cyan-200 md:bottom-3 md:right-[420px]">{readinessNotice}</div>}
      </div>

      {/* Transpiled Python Code Export Modal */}
      <CodeExportModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        onEditNode={handleEditExportError}
        nodes={nodes}
        edges={edges}
        crewConfig={crewConfig}
      />
    </div>
  );
}
