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
  Task: '#A1A1AA',
  Career: '#38BDF8'
};

const CATEGORY_ICONS = {
  Person: User,
  Company: Building,
  Event: Calendar,
  Email: Mail,
  Subscription: CreditCard,
  Decision: GitPullRequest,
  Goal: Target,
  Task: Sparkles,
  Career: Target
};

const DEFAULT_NODES = [
  { id: 'u1', label: 'Nikshith (You)', category: 'Person', details: 'Personal OS User Context & Active Profiles' },
  { id: 'n1', label: 'Accenture Placement Session', category: 'Event', details: 'Virtual briefing today @ 12:00 PM' },
  { id: 'n2', label: 'Full-Stack Roles Hyderabad', category: 'Career', details: '₹9.5L - ₹15L+ Senior Developer Opportunity' },
  { id: 'n3', label: 'Land Senior AI Role Goal', category: 'Goal', details: 'Target Completion: Oct 2026' },
  { id: 'n4', label: 'Accenture Placement Cell', category: 'Company', details: 'Campus Recruitment Stream Adapter' }
];

const DEFAULT_EDGES = [
  { id: 'e1', source: 'u1', target: 'n1', label: 'attending' },
  { id: 'e2', source: 'u1', target: 'n2', label: 'received' },
  { id: 'e3', source: 'n1', target: 'n3', label: 'advances' },
  { id: 'e4', source: 'n4', target: 'n1', label: 'hosts' }
];

// Explicit non-overlapping coordinates for maximum visual clarity
const PRESET_POSITIONS = {
  u1: { x: 420, y: 220 }, // Center
  n4: { x: 140, y: 100 }, // Top-Left: Accenture Placement Cell
  n1: { x: 700, y: 100 }, // Top-Right: Accenture Placement Session
  n2: { x: 700, y: 360 }, // Bottom-Right: Full-Stack Roles Hyderabad
  n3: { x: 140, y: 360 }  // Bottom-Left: Land Senior AI Role Goal
};

export default function InteractiveGraph({ nodes = [], edges = [] }) {
  const displayNodes = Array.isArray(nodes) && nodes.length > 0 ? nodes : DEFAULT_NODES;
  const displayEdges = Array.isArray(edges) && edges.length > 0 ? edges : DEFAULT_EDGES;

  const [selectedNode, setSelectedNode] = useState(displayNodes[0] || null);

  const getPos = (node, index) => {
    const key = String(node.id || node._id || node.entityId || '');
    if (PRESET_POSITIONS[key]) return PRESET_POSITIONS[key];

    // Fallback radial calculation with wide spacing
    const total = Math.max(displayNodes.length, 1);
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    if (index === 0 || key.includes('u1') || key.includes('user')) {
      return { x: 420, y: 220 };
    }
    return {
      x: 420 + Math.cos(angle) * 280,
      y: 220 + Math.sin(angle) * 160
    };
  };

  const findNode = (id) => {
    return displayNodes.find(n => 
      String(n.id) === String(id) || 
      String(n._id) === String(id) || 
      String(n.entityId) === String(id)
    );
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', width: '100%' }}>
      <div className="graph-container" style={{ position: 'relative', minHeight: 520, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
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

        <svg width="100%" height="520" viewBox="0 0 840 520">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="32" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--gold-main)" />
            </marker>
          </defs>

          {/* Render Edges with Background Label Pills */}
          {displayEdges.map((edge, idx) => {
            const sId = edge.source || edge.sourceNodeId;
            const tId = edge.target || edge.targetNodeId;
            const sourceNode = findNode(sId);
            const targetNode = findNode(tId);

            if (!sourceNode || !targetNode) return null;

            const sPos = getPos(sourceNode, displayNodes.indexOf(sourceNode));
            const tPos = getPos(targetNode, displayNodes.indexOf(targetNode));

            const isSelected = selectedNode && (
              String(selectedNode.id) === String(sourceNode.id) || 
              String(selectedNode.id) === String(targetNode.id)
            );

            // Midpoint coordinates for relationship text badge
            const midX = (sPos.x + tPos.x) / 2;
            const midY = (sPos.y + tPos.y) / 2;
            const labelText = edge.label || edge.relationship || 'linked';

            return (
              <g key={edge.id || idx}>
                <line
                  x1={sPos.x}
                  y1={sPos.y}
                  x2={tPos.x}
                  y2={tPos.y}
                  stroke={isSelected ? 'var(--gold-main)' : 'var(--border-color)'}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  strokeOpacity={isSelected ? 1 : 0.6}
                  markerEnd="url(#arrow)"
                />

                {/* Text Badge Background Pill to prevent overlapping lines */}
                <g transform={`translate(${midX}, ${midY})`}>
                  <rect
                    x={-(labelText.length * 4.2 + 8)}
                    y="-12"
                    width={labelText.length * 8.4 + 16}
                    height="20"
                    rx="10"
                    fill="var(--bg-dark)"
                    stroke={isSelected ? 'var(--gold-main)' : 'var(--border-color)'}
                    strokeWidth="1"
                  />
                  <text
                    y="2"
                    fill={isSelected ? 'var(--gold-main)' : 'var(--text-muted)'}
                    fontSize="11"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {labelText}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Render Nodes */}
          {displayNodes.map((node, idx) => {
            const pos = getPos(node, idx);
            const color = CATEGORY_COLORS[node.category] || '#f59e0b';
            const Icon = CATEGORY_ICONS[node.category] || Sparkles;
            const isSelected = selectedNode && String(selectedNode.id) === String(node.id);

            return (
              <g
                key={node.id || idx}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => setSelectedNode(node)}
                style={{ cursor: 'pointer' }}
              >
                {/* Node Outer Glow & Circle */}
                <circle
                  r={isSelected ? 28 : 24}
                  fill="var(--bg-dark)"
                  stroke={isSelected ? color : 'var(--border-color)'}
                  strokeWidth={isSelected ? 3.5 : 2}
                  style={{ filter: isSelected ? `drop-shadow(0 0 16px ${color})` : 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))', transition: 'all 0.25s ease' }}
                />

                <foreignObject x="-11" y="-11" width="22" height="22" style={{ pointerEvents: 'none' }}>
                  <div style={{ color, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Icon size={18} />
                  </div>
                </foreignObject>

                {/* Node Title Label with Pill Background */}
                <g transform="translate(0, 42)">
                  <rect
                    x={-(node.label.length * 3.8 + 10)}
                    y="-13"
                    width={node.label.length * 7.6 + 20}
                    height="22"
                    rx="6"
                    fill="var(--bg-dark)"
                    stroke={isSelected ? color : 'var(--border-color)'}
                    strokeWidth="1"
                  />
                  <text
                    y="2"
                    textAnchor="middle"
                    fill={isSelected ? 'var(--gold-main)' : 'var(--text-main)'}
                    fontSize="12"
                    fontWeight={isSelected ? '700' : '600'}
                  >
                    {node.label}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Node Inspector Panel */}
      <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {selectedNode ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
              <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.12)', color: CATEGORY_COLORS[selectedNode.category] || 'var(--gold-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {React.createElement(CATEGORY_ICONS[selectedNode.category] || Sparkles, { size: 20 })}
              </div>
              <div>
                <span className="badge badge-resolved" style={{ fontSize: '0.72rem', textTransform: 'uppercase' }}>
                  {selectedNode.category}
                </span>
                <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700, color: 'var(--text-main)' }}>
                  {selectedNode.label}
                </h3>
              </div>
            </div>

            <div style={{ fontSize: '0.94rem', color: 'var(--text-muted)', lineHeight: 1.6, background: 'var(--bg-surface)', padding: '1rem 1.15rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
              {selectedNode.details || selectedNode.summary || 'Linked node entity inside your personal OS context graph.'}
            </div>

            <div style={{ fontSize: '0.88rem', color: 'var(--text-dim)' }}>
              <strong style={{ color: 'var(--text-main)' }}>Connected Relationships:</strong>
              <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {displayEdges
                  .filter(e => String(e.source || e.sourceNodeId) === String(selectedNode.id) || String(e.target || e.targetNodeId) === String(selectedNode.id))
                  .map((e, idx) => (
                    <div key={idx} style={{ background: 'var(--bg-card)', padding: '0.55rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ArrowRight size={14} color="var(--gold-main)" />
                      <span style={{ fontWeight: 600, color: 'var(--gold-main)' }}>{e.label || e.relationship}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', paddingTop: '4rem' }}>
            Click on any graph node to inspect details.
          </div>
        )}
      </div>
    </div>
  );
}
