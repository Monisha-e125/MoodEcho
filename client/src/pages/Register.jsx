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
    name: '', email: '', password: '', confirmPassword: ''
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
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="text-3xl">🧠</span>
            <span className="text-2xl font-bold text-white">
              Mood<span className="text-primary-400">Echo</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-6">Create account</h1>
          <p className="text-dark-400 mt-1">Start your mental wellness journey</p>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name" name="name" placeholder="John Doe"
              icon={User} value={formData.name} onChange={handleChange}
              error={errors.name} required
            />
            <Input
              label="Email" name="email" type="email"
              placeholder="you@example.com" icon={Mail}
              value={formData.email} onChange={handleChange}
              error={errors.email} required
            />
            <Input
              label="Password" name="password" type="password"
              placeholder="Min 6 characters" icon={Lock}
              value={formData.password} onChange={handleChange}
              error={errors.password} required
            />
            <Input
              label="Confirm Password" name="confirmPassword" type="password"
              placeholder="Confirm your password" icon={Lock}
              value={formData.confirmPassword} onChange={handleChange}
              error={errors.confirmPassword} required
            />
            <Button type="submit" fullWidth isLoading={isLoading} size="lg">
              Create Account
            </Button>
          </form>

          <p className="text-center text-dark-400 text-sm mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
              Login
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-dark-600 mt-4">
          ⚠️ Not a substitute for professional mental health care.
        </p>
      </div>
    </div>
  );
};

export default Register;