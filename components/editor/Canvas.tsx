'use client';

import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Controls,
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { AgentNode } from './nodes/AgentNode';
import { TaskNode } from './nodes/TaskNode';
import { ToolNode } from './nodes/ToolNode';
import { CustomNode, NodeType, AgentNodeData, TaskNodeData, ToolNodeData } from '@/types/editor';

const nodeTypes = {
  agent: AgentNode,
  task: TaskNode,
  tool: ToolNode,
};

const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: true,
  style: { stroke: '#818cf8', strokeWidth: 2 },
};

interface CanvasProps {
  nodes: CustomNode[];
  edges: Edge[];
  onNodesChange: any;
  onEdgesChange: any;
  setNodes: React.Dispatch<React.SetStateAction<CustomNode[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onNodeSelect: (node: CustomNode | null) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  setNodes,
  setEdges,
  onNodeSelect,
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#818cf8', strokeWidth: 2 },
          },
          eds
        )
      );
    },
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

  return (
    <div className="w-full h-full flex-1 relative bg-slate-950" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onSelectionChange={onSelectionChange as any}
        nodeTypes={nodeTypes as any}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionMode={ConnectionMode.Loose}
        fitView
        colorMode="dark"
        className="bg-slate-950"
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="#334155" />
        <Controls className="!bg-slate-900 !border-slate-800 !text-slate-300 !rounded-xl !shadow-2xl" />
        <MiniMap
          nodeColor={(n) => {
            if (n.type === 'agent') return '#6366f1';
            if (n.type === 'task') return '#10b981';
            return '#f59e0b';
          }}
          className="!bg-slate-900/90 !border-slate-800 !rounded-xl overflow-hidden shadow-2xl"
          maskColor="rgba(15, 23, 42, 0.7)"
        />
      </ReactFlow>
    </div>
  );
};
