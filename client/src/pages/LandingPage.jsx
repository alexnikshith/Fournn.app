import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Bot, 
  CheckCircle2, 
  Lock, 
  Zap, 
  Brain,
  ChevronDown,
  Clock,
  Mail,
  Calendar,
  CreditCard,
  Target,
  GitPullRequest,
  Check,
  ShieldAlert,
  HelpCircle,
  FileCheck,
  TrendingUp,
  Sun,
  Moon
} from 'lucide-react';

export default function LandingPage() {
  const { demoLogin, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeDemoStep, setActiveDemoStep] = useState(0);

  const handleTryDemo = async () => {
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  const demoWorkflowSteps = [
    {
      title: "1. Data Stream Ingestion",
      icon: Mail,
      badge: "Gmail & Calendar Adapter",
      desc: "User receives an email from recruiter Sarah Jenkins: 'Google Staff Engineer Interview Guidelines & Schedule Request'.",
      code: "RECEIVED: email_invite -> 'Google Staff Technical Screen'"
    },
    {
      title: "2. Context Understanding",
      icon: Brain,
      badge: "Context Agent",
      desc: "Fournn extracts key entities: Person (Sarah), Company (Google), Event (Interview), Goal (Land Senior AI Role).",
      code: "EXTRACTED: [Person: Sarah] -> [Company: Google] -> [Event: Interview]"
    },
    {
      title: "3. Context Graph Linking",
      icon: Layers,
      badge: "Personal Context Graph",
      desc: "Links interview event directly to user's Q3 outcome goal: 'Land Senior AI/Full-Stack Lead Role (60% Progress)'.",
      code: "LINKED: [evt_interview] --(requires_action)--> [goal_career]"
    },
    {
      title: "4. Follow-Up & Deadline Detection",
      icon: Clock,
      badge: "Follow-Up Agent",
      desc: "Detects interview is in 6 days and flags ₹2,400 e-commerce refund overdue past 3 business days.",
      code: "ALERT: Interview in 6d | Refund ₹2,400 overdue 3d"
    },
    {
      title: "5. Recommendation & Permission Gate",
      icon: ShieldCheck,
      badge: "Execution Protocol",
      desc: "Formulates 2 hours prep plan & drafts support ticket. Displays draft for explicit user approval.",
      code: "PROPOSED: [Draft Email Ticket] -> AWAITING USER APPROVAL"
    },
    {
      title: "6. Approved Execution & Verification",
      icon: CheckCircle2,
      badge: "Verification Agent",
      desc: "User clicks 'Approve & Dispatch'. Fournn dispatches follow-up, logs audit run, and updates long-term memory.",
      code: "VERIFIED: Dispatched successfully | Audit run #891 logged"
    }
  ];

  const faqs = [
    {
      q: "How is Fournn different from a generic AI chatbot or task manager?",
      a: "Fournn is NOT a chatbot box where you type prompts manually, nor is it a simple to-do list. Fournn operates as a Personal Context Layer above your emails, calendar, tasks, decisions, and goals. It maps relationships between information and uses specialized autonomous agents to surface what needs attention and propose user-approved outcomes."
    },
    {
      q: "Can Fournn AI agents send emails or modify my calendar without my permission?",
      a: "NEVER. Fournn operates under a strict execution safety protocol: PLAN → EXPLAIN → ASK PERMISSION → EXECUTE → VERIFY → LOG. No email is dispatched and no sensitive account state is mutated without your explicit approval. Additionally, you can hit the global 'Pause All Agents' switch at any time."
    },
    {
      q: "Which integrations are supported in the MVP?",
      a: "Fournn currently includes native adapters for Gmail and Google Calendar with read-only permissions enabled by default. Additional adapters (Notion, Slack, GitHub, LinkedIn, Microsoft Outlook) are architected for seamless expansion."
    },
    {
      q: "What is Synthetic Demo Mode?",
      a: "Synthetic Demo Mode allows anyone to experience the full magic of Fournn instantly out of the box without connecting personal Google accounts or entering API keys. It seeds a realistic, rich digital life scenario (interview prep, refund overdue, laptop upgrade decision, career goal breakdown)."
    },
    {
      q: "How does long-term memory control work?",
      a: "Fournn's Memory Agent stores only high-value personal context (such as career salary targets or focus time preferences). You retain 100% control: you can inspect, edit, delete individual memories, or purge your entire memory vault with a single click."
    }
  ];

  return (
    <div style={{ background: 'var(--bg-dark)', minHeight: '100vh', color: 'var(--text-main)', overflowX: 'hidden' }}>
      
      {/* 1. HERO SECTION */}
      <section className="landing-hero" style={{ position: 'relative' }}>
        {/* Glow ambient background aura */}
        <div 
          style={{ 
            position: 'absolute', 
            top: '-10%', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            width: '600px', 
            height: '400px', 
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, rgba(7, 7, 9, 0) 70%)', 
            pointerEvents: 'none', 
            zIndex: 0 
          }} 
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <div 
              className="badge" 
              style={{ 
                background: 'rgba(245, 158, 11, 0.12)', 
                color: 'var(--gold-main)', 
                borderColor: 'rgba(245, 158, 11, 0.35)',
                padding: '0.5rem 1.25rem',
                fontSize: '0.85rem'
              }}
            >
              <Sparkles size={16} />
              <span>AI PERSONAL OPERATING SYSTEM</span>
            </div>

            <button
              onClick={toggleTheme}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.4rem 0.95rem', fontSize: '0.85rem' }}
            >
              {theme === 'dark' ? <Sun size={16} color="var(--gold-main)" /> : <Moon size={16} color="var(--primary-accent)" />}
              <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
            </button>
          </div>

          <h1 className="hero-title">
            Your AI that understands<br />
            <span className="text-gradient">what matters.</span>
          </h1>

          <p className="hero-subtitle">
            Fournn connects your goals, commitments, decisions, and digital activity into one unified context layer — helping you know what needs attention and move important outcomes forward.
          </p>

          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={handleTryDemo} 
              className="btn btn-primary" 
              style={{ padding: '1.1rem 2.5rem', fontSize: '1.08rem' }}
            >
              <span>Explore Interactive Demo</span>
              <ArrowRight size={20} />
            </button>
            <Link 
              to="/auth?mode=register" 
              className="btn btn-secondary" 
              style={{ padding: '1.1rem 2.5rem', fontSize: '1.08rem' }}
            >
              <span>Get Started</span>
            </Link>
          </div>
        </div>

        {/* Dynamic Proof Stats Banner */}
        <div 
          className="glass-card highlight" 
          style={{ 
            marginTop: '5rem', 
            padding: '2.5rem', 
            textAlign: 'left',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            background: 'var(--bg-card)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
              Meaningful Outcomes
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--gold-main)', fontFamily: 'var(--font-heading)' }}>
              7 Important
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Items resolved auto-tracked</div>
          </div>

          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
              Follow-ups Handled
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--emerald-accent)', fontFamily: 'var(--font-heading)' }}>
              3 Automated
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>With explicit user permission</div>
          </div>

          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
              Overdue Recovered
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--font-heading)' }}>
              ₹2,400 Saved
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>E-commerce refund tracked</div>
          </div>

          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
              Time Recovered
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--gold-light)', fontFamily: 'var(--font-heading)' }}>
              4+ Hours
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Saved per user weekly</div>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM SECTION */}
      <section className="page-body" style={{ padding: '5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="badge badge-waiting" style={{ marginBottom: '1rem' }}>The Fragmented World</span>
          <h2 style={{ fontSize: '2.8rem', marginBottom: '0.75rem' }}>Your life is scattered across 12 different tools.</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: 720, margin: '0 auto' }}>
            Emails, calendar events, unwritten notes, job follow-ups, overdue refunds, and decisions compete for your limited cognitive bandwidth every single day.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          <div className="glass-card">
            <div className="metric-icon" style={{ marginBottom: '1.25rem', color: 'var(--crimson-accent)' }}>
              <Mail size={24} />
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Too Many Emails & Missed Replies</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
              Important invitations and recruiter queries get buried under non-urgent newsletters and notifications.
            </p>
          </div>

          <div className="glass-card">
            <div className="metric-icon" style={{ marginBottom: '1.25rem', color: 'var(--amber-accent)' }}>
              <CreditCard size={24} />
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Forgotten Overdue Refunds</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
              Returned items and canceled subscriptions promise refunds that never arrive because nobody tracks them after 3 days.
            </p>
          </div>

          <div className="glass-card">
            <div className="metric-icon" style={{ marginBottom: '1.25rem', color: 'var(--gold-main)' }}>
              <GitPullRequest size={24} />
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Unanalyzed Dilemmas</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
              Stuck between hardware choices or job offers without structured trade-offs, evidence, and risk profiles.
            </p>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE PRODUCT DEMONSTRATION STORYFLOW */}
      <section style={{ background: '#09090d', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '6rem 2rem' }}>
        <div className="page-body">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="badge badge-resolved" style={{ marginBottom: '1rem' }}>How Fournn Works</span>
            <h2 style={{ fontSize: '2.8rem', marginBottom: '0.75rem' }}>From Scattered Context to User-Approved Action</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: 700, margin: '0 auto' }}>
              Click through the 6-step lifecycle to see how Fournn processes digital information into verified real-world outcomes.
            </p>
          </div>

          {/* Interactive Step Selector */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
              gap: '0.85rem', 
              marginBottom: '2.5rem' 
            }}
          >
            {demoWorkflowSteps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveDemoStep(idx)}
                className={`btn ${activeDemoStep === idx ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.85rem 0.5rem', fontSize: '0.88rem', textAlign: 'center' }}
              >
                <span>Step {idx + 1}</span>
              </button>
            ))}
          </div>

          {/* Step Detail Display Card */}
          <div className="glass-card highlight" style={{ padding: '3rem', minHeight: 320, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                <span className="badge badge-waiting">{demoWorkflowSteps[activeDemoStep].badge}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                  STEP {activeDemoStep + 1} OF 6
                </span>
              </div>

              <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
                {demoWorkflowSteps[activeDemoStep].title}
              </h3>
              
              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
                {demoWorkflowSteps[activeDemoStep].desc}
              </p>
            </div>

            <div 
              style={{ 
                background: '#040406', 
                padding: '1.15rem 1.5rem', 
                borderRadius: 'var(--radius-sm)', 
                border: '1px solid var(--border-color)', 
                fontFamily: 'monospace', 
                fontSize: '0.92rem',
                color: 'var(--gold-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <Zap size={18} color="var(--gold-main)" />
              <span>{demoWorkflowSteps[activeDemoStep].code}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MODULAR AGENT MESH SHOWCASE */}
      <section className="page-body" style={{ padding: '6rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="badge badge-important" style={{ marginBottom: '1rem' }}>Modular Architecture</span>
          <h2 style={{ fontSize: '2.8rem', marginBottom: '0.75rem' }}>8 Specialized AI Agents Working for You</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: 720, margin: '0 auto' }}>
            Not one giant function. Fournn coordinates dedicated agents designed for context, research, planning, decision analysis, and verified execution.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {[
            { title: "Context Agent", desc: "Extracts entities & constructs graph nodes across email/calendar feeds." },
            { title: "Research Agent", desc: "Gathers evidence, compares hardware pricing & verifies facts." },
            { title: "Decision Agent", desc: "Analyzes options, tradeoffs, risks, and confidence scores." },
            { title: "Planning Agent", desc: "Breaks outcome goals into milestone task action plans." },
            { title: "Follow-Up Agent", desc: "Monitors pending responses, recruiter emails, and overdue refunds." },
            { title: "Execution Agent", desc: "Performs user-approved dispatches with strict permission gates." },
            { title: "Verification Agent", desc: "Confirms action success, logs audit runs, and updates system state." },
            { title: "Memory Agent", desc: "Manages long-term structured personal memory vault safely." }
          ].map(agent => (
            <div key={agent.title} className="glass-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                <Bot color="var(--gold-main)" size={20} />
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{agent.title}</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {agent.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TRUST, PRIVACY & EMERGENCY CONTROL */}
      <section style={{ background: '#09090d', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '6rem 2rem' }}>
        <div className="page-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <span className="badge badge-resolved" style={{ marginBottom: '1.25rem' }}>
              <Lock size={14} />
              <span>Trust & Safety Protocol</span>
            </span>

            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.25rem', lineHeight: 1.2 }}>
              You retain 100% control over every single action.
            </h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.65, marginBottom: '2rem' }}>
              Fournn never operates as a black box. Every agent run follows strict user permission rules. No email is sent or calendar item added without your explicit review and approval.
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1.02rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle2 color="var(--emerald-accent)" size={20} />
                <span>Instant Emergency "Pause All Agents" global switch</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle2 color="var(--emerald-accent)" size={20} />
                <span>Granular permission toggles (Read vs Execute access per adapter)</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle2 color="var(--emerald-accent)" size={20} />
                <span>Deletable & controllable long-term memory store</span>
              </li>
            </ul>
          </div>

          <div className="glass-card highlight" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
              <h3 style={{ fontSize: '1.3rem' }}>Agent Safety Status</h3>
              <span className="badge badge-resolved">Active & Guarded</span>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Follow-Up Agent</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Detected refund overdue (₹2,400)</div>
              <div style={{ fontSize: '0.88rem', color: 'var(--gold-main)', marginTop: '0.5rem', fontWeight: 600 }}>
                ⚠️ Awaiting User Approval to dispatch ticket draft
              </div>
            </div>

            <button onClick={handleTryDemo} className="btn btn-primary" style={{ width: '100%' }}>
              Test Emergency Controls in Demo
            </button>
          </div>
        </div>
      </section>

      {/* 6. PRICING PLANS */}
      <section className="page-body" style={{ padding: '6rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="badge badge-waiting" style={{ marginBottom: '1rem' }}>Transparent Pricing</span>
          <h2 style={{ fontSize: '2.8rem', marginBottom: '0.75rem' }}>Simple Plans for Every Stage</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem' }}>Invest in personal context clarity and focus.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="glass-card">
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Free Demo</h3>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '1rem', color: '#f8fafc', fontFamily: 'var(--font-heading)' }}>
              ₹0 <span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>/ month</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              Full synthetic demo mode access with pre-seeded digital life context scenarios.
            </p>
            <button onClick={handleTryDemo} className="btn btn-secondary" style={{ width: '100%' }}>Launch Demo</button>
          </div>

          <div className="glass-card highlight">
            <span className="badge badge-important" style={{ marginBottom: '0.75rem' }}>Most Popular</span>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Pro Plan</h3>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--gold-main)', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
              ₹799 <span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>/ month</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              Continuous Gmail & Calendar monitoring, decision analysis, and user-approved follow-ups.
            </p>
            <button onClick={handleTryDemo} className="btn btn-primary" style={{ width: '100%' }}>Get Pro Access</button>
          </div>

          <div className="glass-card">
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Power Tier</h3>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '1rem', color: '#f8fafc', fontFamily: 'var(--font-heading)' }}>
              ₹1,999 <span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>/ month</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              Advanced autonomous workflows, unlimited long-term memory vault & priority agent execution.
            </p>
            <button onClick={handleTryDemo} className="btn btn-secondary" style={{ width: '100%' }}>Contact Team</button>
          </div>
        </div>
      </section>

      {/* 7. FAQ ACCORDION */}
      <section style={{ background: '#09090d', borderTop: '1px solid var(--border-color)', padding: '6rem 2rem' }}>
        <div className="page-body" style={{ maxWidth: 900 }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="badge badge-waiting" style={{ marginBottom: '1rem' }}>Questions & Answers</span>
            <h2 style={{ fontSize: '2.8rem', marginBottom: '0.75rem' }}>Frequently Asked Questions</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="glass-card" 
                style={{ padding: '1.75rem', cursor: 'pointer' }}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{faq.q}</h3>
                  <ChevronDown 
                    size={20} 
                    style={{ transform: activeFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s' }} 
                  />
                </div>

                {activeFaq === idx && (
                  <p style={{ color: 'var(--text-muted)', marginTop: '1.25rem', lineHeight: 1.65, borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA & FOOTER */}
      <section className="landing-hero" style={{ padding: '6rem 1.5rem' }}>
        <h2 style={{ fontSize: '3.2rem', marginBottom: '1.25rem' }}>
          Ready to regain clarity over your digital life?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '2.5rem' }}>
          Experience Fournn AI Personal Operating System in action right now.
        </p>

        <button onClick={handleTryDemo} className="btn btn-primary" style={{ padding: '1.15rem 2.75rem', fontSize: '1.1rem' }}>
          <span>Launch Fournn Demo Mode</span>
          <ArrowRight size={20} />
        </button>
      </section>

      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '2.5rem 1.5rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.92rem' }}>
        Fournn AI Personal Operating System © 2026. Production-quality MERN Architecture.
      </footer>
    </div>
  );
}
