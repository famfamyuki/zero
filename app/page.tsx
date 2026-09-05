'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNodesState, useEdgesState, Edge } from '@xyflow/react';
import confetti from 'canvas-confetti';
import { Header, type EditorSurface } from '@/components/editor/Header';
import { WorkflowOverview, type PresentationOrigin } from '@/components/editor/WorkflowOverview';
import { ReviewReturnBar, type ReviewReturnContext } from '@/components/editor/ReviewReturnBar';
import { Sidebar } from '@/components/editor/Sidebar';
import { Canvas } from '@/components/editor/Canvas';
import { Inspector } from '@/components/editor/Inspector';
import { CodeExportModal } from '@/components/editor/CodeExportModal';
import { CrewAIImportReview } from '@/components/editor/CrewAIImportReview';
import { CustomNode, CrewConfig, WorkflowTemplate, GraphData, NodeType, AgentNodeData, TaskNodeData, ToolNodeData } from '@/types/editor';
import { PRESET_TEMPLATES } from '@/lib/presets';
import { DEFAULT_LLM_MODEL } from '@/lib/models';
import { Upload } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { trackEvent } from '@/lib/analytics';
import { deserializeGraph, GraphDeserializationError, serializeGraph } from '@/lib/graph-json';
import type { CrewAIImportResult } from '@/types/crewai-import';
import { validateGraph } from '@/lib/transpiler/validation';
import type { ReadinessFinding } from '@/types/readiness';
import { translateReadinessKey } from '@/lib/readiness/translations';
import type { ExecutionPreviewLocateSource, ExecutionPreviewTargetType } from '@/components/editor/execution-preview/ExecutionPreviewStepCard';
import { isNewNodeSelection, resolveExecutionPreviewNavigationTarget } from '@/lib/execution-preview-navigation';
import type { ResourceAnalysisLocateContext } from '@/components/editor/resource-analysis/ResourceAnalysisPanel';
import type { ResourceAnalysisTarget } from '@/types/resource-analysis';
import {
  createResourceAnalysisHotspotAnalyticsProperties,
  createResourceAnalysisOpenedAnalyticsProperties,
} from '@/lib/resource-analysis-analytics';
import {
  resolvePreflightNavigationTarget,
  shouldIgnoreSelectionChangeForOpenPreflight,
  type PreflightSelectionOwner,
} from '@/lib/preflight-navigation';
import { useUnifiedPreflight } from '@/hooks/useUnifiedPreflight';
import { useArchitectureReview } from '@/hooks/useArchitectureReview';
import { UnifiedPreflightPanel } from '@/components/editor/unified-preflight/UnifiedPreflightPanel';
import { UNIFIED_PREFLIGHT_REVIEW_VERSION, type UnifiedPreflightStage } from '@/types/unified-preflight';
import {
  PREFLIGHT_ACTIVATION_STORAGE_KEY,
  PREFLIGHT_ACTIVATION_VERSION,
  hasMeaningfulPreflightFirstValue,
  parsePreflightActivationPersistence,
  serializePreflightActivationPersistence,
  type PreflightActivationPersistentStatus,
  type PreflightActivationSource,
} from '@/lib/preflight-activation';

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
  const codeExportEntryRef = useRef<HTMLElement | null>(null);
  const [purchaseSuccessMessage, setPurchaseSuccessMessage] = useState<string | null>(null);
  const [recoveryNotice, setRecoveryNotice] = useState(false);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [readinessNotice, setReadinessNotice] = useState<string | null>(null);
  const [executionPreviewNotice, setExecutionPreviewNotice] = useState<string | null>(null);
  const [resourceAnalysisNotice, setResourceAnalysisNotice] = useState<string | null>(null);
  const [preflightUpdatedNotice, setPreflightUpdatedNotice] = useState<string | null>(null);
  const [isPreflightReviewOpen, setIsPreflightReviewOpen] = useState(false);
  const [surface, setSurface] = useState<EditorSurface>('overview');
  const [presentationOrigin, setPresentationOrigin] = useState<PresentationOrigin>('example');
  const [reviewReturnContext, setReviewReturnContext] = useState<ReviewReturnContext | null>(null);
  const [navigationAnnouncement, setNavigationAnnouncement] = useState('');
  const [workspaceHydrated, setWorkspaceHydrated] = useState(false);
  const [activationPersistenceHydrated, setActivationPersistenceHydrated] = useState(false);
  const [activationPersistentStatus, setActivationPersistentStatus] = useState<PreflightActivationPersistentStatus | null>(null);
  const [activationPromptVisible, setActivationPromptVisible] = useState(false);
  const [currentActivationAttemptSource, setCurrentActivationAttemptSource] = useState<PreflightActivationSource | null>(null);
  const [activePreflightStage, setActivePreflightStage] = useState<UnifiedPreflightStage>('overview');
  const [focusPreflightHeadingOnOpen, setFocusPreflightHeadingOnOpen] = useState(true);
  const preflightSelectionOwnerRef = useRef<PreflightSelectionOwner>(null);
  const preflightReviewEntryRef = useRef<HTMLButtonElement | null>(null);
  const activationPromptShownEmittedRef = useRef(false);
  const firstValueEmittedRef = useRef(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isJsonDragActive, setIsJsonDragActive] = useState(false);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const readinessGraph = useMemo<GraphData>(() => ({ nodes, edges, crewConfig }), [nodes, edges, crewConfig]);
  const preflight = useUnifiedPreflight(readinessGraph);
  const architectureReview = useArchitectureReview(readinessGraph, preflight, lang);
  const architectureTargetKeys = useMemo(() => new Set(nodes.map((node) => `node:${node.id}`)), [nodes]);
  const readiness = preflight.readiness;
  const executionPreview = preflight.execution;
  const resourceAnalysis = preflight.resources;

  const persistActivationStatus = useCallback((status: PreflightActivationPersistentStatus) => {
    setActivationPersistentStatus(status);
    try {
      localStorage.setItem(
        PREFLIGHT_ACTIVATION_STORAGE_KEY,
        serializePreflightActivationPersistence(status),
      );
    } catch {
      // In-memory state preserves one-shot behavior when storage is unavailable.
    }
  }, []);

  useEffect(() => {
    if (preflight.isRefreshing) setPreflightUpdatedNotice(null);
  }, [preflight.isRefreshing]);

  useEffect(() => {
    if (!isPreflightReviewOpen) setPreflightUpdatedNotice(null);
  }, [isPreflightReviewOpen]);

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
        setPresentationOrigin('existing_browser_workflow');
      }
    } catch (e) {
      skipNextAutosaveRef.current = true;
      setRecoveryNotice(true);
      console.error('Failed to load active flow:', e instanceof GraphDeserializationError ? e.issue.code : e);
    } finally {
      isLoadedRef.current = true;
      setWorkspaceHydrated(true);
    }
  }, [setNodes, setEdges]);

  useEffect(() => {
    try {
      setActivationPersistentStatus(
        parsePreflightActivationPersistence(
          localStorage.getItem(PREFLIGHT_ACTIVATION_STORAGE_KEY),
        ),
      );
    } catch {
      setActivationPersistentStatus(null);
    } finally {
      setActivationPersistenceHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (
      workspaceHydrated
      && activationPersistenceHydrated
      && activationPersistentStatus === null
      && !isPreflightReviewOpen
      && !activationPromptVisible
      && hasMeaningfulPreflightFirstValue(preflight.review)
    ) {
      setActivationPromptVisible(true);
    }
  }, [
    activationPersistenceHydrated,
    activationPersistentStatus,
    activationPromptVisible,
    isPreflightReviewOpen,
    preflight.review,
    workspaceHydrated,
  ]);

  const handleActivationPromptShown = useCallback(() => {
    if (activationPromptShownEmittedRef.current) return;
    activationPromptShownEmittedRef.current = true;
    persistActivationStatus('prompted');
    trackEvent('preflight_activation_prompt_shown', {
      activation_version: PREFLIGHT_ACTIVATION_VERSION,
      preflight_version: UNIFIED_PREFLIGHT_REVIEW_VERSION,
    });
  }, [persistActivationStatus]);

  const handleDismissActivationPrompt = useCallback(() => {
    setActivationPromptVisible(false);
    if (activationPersistentStatus === 'prompted') persistActivationStatus('dismissed');
  }, [activationPersistentStatus, persistActivationStatus]);

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
          preflightSelectionOwnerRef.current = null;
          setSelectedNode(target);
          setIsInspectorOpen(true);
          setIsPreflightReviewOpen(false);
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
      setPresentationOrigin('template');
      setReviewReturnContext(null);
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
    if (shouldIgnoreSelectionChangeForOpenPreflight(preflightSelectionOwnerRef.current)) return;
    if (!isNewNodeSelection(selectedNode?.id, node?.id)) return;
    setSelectedNode(node);
    if (node) {
      setIsInspectorOpen(true);
    setIsPreflightReviewOpen(false);
    }
  }, [selectedNode?.id]);

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
      setPresentationOrigin('manual');
      setReviewReturnContext(null);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error('Failed to remove flow from localStorage:', e);
      }
      takeSnapshot();
    }
  }, [setNodes, setEdges, takeSnapshot]);

  // Transpile CrewAI Python Code & Open Modal
  const handleGenerateCode = useCallback((trigger: HTMLButtonElement) => {
    preflightSelectionOwnerRef.current = null;
    codeExportEntryRef.current = trigger;
    trackEvent('code_generated');
    setIsPreflightReviewOpen(false);
    setIsCodeModalOpen(true);
  }, []);

  const closeCodeExportModal = useCallback(() => {
    setIsCodeModalOpen(false);
    const entry = codeExportEntryRef.current;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (entry?.isConnected) entry.focus({ preventScroll: true });
    }));
  }, []);

  const handleOpenPreflightReview = useCallback((trigger: HTMLButtonElement, source: PreflightActivationSource) => {
    if (!isPreflightReviewOpen) {
      preflightReviewEntryRef.current = trigger;
      preflightSelectionOwnerRef.current = 'unified_preflight';
      setCurrentActivationAttemptSource(source);
      setActivationPromptVisible(false);
      trackEvent('preflight_review_opened', {
        preflight_version: UNIFIED_PREFLIGHT_REVIEW_VERSION,
        source,
      });
      preflight.evaluateAll();
      setIsInspectorOpen(false);
      setIsMobileSidebarOpen(false);
      setReadinessNotice(null);
      setExecutionPreviewNotice(null);
      setResourceAnalysisNotice(null);
      setFocusPreflightHeadingOnOpen(true);
      setIsPreflightReviewOpen(true);
      setSurface('preflight');
    }
  }, [isPreflightReviewOpen, preflight]);

  useEffect(() => {
    if (!isPreflightReviewOpen) setCurrentActivationAttemptSource(null);
  }, [isPreflightReviewOpen]);

  useEffect(() => {
    if (
      !activationPersistenceHydrated
      || !isPreflightReviewOpen
      || currentActivationAttemptSource === null
      || activationPersistentStatus === 'completed'
      || firstValueEmittedRef.current
      || !hasMeaningfulPreflightFirstValue(preflight.review)
      || (
        preflight.review.state !== 'available'
        && preflight.review.state !== 'invalid'
        && preflight.review.state !== 'partial'
      )
    ) return;

    firstValueEmittedRef.current = true;
    trackEvent('preflight_first_value_reached', {
      activation_version: PREFLIGHT_ACTIVATION_VERSION,
      preflight_version: UNIFIED_PREFLIGHT_REVIEW_VERSION,
      review_state: preflight.review.state,
      source: currentActivationAttemptSource,
    });
    persistActivationStatus('completed');
    setActivationPromptVisible(false);
    setCurrentActivationAttemptSource(null);
  }, [
    activationPersistenceHydrated,
    activationPersistentStatus,
    currentActivationAttemptSource,
    isPreflightReviewOpen,
    persistActivationStatus,
    preflight.review,
  ]);

  const handlePreflightStageChange = useCallback((stage: UnifiedPreflightStage) => {
    if (stage === activePreflightStage) return;
    trackEvent('preflight_review_stage_selected', { stage });
    setActivePreflightStage(stage);
    if (stage === 'readiness' && readiness.result) trackEvent('readiness_opened', { status: readiness.result.status, evaluable: readiness.result.evaluable, ruleset_version: readiness.result.rulesetVersion });
    if (stage === 'execution' && executionPreview.state.status !== 'error') trackEvent('execution_preview_opened', { state: executionPreview.state.status, process: executionPreview.state.status === 'available' ? executionPreview.state.result.process : 'none', preview_version: '0.1.0' });
    if (stage === 'resources' && resourceAnalysis.state) trackEvent('resource_analysis_opened', createResourceAnalysisOpenedAnalyticsProperties(resourceAnalysis.state));
  }, [activePreflightStage, executionPreview.state, readiness.result, resourceAnalysis.state]);

  const handleReevaluatePreflight = useCallback(() => {
    setReadinessNotice(null);
    setExecutionPreviewNotice(null);
    setResourceAnalysisNotice(null);
    setPreflightUpdatedNotice(null);
    trackEvent('preflight_review_re_evaluated', { stage: activePreflightStage });
    preflight.evaluateAll();
    setPreflightUpdatedNotice(t('unifiedPreflightUpdated'));
  }, [activePreflightStage, preflight, t]);

  const restoreEntryFocus = useCallback((entry: HTMLButtonElement | null) => {
    if (entry?.isConnected) entry.focus({ preventScroll: true });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (entry?.isConnected) entry.focus({ preventScroll: true });
      });
    });
  }, []);

  const closePreflightReview = useCallback(() => {
    preflightSelectionOwnerRef.current = null;
    setPreflightUpdatedNotice(null);
    setIsPreflightReviewOpen(false);
    setSurface('design');
    restoreEntryFocus(preflightReviewEntryRef.current);
  }, [restoreEntryFocus]);

  const handleSurfaceChange = useCallback((next: EditorSurface, trigger: HTMLButtonElement) => {
    if (next === 'preflight') {
      handleOpenPreflightReview(trigger, 'entry');
      if (isPreflightReviewOpen) setSurface('preflight');
      return;
    }
    setIsPreflightReviewOpen(false);
    setIsMobileSidebarOpen(false);
    setSurface(next);
    requestAnimationFrame(() => document.getElementById(next === 'overview' ? 'overview-heading' : 'design-heading')?.focus({ preventScroll: true }));
  }, [handleOpenPreflightReview, isPreflightReviewOpen]);

  const handleLocateArchitecture = useCallback((targetKey: string) => {
    if (!targetKey.startsWith('node:')) return;
    const nodeId = targetKey.slice('node:'.length);
    const node = latestNodes.current.find((item) => item.id === nodeId);
    if (!node) return;
    setNodes((items) => items.map((item) => ({ ...item, selected: item.id === nodeId })));
    setEdges((items) => items.map((item) => ({ ...item, selected: false })));
    setSelectedNode(node);
    setIsPreflightReviewOpen(false);
    setSurface('design');
    setReviewReturnContext({ stage: 'architecture', label: node.data.label, itemKey: targetKey });
    setIsMobileSidebarOpen(false);
    setIsInspectorOpen(true);
    requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent('focus-flow-node', { detail: { nodeId } }));
      window.dispatchEvent(new Event('focus-inspector-heading'));
    });
  }, [setEdges, setNodes]);

  const handleLocateExecutionPreview = useCallback((targetType: ExecutionPreviewTargetType, nodeId: string | undefined, source: ExecutionPreviewLocateSource) => {
    const target = resolveExecutionPreviewNavigationTarget(targetType, nodeId, latestNodes.current);
    if (target.kind === 'crew') {
      preflightSelectionOwnerRef.current = null;
      trackEvent('execution_preview_located', { target_type: 'crew', source });
      setSelectedNode(null);
      setIsPreflightReviewOpen(false);
      setSurface('design');
      setReviewReturnContext({ stage: 'execution', label: `${targetType} · ${source}`, itemKey: `${targetType}:${nodeId ?? 'crew'}:${source}` });
      setNavigationAnnouncement(lang === 'ja' ? 'Designで設定を表示しました。指摘に戻れます。' : 'Located configuration in Design. Back to finding is available.');
      setIsMobileSidebarOpen(false);
      setIsInspectorOpen(true);
      requestAnimationFrame(() => window.dispatchEvent(new Event('focus-manager-llm')));
      return true;
    }
    if (target.kind === 'missing') {
      executionPreview.evaluateNow();
      setExecutionPreviewNotice(t('executionPreviewStaleNotice'));
      return false;
    }
    const node = target.node;
    preflightSelectionOwnerRef.current = null;
    trackEvent('execution_preview_located', { target_type: targetType, source });
    setNodes((items) => items.map((item) => ({ ...item, selected: item.id === node.id })));
    setEdges((items) => items.map((item) => ({ ...item, selected: false })));
    setSelectedNode(node);
    setIsPreflightReviewOpen(false);
    setSurface('design');
    setReviewReturnContext({ stage: 'execution', label: `${targetType} · ${source}`, itemKey: `${targetType}:${nodeId ?? 'crew'}:${source}` });
    setNavigationAnnouncement(lang === 'ja' ? `${node.data.label}をDesignで表示し、Inspectorを開きました。指摘に戻れます。` : `Located ${node.data.label} in Design and opened Inspector. Back to finding is available.`);
    setIsMobileSidebarOpen(false);
    setIsInspectorOpen(true);
    requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent('focus-flow-node', { detail: { nodeId: node.id } }));
      window.dispatchEvent(new Event('focus-inspector-heading'));
    });
    return true;
  }, [executionPreview, lang, setEdges, setNodes, t]);

  const handleLocateResourceAnalysis = useCallback((
    resourceTarget: ResourceAnalysisTarget,
    context: ResourceAnalysisLocateContext
  ) => {
    const analyticsProperties = createResourceAnalysisHotspotAnalyticsProperties(
      context.hotspotKind,
      resourceTarget
    );
    if (analyticsProperties) {
      trackEvent('resource_analysis_hotspot_selected', analyticsProperties);
    }
    const target = resolvePreflightNavigationTarget(resourceTarget, latestNodes.current);
    if (target.kind === 'missing') {
      resourceAnalysis.evaluateNow();
      setResourceAnalysisNotice(t('resourceAnalysisStaleNotice'));
      return false;
    }
    preflightSelectionOwnerRef.current = null;
    setIsPreflightReviewOpen(false);
    setSurface('design');
    setReviewReturnContext({ stage: 'resources', label: context.hotspotKind, itemKey: `${context.hotspotKind}:${'id' in resourceTarget ? resourceTarget.id : 'crew'}` });
    setIsMobileSidebarOpen(false);
    setIsInspectorOpen(true);
    if (target.kind === 'crew') {
      setNodes((items) => items.map((item) => ({ ...item, selected: false })));
      setEdges((items) => items.map((item) => ({ ...item, selected: false })));
      setSelectedNode(null);
      setNavigationAnnouncement(lang === 'ja' ? 'DesignでCrew設定を表示しました。指摘に戻れます。' : 'Located Crew configuration in Design. Back to finding is available.');
      requestAnimationFrame(() => window.dispatchEvent(new Event('focus-manager-llm')));
      return true;
    }
    const node = target.node;
    setNodes((items) => items.map((item) => ({ ...item, selected: item.id === node.id })));
    setEdges((items) => items.map((item) => ({ ...item, selected: false })));
    setSelectedNode(node);
    setNavigationAnnouncement(lang === 'ja' ? `${node.data.label}をDesignで表示し、Inspectorを開きました。指摘に戻れます。` : `Located ${node.data.label} in Design and opened Inspector. Back to finding is available.`);
    requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent('focus-flow-node', { detail: { nodeId: node.id } }));
      window.dispatchEvent(new Event('focus-inspector-heading'));
    });
    return true;
  }, [lang, resourceAnalysis, setEdges, setNodes, t]);

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
      preflightSelectionOwnerRef.current = null;
      setNodes((items) => items.map((item) => ({ ...item, selected: item.id === target.nodeId })));
      setEdges((items) => items.map((item) => ({ ...item, selected: false })));
      setSelectedNode(node);
      setIsPreflightReviewOpen(false);
      setSurface('design');
      setReviewReturnContext({ stage: 'readiness', label: translateReadinessKey(lang, finding.titleKey, finding.params), itemKey: `${finding.ruleId}:${target.nodeId}` });
      setNavigationAnnouncement(lang === 'ja' ? `${node.data.label}をDesignで表示し、Inspectorを開きました。指摘に戻れます。` : `Located ${node.data.label} in Design and opened Inspector. Back to finding is available.`);
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
      preflightSelectionOwnerRef.current = null;
      setNodes((items) => items.map((item) => ({ ...item, selected: false })));
      setEdges((items) => items.map((item) => ({ ...item, selected: item.id === target.edgeId })));
      setSelectedNode(null); setIsInspectorOpen(false); setIsPreflightReviewOpen(false);
      setSurface('design');
      setReviewReturnContext({ stage: 'readiness', label: translateReadinessKey(lang, finding.titleKey, finding.params), itemKey: `${finding.ruleId}:${target.edgeId}` });
      setNavigationAnnouncement(lang === 'ja' ? 'EdgeをDesignで表示しました。指摘に戻れます。' : 'Located edge in Design. Back to finding is available.');
      requestAnimationFrame(() => window.dispatchEvent(new CustomEvent('focus-flow-edge', { detail: { edgeId: target.edgeId } })));
      return;
    }
    preflightSelectionOwnerRef.current = null;
    setSelectedNode(null); setIsPreflightReviewOpen(false); setIsMobileSidebarOpen(false); setIsInspectorOpen(true);
    setSurface('design');
    setReviewReturnContext({ stage: 'readiness', label: translateReadinessKey(lang, finding.titleKey, finding.params), itemKey: `${finding.ruleId}:${target.field ?? 'graph'}` });
    setNavigationAnnouncement(lang === 'ja' ? 'Crew設定をDesignで表示しました。指摘に戻れます。' : 'Located Crew configuration in Design. Back to finding is available.');
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

    preflightSelectionOwnerRef.current = null;
    setNodes((currentNodes) =>
      currentNodes.map((node) => ({ ...node, selected: node.id === nodeId }))
    );
    setSelectedNode(targetNode);
    setIsInspectorOpen(true);
    setIsPreflightReviewOpen(false);
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
        setPresentationOrigin('agentgraph_json');
        setReviewReturnContext(null);
        setSurface('overview');
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
  const [crewAIImportResult, setCrewAIImportResult] = useState<CrewAIImportResult | null>(null);
  const [isCrewAIImportOpen, setIsCrewAIImportOpen] = useState(false);
  const mobileCrewAIInputRef = useRef<HTMLInputElement>(null);
  const overviewJsonInputRef = useRef<HTMLInputElement>(null);
  const crewAIImportRequestRef = useRef(0);

  const handleImportJson = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (file) void importGraphFile(file, 'button');
    },
    [importGraphFile]
  );

  const handleImportCrewAI = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const requestId = ++crewAIImportRequestRef.current;
    setCrewAIImportResult(null);
    setIsCrewAIImportOpen(true);
    // ArrayBuffer is read locally; no source body is logged or transmitted.
    const { importCrewAISource } = await import('@/lib/crewai-import');
    const result = importCrewAISource(file.name, new Uint8Array(await file.arrayBuffer()));
    if (requestId !== crewAIImportRequestRef.current) return;
    setCrewAIImportResult(result);
  }, []);

  const closeCrewAIImport = useCallback(() => {
    setIsCrewAIImportOpen(false);
    requestAnimationFrame(() => Array.from(document.querySelectorAll<HTMLElement>('[data-crewai-entry]')).find((item) => item.offsetParent !== null)?.focus());
  }, []);

  const applyCrewAIImport = useCallback(() => {
    const graph = crewAIImportResult?.graph;
    if (!graph || crewAIImportResult.state !== 'READY') return;
    // Confirm against the current graph at Apply time, never the parse-time snapshot.
    if ((latestNodes.current.length > 0 || latestEdges.current.length > 0) && !window.confirm(lang === 'ja' ? '現在のワークフローをCrewAIインポートで置き換えますか？' : 'Replace the current workflow with this CrewAI import?')) return;
    setNodes(graph.nodes); setEdges(graph.edges); setCrewConfig(graph.crewConfig); setSelectedNode(null);
    setPresentationOrigin('crewai_python'); setReviewReturnContext(null); setSurface('overview');
    historyRef.current = [{ nodes: graph.nodes, edges: graph.edges }]; historyIndexRef.current = 0;
    try { localStorage.setItem(STORAGE_KEY, serializeGraph(graph)); } catch (error) { console.error('Failed to save imported workflow to localStorage:', error instanceof Error ? error.name : 'storage error'); }
    trackEvent('crewai_imported', { adapter_version: '0.1.0', mapping_quality: crewAIImportResult.report.summary.mappedWithInference > 0 ? 'mapped_with_presentation_inference' : 'mapped' });
    closeCrewAIImport();
  }, [closeCrewAIImport, crewAIImportResult, lang, setEdges, setNodes]);

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

  const handleBackToReview = useCallback(() => {
    if (!reviewReturnContext) return;
    setActivePreflightStage(reviewReturnContext.stage);
    setFocusPreflightHeadingOnOpen(false);
    setIsPreflightReviewOpen(true);
    setSurface('preflight');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const item = document.querySelector<HTMLElement>(`[data-review-item="${CSS.escape(reviewReturnContext.itemKey)}"]`);
      if (item) {
        item.focus({ preventScroll: false });
      } else {
        document.getElementById('unified-preflight-heading')?.focus({ preventScroll: true });
        setNavigationAnnouncement(lang === 'ja' ? 'ワークフロー変更後、以前のレビュー項目は存在しません。該当ステージを表示しました。' : 'The previous review item is no longer present after the workflow changed. The review stage is open.');
      }
    }));
  }, [lang, reviewReturnContext]);

  const counts = useMemo(() => ({
    agents: nodes.filter((node) => node.type === 'agent').length,
    tasks: nodes.filter((node) => node.type === 'task').length,
    tools: nodes.filter((node) => node.type === 'tool').length,
  }), [nodes]);

  return (
    <div className="min-h-[100dvh] h-[100dvh] w-full max-w-full flex flex-col bg-slate-950 text-slate-100 overflow-x-hidden font-sans selection:bg-indigo-500 selection:text-white">
      <Header
        surface={surface}
        onSurfaceChange={handleSurfaceChange}
        onGenerateCode={handleGenerateCode}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onImportCrewAI={handleImportCrewAI}
        onViewCrewAIReport={crewAIImportResult ? () => setIsCrewAIImportOpen(true) : undefined}
        onClearCanvas={handleClearCanvas}
        onToggleSettings={() => {
          preflightSelectionOwnerRef.current = null;
          setSelectedNode(null);
          setSurface('design');
          setIsPreflightReviewOpen(false);
          setIsInspectorOpen(!isInspectorOpen);
        }}
      />
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
      <div className="sr-only" aria-live="polite">{navigationAnnouncement}</div>
      <input ref={mobileCrewAIInputRef} aria-label={t('importCrewAITitle')} type="file" accept=".py,text/x-python" onChange={handleImportCrewAI} className="sr-only" />
      <input ref={overviewJsonInputRef} aria-label={t('importJson')} type="file" accept=".json,application/json" onChange={handleImportJson} className="sr-only" />

      {surface === 'overview' ? <WorkflowOverview lang={lang} origin={presentationOrigin} crewConfig={crewConfig} agentCount={counts.agents} taskCount={counts.tasks} toolCount={counts.tools} preflight={preflight.review} hasMappingReport={Boolean(crewAIImportResult)} onCrewAI={() => mobileCrewAIInputRef.current?.click()} onJson={() => overviewJsonInputRef.current?.click()} onDesign={() => { setSurface('design'); setIsPreflightReviewOpen(false); }} onPreflight={handleOpenPreflightReview} onMappingReport={() => setIsCrewAIImportOpen(true)} activationPromptVisible={activationPromptVisible} onActivationPromptShown={handleActivationPromptShown} onDismissActivationPrompt={handleDismissActivationPrompt} /> : null}

      {surface === 'design' && reviewReturnContext ? <ReviewReturnBar context={reviewReturnContext} lang={lang} isRefreshing={preflight.isRefreshing} onBack={handleBackToReview} onClear={() => setReviewReturnContext(null)} /> : null}
      {surface === 'design' ? <><h1 id="design-heading" tabIndex={-1} className="sr-only">{lang === 'ja' ? 'Design — ワークフロー設計' : 'Design — Workflow canvas'}</h1><div className="flex-1 flex overflow-hidden relative" ref={workspaceRef} onDragEnter={handleWorkspaceDragEnter}>
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
        <Sidebar
          onLoadPreset={handleLoadPreset}
          onAddNode={handleAddNode}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

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
          isPreflightReviewOpen={isPreflightReviewOpen}
          onOpenPreflightReview={handleOpenPreflightReview}
          activationPromptVisible={false}
          onActivationPromptShown={handleActivationPromptShown}
          onDismissActivationPrompt={handleDismissActivationPrompt}
          isInspectorOpen={isInspectorOpen}
        />
        <div className="md:hidden absolute bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-30 grid w-[min(92vw,24rem)] grid-cols-2 gap-2 rounded-2xl border border-slate-700 bg-slate-900/95 p-2 shadow-2xl">
          <button
            onClick={() => {
              preflightSelectionOwnerRef.current = null;
              setIsMobileSidebarOpen(!isMobileSidebarOpen);
              setIsInspectorOpen(false);
              setIsPreflightReviewOpen(false);
            }}
            className="flex min-h-11 items-center justify-center rounded-xl bg-slate-800 text-xs font-semibold text-slate-200"
          >
            {t('mobilePalette') || 'Palette'}
          </button>
          <button
            onClick={() => {
              preflightSelectionOwnerRef.current = null;
              setIsInspectorOpen(!isInspectorOpen);
              setIsMobileSidebarOpen(false);
              setIsPreflightReviewOpen(false);
            }}
            className="flex min-h-11 items-center justify-center rounded-xl bg-slate-800 text-xs font-semibold text-slate-200"
          >
            {t('mobileInspector') || 'Inspector'}
          </button>
        </div>
        <Inspector
          selectedNode={selectedNode}
          onUpdateNodeData={handleUpdateNodeData}
          onDeleteNode={handleDeleteNode}
          crewConfig={crewConfig}
          onUpdateCrewConfig={(newConfig) => setCrewConfig((prev) => ({ ...prev, ...newConfig }))}
          isOpen={isInspectorOpen}
          onClose={() => setIsInspectorOpen(false)}
        />
      </div></> : null}

      {surface === 'preflight' ? <UnifiedPreflightPanel isOpen={isPreflightReviewOpen} focusHeadingOnOpen={focusPreflightHeadingOnOpen} activeStage={activePreflightStage} onStageChange={handlePreflightStageChange} preflight={preflight} architectureReview={architectureReview} architectureTargetKeys={architectureTargetKeys} onLocateArchitecture={handleLocateArchitecture} lang={lang} readinessNotice={readinessNotice} executionNotice={executionPreviewNotice} resourceNotice={resourceAnalysisNotice} updatedNotice={preflightUpdatedNotice} onReevaluate={handleReevaluatePreflight} readinessTargetSummary={readinessTargetSummary} onClose={closePreflightReview} onLocateReadiness={handleLocateFinding} onLocateExecution={handleLocateExecutionPreview} onLocateResources={handleLocateResourceAnalysis} onOpenValidation={() => { preflightSelectionOwnerRef.current = null; codeExportEntryRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; setIsPreflightReviewOpen(false); setIsCodeModalOpen(true); }} /> : null}

      {/* Transpiled Python Code Export Modal */}
      <CodeExportModal
        isOpen={isCodeModalOpen}
        onClose={closeCodeExportModal}
        onEditNode={handleEditExportError}
        nodes={nodes}
        edges={edges}
        crewConfig={crewConfig}
      />
      {isCrewAIImportOpen && crewAIImportResult && <CrewAIImportReview result={crewAIImportResult} lang={lang} replacing={nodes.length > 0 || edges.length > 0} onClose={closeCrewAIImport} onApply={applyCrewAIImport} />}
      {isCrewAIImportOpen && !crewAIImportResult && <div role="status" aria-live="polite" className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4"><div className="rounded-xl border border-violet-700 bg-slate-900 px-6 py-5 font-semibold text-violet-200">{lang === 'ja' ? 'CrewAIソースを解析中…' : 'Analyzing CrewAI source…'}</div></div>}
    </div>
  );
}
