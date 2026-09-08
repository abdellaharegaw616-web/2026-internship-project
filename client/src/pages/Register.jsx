import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Eye, EyeOff, Zap, Lock, Mail, User, AlertCircle, CheckCircle2, ShieldCheck,
  Network, BarChart2
} from 'lucide-react';
import LogoMark from '../components/LogoMark';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

/* ─── Password strength helper ─────────────────────────────────────────── */
function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8)                        score++;
  if (/[A-Z]/.test(password))                     score++;
  if (/[0-9]/.test(password))                     score++;
  if (/[^A-Za-z0-9]/.test(password))              score++;

  const levels = [
    { score: 0, label: '',         color: '' },
    { score: 1, label: 'Weak',     color: '#DC2626' },
    { score: 2, label: 'Fair',     color: '#F59E0B' },
    { score: 3, label: 'Good',     color: '#3B82F6' },
    { score: 4, label: 'Strong',   color: '#16A34A' },
  ];
  return levels[score];
}

/* ─── Strength Bar ──────────────────────────────────────────────────────── */
function StrengthBar({ password }) {
  const { score, label, color } = useMemo(() => getPasswordStrength(password), [password]);
  if (!password) return null;

  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{
              background: i <= score ? color : '#E2E8F0',
            }}
          />
        ))}
      </div>
      {label && (
        <p className="text-xs font-medium" style={{ color }}>
          {label} password
        </p>
      )}
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────── */
export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword]         = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms]       = useState(false);
  const [loading, setLoading]                   = useState(false);
  const [error, setError]                       = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setError('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const passwordsMatch =
    form.confirmPassword.length > 0 && form.password === form.confirmPassword;
  const passwordMismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match. Please check and try again.');
      return;
    }
    if (!agreedToTerms) {
      setError('You must agree to the Terms and Conditions to create an account.');
      return;
    }

    setLoading(true);
    try {
      /* RBAC: role is always hardcoded to 'TeamMember' on the client.
         The server should also enforce this, but we never send 'Admin' from
         a public registration form. */
      await register({
        name:     form.name,
        email:    form.email,
        password: form.password,
        role:     'TeamMember',       // ← RBAC guard: public users cannot self-assign Admin
      });
      toast.success('Account created successfully! 🎉');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── JSX ── */
  return (
    <div className="min-h-screen flex" style={{ background: '#F8FAFC' }}>

      {/* ── Left Visual Panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-5/12 p-12 relative overflow-hidden">
        {/* Background image + overlays */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/login-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-blue-900/70 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col h-full justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <LogoMark size={40} className="shrink-0" />
            <div>
              <h1 className="text-white font-bold text-xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Task Flow
              </h1>
              <p className="text-blue-300 text-xs">Project Management System</p>
            </div>
          </div>

          {/* Headline */}
          <div>
            <h2
              className="text-white text-4xl font-bold mb-4 leading-tight"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Join your team<br />on Task Flow.
            </h2>
            <p className="text-blue-200 text-base leading-relaxed mb-10">
              Create your account and start collaborating on projects, tracking tasks,
              and delivering results — all in one place.
            </p>

            {/* Feature pills */}
            <div className="flex flex-col gap-3">
              {[
                { icon: Zap, text: 'Lightning-fast task management' },
                { icon: Network, text: 'Collaborate with your entire team' },
                { icon: BarChart2, text: 'Track progress in real-time' },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl px-4 py-3 border border-white/10"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10">
                    <Icon size={16} className="text-blue-400" />
                  </div>
                  <span className="text-white/80 text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-blue-400 text-sm">© 2026 Task Flow. Internship Project.</p>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md py-6">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <LogoMark size={36} className="shrink-0" />
            <h1 className="font-bold text-xl text-slate-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Task Flow
            </h1>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2
              className="text-3xl font-bold text-slate-800 mb-2"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Create your account
            </h2>
            <p className="text-slate-500">
              Start managing your team's work with Task Flow.
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="flex items-start gap-2 p-3 mb-5 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* ── Full Name ── */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  required
                  autoComplete="name"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* ── Email ── */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  required
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* ── Password ── */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  id="reg-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Strength bar */}
              <StrengthBar password={form.password} />

              <p className="mt-1.5 text-xs text-slate-400">
                Use 8+ characters with a mix of letters, numbers &amp; symbols.
              </p>
            </div>

            {/* ── Confirm Password ── */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="reg-confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  required
                  autoComplete="new-password"
                  className={`w-full pl-11 pr-11 py-3 bg-slate-50 border rounded-xl text-slate-800 placeholder-slate-400 text-sm transition-all focus:outline-none focus:ring-2 ${
                    passwordMismatch
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                      : passwordsMatch
                      ? 'border-green-400 focus:border-green-400 focus:ring-green-100'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                />
                {/* Right icon: eye toggle or match indicator */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {passwordsMatch && (
                    <CheckCircle2 size={14} className="text-green-500" />
                  )}
                  <button
                    type="button"
                    id="reg-toggle-confirm-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {passwordMismatch && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">
                  Passwords do not match.
                </p>
              )}
              {passwordsMatch && (
                <p className="mt-1.5 text-xs text-green-600 font-medium">
                  Passwords match ✓
                </p>
              )}
            </div>

            {/* ── RBAC notice (no Admin self-registration) ── */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <ShieldCheck size={15} className="text-blue-500 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-700 leading-relaxed">
                New accounts are created as <strong>Team Member</strong> by default.
                An administrator can promote your role from the team settings.
              </p>
            </div>

            {/* ── Terms & Conditions ── */}
            <label
              id="reg-terms-label"
              className="flex items-start gap-3 cursor-pointer group"
            >
              <div className="relative mt-0.5 shrink-0">
                <input
                  id="reg-terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="sr-only"
                />
                {/* Custom checkbox */}
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-150 ${
                    agreedToTerms
                      ? 'bg-blue-600 border-blue-600'
                      : 'bg-white border-slate-300 group-hover:border-blue-400'
                  }`}
                >
                  {agreedToTerms && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-slate-600 leading-relaxed">
                I agree to the{' '}
                <a
                  href="#terms"
                  className="font-semibold text-blue-600 hover:text-blue-700 underline-offset-2 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a
                  href="#privacy"
                  className="font-semibold text-blue-600 hover:text-blue-700 underline-offset-2 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Privacy Policy
                </a>
                .
              </span>
            </label>

            {/* ── Submit ── */}
            <button
              id="reg-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: loading ? '#94a3b8' : '#2563EB',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(37,99,235,0.4)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign in link */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
