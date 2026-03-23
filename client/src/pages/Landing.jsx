import { Link } from 'react-router-dom';
import {
  Brain, Heart, BarChart3, Shield, ArrowRight,
  Sparkles, MessageCircle, Phone
} from 'lucide-react';
import Button from '../components/common/Button';

const features = [
  {
    icon: Brain,
    title: 'AI Mood Analysis',
    desc: 'Gemini AI analyzes your journal entries for deep emotional insights and personalized patterns.',
    color: '#818cf8',
  },
  {
    icon: Heart,
    title: 'Crisis Safety',
    desc: 'Automatic crisis detection with instant helpline access. Your safety comes first.',
    color: '#f472b6',
  },
  {
    icon: BarChart3,
    title: 'Smart Analytics',
    desc: 'Discover mood patterns, triggers, weekday trends, and get weekly AI-generated reports.',
    color: '#34d399',
  },
  {
    icon: Sparkles,
    title: 'Guided Wellness',
    desc: 'Breathing exercises, gratitude journaling, and 5-4-3-2-1 grounding techniques.',
    color: '#fbbf24',
  },
  {
    icon: MessageCircle,
    title: 'Peer Support',
    desc: 'Anonymous support rooms with real-time chat. Connect with people who understand.',
    color: '#60a5fa',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    desc: 'Your data stays yours. Export or delete everything anytime. GDPR compliant.',
    color: '#a78bfa',
  },
];

const Landing = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617' }}>
      {/* Navbar */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px' }}>🧠</span>
          <span style={{ fontSize: '22px', fontWeight: '800', color: '#f1f5f9' }}>
            Mood<span style={{ color: '#818cf8' }}>Echo</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link to="/crisis-help">
            <Button variant="ghost" size="sm">
              <Phone size={14} /> Crisis Help
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '80px 24px 60px',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            padding: '8px 18px',
            borderRadius: '100px',
            marginBottom: '28px',
          }}
        >
          <Sparkles size={15} style={{ color: '#818cf8' }} />
          <span style={{ fontSize: '13px', color: '#a5b4fc', fontWeight: '500' }}>
            AI-Powered Mental Wellness
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: '800',
            color: '#f1f5f9',
            lineHeight: '1.15',
            marginBottom: '20px',
          }}
        >
          Understand your{' '}
          <span className="gradient-text">emotions</span>
          <br />
          with AI-powered insights
        </h1>

        <p
          style={{
            fontSize: '17px',
            color: '#94a3b8',
            lineHeight: '1.7',
            maxWidth: '600px',
            margin: '0 auto 32px',
          }}
        >
          Track your mood through journaling, get AI-powered sentiment analysis,
          discover emotional patterns, and access guided wellness exercises — all in one safe space.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/register">
            <Button size="lg">
              Start Free <ArrowRight size={16} />
            </Button>
          </Link>
          <Link to="/crisis-help">
            <Button variant="secondary" size="lg">
              <Heart size={16} /> Crisis Help
            </Button>
          </Link>
        </div>

        <p style={{ marginTop: '16px', fontSize: '12px', color: '#475569' }}>
          ⚠️ This is a wellness tool, not a substitute for professional mental health care.
        </p>
      </section>

      {/* Features */}
      <section
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 24px 80px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px',
          }}
        >
          {features.map(({ icon: Icon, title, desc, color }, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#0f172a',
                border: '1px solid #1e293b',
                borderRadius: '16px',
                padding: '28px',
                transition: 'all 0.3s ease',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = color + '40';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#1e293b';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: color + '15',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <Icon size={20} style={{ color }} />
              </div>
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#f1f5f9',
                  marginBottom: '8px',
                }}
              >
                {title}
              </h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;