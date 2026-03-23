import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated, clearAuthError } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) { toast.error(error); clearAuthError(); }
  }, [error, clearAuthError]);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((p) => ({ ...p, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.email) errs.email = 'Email is required';
    if (!formData.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await login(formData);
    if (result.meta?.requestStatus === 'fulfilled') {
      toast.success('Welcome back! 👋');
      navigate('/dashboard');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'linear-gradient(180deg, #020617 0%, #0f172a 100%)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '420px' }} className="animate-fade-in">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
            }}
          >
            <span style={{ fontSize: '32px' }}>🧠</span>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#f1f5f9' }}>
              Mood<span style={{ color: '#818cf8' }}>Echo</span>
            </span>
          </Link>
          <h1
            style={{
              fontSize: '26px',
              fontWeight: '800',
              color: '#f1f5f9',
              marginTop: '28px',
            }}
          >
            Welcome back
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '14px' }}>
            Login to continue tracking your mood
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            backgroundColor: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
          }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                icon={Lock}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
              />
              <div style={{ paddingTop: '4px' }}>
                <Button type="submit" fullWidth isLoading={isLoading} size="lg">
                  Login
                </Button>
              </div>
            </div>
          </form>

          <p
            style={{
              textAlign: 'center',
              color: '#64748b',
              fontSize: '14px',
              marginTop: '24px',
            }}
          >
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              style={{
                color: '#818cf8',
                fontWeight: '600',
                textDecoration: 'none',
              }}
            >
              Sign up
            </Link>
          </p>
        </div>

        <p
          style={{
            textAlign: 'center',
            fontSize: '11px',
            color: '#475569',
            marginTop: '24px',
          }}
        >
          ⚠️ Not a substitute for professional mental health care.
        </p>
      </div>
    </div>
  );
};

export default Login;