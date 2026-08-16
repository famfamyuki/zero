'use client';

import React, { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  ControlButton,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  ReactFlowInstance,
  ConnectionMode,
  Viewport,
  MarkerType,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Focus, Maximize2, Minimize2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

import { AgentNode } from './nodes/AgentNode';
import { TaskNode } from './nodes/TaskNode';
import { ToolNode } from './nodes/ToolNode';
import { CustomNode, NodeType, AgentNodeData, TaskNodeData, ToolNodeData } from '@/types/editor';
import { DEFAULT_LLM_MODEL } from '@/lib/models';

const nodeTypes = {
  agent: AgentNode,
  task: TaskNode,
  tool: ToolNode,
};

const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: false,
  interactionWidth: 30, // Expanded touch hit target for edges (30px)
  style: { stroke: '#a5b4fc', strokeWidth: 2.75, opacity: 1 },
  markerEnd: { type: MarkerType.ArrowClosed, color: '#a5b4fc' },
};

const edgePalette = {
  'tool-agent': { color: '#fbbf24', labelJa: 'Tool → Agent', labelEn: 'Tool → Agent' },
  'agent-task': { color: '#a5b4fc', labelJa: 'Agent → Task', labelEn: 'Agent → Task' },
  'task-task': { color: '#5eead4', labelJa: 'Task → Task', labelEn: 'Task → Task' },
  other: { color: '#cbd5e1', labelJa: 'その他', labelEn: 'Other' },
} as const;

interface CanvasProps {
  nodes: CustomNode[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  setNodes: React.Dispatch<React.SetStateAction<CustomNode[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onNodeSelect: (node: CustomNode | null) => void;
  onPaneClick: () => void;
  onNodeDragStop?: any;
  toggleFullscreen: () => void;
  isFullscreen: boolean;
}

export const Canvas: React.FC<CanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  setNodes,
  setEdges,
  onNodeSelect,
  onPaneClick,
  onNodeDragStop,
  toggleFullscreen,
  isFullscreen,
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [isOverview, setIsOverview] = useState(false);
  const { lang } = useLanguage();

  const selectedNodeId = useMemo(
    () => nodes.find((node) => node.selected)?.id ?? null,
    [nodes]
  );

  const connectedNodeIds = useMemo(() => {
    if (!selectedNodeId) return null;

    const ids = new Set<string>([selectedNodeId]);
    for (const edge of edges) {
      if (edge.source === selectedNodeId) ids.add(edge.target);
      if (edge.target === selectedNodeId) ids.add(edge.source);
    }
    return ids;
  }, [edges, selectedNodeId]);

  const visibleNodes = useMemo(() => {
    if (!connectedNodeIds) return nodes;

    return nodes.map((node) => ({
      ...node,
      style: {
        ...node.style,
        opacity: connectedNodeIds.has(node.id) ? 1 : 0.28,
        transition: 'opacity 160ms ease',
      },
    }));
  }, [connectedNodeIds, nodes]);

  const visibleEdges = useMemo(() => {
    const nodeTypeById = new Map(nodes.map((node) => [node.id, node.type]));

    return edges.map((edge) => {
      const isConnected = selectedNodeId
        ? edge.source === selectedNodeId || edge.target === selectedNodeId
        : false;
      const isDimmed = Boolean(selectedNodeId) && !isConnected;
      const sourceType = nodeTypeById.get(edge.source);
      const targetType = nodeTypeById.get(edge.target);
      const paletteKey =
        sourceType === 'tool' && targetType === 'agent'
          ? 'tool-agent'
          : sourceType === 'agent' && targetType === 'task'
            ? 'agent-task'
            : sourceType === 'task' && targetType === 'task'
              ? 'task-task'
              : 'other';
      const color = edgePalette[paletteKey].color;

      return {
        ...edge,
        type: edge.type || 'smoothstep',
        animated: isConnected ? true : isOverview ? false : edge.animated,
        interactionWidth: Math.max(edge.interactionWidth || 0, 30),
        className: `agentgraph-edge agentgraph-edge--${paletteKey}`,
        style: {
          ...edge.style,
          stroke: color,
          strokeWidth: isConnected || edge.selected ? 4 : 2.75,
          opacity: isConnected ? 1 : isDimmed ? 0.32 : isOverview ? 0.9 : 1,
          transition: 'opacity 160ms ease, stroke-width 160ms ease',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color,
          width: 18,
          height: 18,
        },
      };
    });
  }, [edges, isOverview, nodes, selectedNodeId]);

  const handleMove = useCallback((_event: MouseEvent | TouchEvent | null, viewport: Viewport) => {
    const nextIsOverview = viewport.zoom < 0.62;
    setIsOverview((current) => (current === nextIsOverview ? current : nextIsOverview));
  }, []);

  const handleFitView = useCallback(() => {
    void reactFlowInstance?.fitView({ padding: 0.18, duration: 450 });
  }, [reactFlowInstance]);

  useEffect(() => {
    const handleFocusNode = (event: Event) => {
      const nodeId = (event as CustomEvent<{ nodeId?: string }>).detail?.nodeId;
      if (!nodeId || !reactFlowInstance) return;

      const node = nodes.find((item) => item.id === nodeId);
      if (!node) return;

      const width = node.measured?.width || node.width || 280;
      const height = node.measured?.height || node.height || 120;
      void reactFlowInstance.setCenter(
        node.position.x + width / 2,
        node.position.y + height / 2,
        { zoom: 1, duration: 450 }
      );
    };

    window.addEventListener('focus-flow-node', handleFocusNode);
    return () => window.removeEventListener('focus-flow-node', handleFocusNode);
  }, [nodes, reactFlowInstance]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, ...defaultEdgeOptions }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow') as NodeType;

      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let data: AgentNodeData | TaskNodeData | ToolNodeData;
      if (type === 'agent') {
        data = {
          label: 'New Agent',
          role: 'AI Assistant',
          goal: 'Perform requested tasks efficiently.',
          backstory: 'An expert AI agent persona.',
          model: DEFAULT_LLM_MODEL,
          verbose: true,
          allowDelegation: false,
        };
      } else if (type === 'task') {
        data = {
          label: 'New Task',
          description: 'Detailed instructions for this task...',
          expectedOutput: 'Markdown formatted summary report',
          asyncExecution: false,
        };
      } else {
        data = {
          label: 'New Tool',
          toolType: 'SerperDevTool',
          description: 'Search Google API Tool',
        };
      }

      const newNode: CustomNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }: { nodes: Node[] }) => {
      if (selectedNodes.length > 0) {
        onNodeSelect(selectedNodes[0] as CustomNode);
      } else {
        onNodeSelect(null);
      }
    },
    [onNodeSelect]
  );

  // Handle explicit node tap (single tap without drag)
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    // Dispatch open-node-inspector for explicit tap
    const customEvt = new CustomEvent('open-node-inspector', { detail: { nodeId: node.id } });
    window.dispatchEvent(customEvt);
  }, []);

  // Handle edge tap to delete connection easily on touch devices
  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.stopPropagation();
      if (window.confirm('Delete this connection? / この接続線を削除しますか？')) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }
    },
    [setEdges]
  );

  const fullscreenTooltipText = isFullscreen
    ? lang === 'ja'
      ? '全画面表示を解除'
      : 'Exit Fullscreen'
    : lang === 'ja'
    ? '全画面表示'
    : 'Fullscreen';

  return (
    <div className="w-full h-full flex-1 relative bg-slate-950 touch-none" ref={reactFlowWrapper}>
      {/* Mobile Touch Guidance Tip */}
      <div className="md:hidden absolute top-3 left-3 z-20 pointer-events-none bg-slate-900/90 border border-slate-800 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] text-slate-300 shadow-lg flex items-center gap-1.5">
        <span className="text-amber-400 font-bold">💡</span>
        <span>タップで詳細表示・線タップで削除できます</span>
      </div>

      <ReactFlow
        nodes={visibleNodes}
        edges={visibleEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onNodeDragStop={onNodeDragStop}
        onPaneClick={onPaneClick}
        onEdgeClick={onEdgeClick}
        onSelectionChange={onSelectionChange as any}
        onMove={handleMove}
        nodeTypes={nodeTypes as any}
        panOnScroll={false}
        zoomOnScroll={true}
        zoomOnPinch={true}
        preventScrolling={true}
        minZoom={0.05}
        panOnDrag={true}
        zoomOnDoubleClick={false}
        selectNodesOnDrag={false}
        elevateNodesOnSelect={true}
        snapToGrid={true}
        snapGrid={[15, 15]}
        fitView
        colorMode="dark"
        className="bg-slate-950"
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineStyle={{ stroke: '#e0e7ff', strokeWidth: 3 }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="#334155" />
        <Panel position="bottom-center" className="!m-3">
          <div className="agentgraph-edge-legend" aria-label={lang === 'ja' ? '接続線の凡例' : 'Connection legend'}>
            {(['tool-agent', 'agent-task', 'task-task'] as const).map((key) => (
              <span key={key} className="agentgraph-edge-legend__item">
                <span
                  className="agentgraph-edge-legend__line"
                  style={{ backgroundColor: edgePalette[key].color }}
                  aria-hidden="true"
                />
                {lang === 'ja' ? edgePalette[key].labelJa : edgePalette[key].labelEn}
              </span>
            ))}
          </div>
        </Panel>
        <Controls
          showFitView={false}
          showInteractive={false}
          className="!bg-slate-900 !border-slate-800 !text-slate-300 !rounded-xl !shadow-2xl !left-3 !bottom-24 md:!bottom-4 md:!left-4"
        >
          <ControlButton
            onClick={handleFitView}
            title={lang === 'ja' ? '全ノードを画面内に表示' : 'Fit all nodes'}
            aria-label={lang === 'ja' ? '全ノードを画面内に表示' : 'Fit all nodes'}
            className="!bg-slate-900 hover:!bg-slate-800 !text-slate-300 transition"
          >
            <Focus className="w-4 h-4 text-cyan-400" />
          </ControlButton>
          <ControlButton
            onClick={toggleFullscreen}
            title={fullscreenTooltipText}
            aria-label={fullscreenTooltipText}
            className="hidden md:flex !bg-slate-900 hover:!bg-slate-800 !text-slate-300 transition"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Maximize2 className="w-4 h-4 text-indigo-400" />
            )}
          </ControlButton>
        </Controls>

        <MiniMap
          nodeColor={(n) => {
            if (n?.type === 'agent') return '#6366f1';
            if (n?.type === 'task') return '#10b981';
            return '#f59e0b';
          }}
          position="bottom-right"
          className="hidden sm:block !bg-slate-900/90 !border !border-slate-800 !rounded-xl overflow-hidden shadow-2xl"
          maskColor="rgba(15, 23, 42, 0.7)"
        />
      </ReactFlow>
    </div>
  );
};
