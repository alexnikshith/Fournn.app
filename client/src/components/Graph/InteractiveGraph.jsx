import React, { useState } from 'react';
import { User, Mail, Calendar, Target, GitPullRequest, Building, CreditCard, Sparkles, ArrowRight } from 'lucide-react';

const CATEGORY_COLORS = {
  Person: '#F59E0B',
  Company: '#38BDF8',
  Event: '#F59E0B',
  Email: '#A78BFA',
  Subscription: '#F87171',
  Decision: '#EC4899',
  Goal: '#34D399',
  Task: '#A1A1AA'
};

const CATEGORY_ICONS = {
  Person: User,
  Company: Building,
  Event: Calendar,
  Email: Mail,
  Subscription: CreditCard,
  Decision: GitPullRequest,
  Goal: Target,
  Task: Sparkles
};

export default function InteractiveGraph({ nodes = [], edges = [] }) {
  const [selectedNode, setSelectedNode] = useState(nodes[0] || null);

  const nodePositions = {
    user_self: { x: 260, y: 220 },
    goal_career: { x: 500, y: 120 },
    comp_google: { x: 740, y: 140 },
    evt_interview: { x: 720, y: 320 },
    email_invite: { x: 480, y: 360 },
    refund_item: { x: 120, y: 340 },
    dec_laptop: { x: 140, y: 120 }
  };

  const getNodePos = (node, index) => {
    if (nodePositions[node.entityId]) return nodePositions[node.entityId];
    const angle = (index / Math.max(nodes.length, 1)) * 2 * Math.PI;
    return {
      x: 400 + Math.cos(angle) * 220,
      y: 240 + Math.sin(angle) * 160
    };
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>
      <div className="graph-container">
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 10,
            background: 'rgba(15, 15, 19, 0.9)',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: 'var(--gold-main)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Sparkles size={14} color="var(--gold-main)" />
          <span>Fournn Personal Context Graph Layer</span>
        </div>

        <svg width="100%" height="100%" viewBox="0 0 900 480">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#b45309" />
            </marker>
          </defs>

          {/* Render Edges */}
          {edges.map((edge, idx) => {
            const sourceNode = nodes.find(n => n.entityId === edge.sourceNodeId);
            const targetNode = nodes.find(n => n.entityId === edge.targetNodeId);
            if (!sourceNode || !targetNode) return null;

            const sPos = getNodePos(sourceNode, nodes.indexOf(sourceNode));
            const tPos = getNodePos(targetNode, nodes.indexOf(targetNode));

            const isSelected = selectedNode && (selectedNode.entityId === sourceNode.entityId || selectedNode.entityId === targetNode.entityId);

            return (
              <g key={edge._id || idx}>
                <line
                  x1={sPos.x}
                  y1={sPos.y}
                  x2={tPos.x}
                  y2={tPos.y}
                  stroke={isSelected ? '#f59e0b' : '#3f3f46'}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  strokeDasharray={edge.relationship === 'waiting_for' ? '5,5' : 'none'}
                  markerEnd="url(#arrow)"
                />
                <text
                  x={(sPos.x + tPos.x) / 2}
                  y={(sPos.y + tPos.y) / 2 - 8}
                  fill={isSelected ? '#fde68a' : '#a1a1aa'}
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {edge.relationship.replace('_', ' ')}
                </text>
              </g>
            );
          })}

          {/* Render Nodes */}
          {nodes.map((node, index) => {
            const pos = getNodePos(node, index);
            const isSelected = selectedNode && selectedNode.entityId === node.entityId;
            const categoryColor = CATEGORY_COLORS[node.category] || '#f59e0b';
            const IconComponent = CATEGORY_ICONS[node.category] || Sparkles;

            return (
              <g
                key={node.entityId || index}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => setSelectedNode(node)}
                style={{ cursor: 'pointer' }}
              >
                {isSelected && (
                  <circle r="34" fill="none" stroke={categoryColor} strokeWidth="2" strokeDasharray="4,4" opacity="0.8" />
                )}
                <circle
                  r="24"
                  fill="#0f0f13"
                  stroke={categoryColor}
                  strokeWidth={isSelected ? 3 : 2}
                  style={{ filter: `drop-shadow(0 0 12px ${categoryColor}35)` }}
                />
                <foreignObject x="-12" y="-12" width="24" height="24">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: categoryColor }}>
                    <IconComponent size={16} />
                  </div>
                </foreignObject>
                <text
                  y="40"
                  textAnchor="middle"
                  fill="#f8fafc"
                  fontSize="12"
                  fontWeight="600"
                  fontFamily="Inter, sans-serif"
                >
                  {node.label}
                </text>
                <text
                  y="54"
                  textAnchor="middle"
                  fill="#71717a"
                  fontSize="10"
                  fontWeight="500"
                >
                  {node.category}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Node Details Sidebar Inspector */}
      <div className="glass-card">
        {selectedNode ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span
                className="badge"
                style={{
                  background: `${CATEGORY_COLORS[selectedNode.category]}18`,
                  color: CATEGORY_COLORS[selectedNode.category],
                  borderColor: `${CATEGORY_COLORS[selectedNode.category]}35`
                }}
              >
                {selectedNode.category}
              </span>
            </div>

            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{selectedNode.label}</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              {selectedNode.summary || 'Contextual entity linked in user Personal Context Graph.'}
            </p>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
                Connected Relationships
              </h4>
              {edges
                .filter(e => e.sourceNodeId === selectedNode.entityId || e.targetNodeId === selectedNode.entityId)
                .map((e, idx) => {
                  const targetId = e.sourceNodeId === selectedNode.entityId ? e.targetNodeId : e.sourceNodeId;
                  const target = nodes.find(n => n.entityId === targetId);
                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.6rem 0.85rem',
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '0.5rem',
                        fontSize: '0.82rem'
                      }}
                    >
                      <span style={{ color: 'var(--text-muted)' }}>{e.relationship.replace('_', ' ')}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
                        <span>{target ? target.label : targetId}</span>
                        <ArrowRight size={12} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', textAlign: 'center', paddingTop: '2rem' }}>
            Click on any graph node to inspect relationships.
          </div>
        )}
      </div>
    </div>
  );
}
