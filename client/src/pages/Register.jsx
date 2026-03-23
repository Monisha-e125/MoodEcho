import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, isAuthenticated, clearAuthError } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
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
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email) errs.email = 'Email is required';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Must be 6+ characters';
    if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await register(formData);
    if (result.meta?.requestStatus === 'fulfilled') {
      toast.success('Welcome to MoodEcho! 🎉');
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
            Create account
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '14px' }}>
            Start your mental wellness journey
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
                label="Full Name"
                name="name"
                placeholder="John Doe"
                icon={User}
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
              />
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
                placeholder="Min 6 characters"
                icon={Lock}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
              />
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                icon={Lock}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
              />
              <div style={{ paddingTop: '4px' }}>
                <Button type="submit" fullWidth isLoading={isLoading} size="lg">
                  Create Account
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
            Already have an account?{' '}
            <Link
              to="/login"
              style={{ color: '#818cf8', fontWeight: '600', textDecoration: 'none' }}
            >
              Login
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

export default Register;