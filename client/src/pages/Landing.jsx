import { Link } from 'react-router-dom';
import { Brain, Heart, BarChart3, Shield, ArrowRight, Sparkles } from 'lucide-react';
import Button from '../components/common/Button';

const features = [
  { icon: Brain, title: 'AI Mood Analysis', desc: 'Gemini AI analyzes your journal entries for deep emotional insights.' },
  { icon: Heart, title: 'Crisis Safety', desc: 'Automatic crisis detection with instant helpline access.' },
  { icon: BarChart3, title: 'Smart Analytics', desc: 'Discover mood patterns, triggers, and weekly trends.' },
  { icon: Sparkles, title: 'Guided Wellness', desc: 'Breathing exercises, gratitude journaling, and grounding techniques.' },
  { icon: Shield, title: 'Privacy First', desc: 'Your data stays yours. Export or delete anytime.' }
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          <span className="text-xl font-bold text-white">
            Mood<span className="text-primary-400">Echo</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center px-6 pt-20 pb-16">
        <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 px-4 py-2 rounded-full mb-6">
          <Sparkles className="w-4 h-4 text-primary-400" />
          <span className="text-sm text-primary-300">AI-Powered Mental Wellness</span>
        </div>

        <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Understand your{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">
            emotions
          </span>
          <br />with AI-powered insights
        </h1>

        <p className="text-lg text-dark-400 mb-8 max-w-2xl mx-auto">
          Track your mood through journaling, get AI-powered sentiment analysis,
          discover emotional patterns, and access guided wellness exercises — all in one safe space.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link to="/register">
            <Button size="lg">
              Start Free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/crisis-help">
            <Button variant="secondary" size="lg">
              <Heart className="w-4 h-4" /> Crisis Help
            </Button>
          </Link>
        </div>

        <p className="mt-4 text-xs text-dark-600">
          ⚠️ This is a wellness tool, not a substitute for professional mental health care.
        </p>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={i}
              className="bg-dark-900 border border-dark-800 rounded-2xl p-6 hover:border-primary-500/30 transition-colors"
            >
              <div className="w-10 h-10 bg-primary-500/15 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-primary-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-dark-400 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;