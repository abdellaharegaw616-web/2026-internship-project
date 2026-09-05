import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Eye, EyeOff, Zap, Lock, Mail, AlertCircle,
  FolderKanban, CheckCircle2, ListTodo,
} from 'lucide-react';
import LogoMark from '../components/LogoMark';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

/* ─── Animated counter hook ───────────────────────────────────────────────── */
function useCountUp(target, duration = 1800, startDelay = 400) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!target) return;
    const timeout = setTimeout(() => {
      const startTime = performance.now();
      const tick = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.floor(eased * target));
        if (progress < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }, startDelay);
    return () => {
      clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, startDelay]);

  return value;
}

/* ─── Stat card with animated counter ────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, accentColor, delay }) {
  const count = useCountUp(value, 1600, delay);
  return (
    <div
      className="flex-1 min-w-0 rounded-2xl p-4 border border-white/10 backdrop-blur-sm flex flex-col gap-2"
      style={{ background: 'rgba(255,255,255,0.08)' }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: accentColor + '33', border: `1px solid ${accentColor}55` }}
      >
        <Icon size={15} style={{ color: accentColor }} />
      </div>
      <p
        className="text-white text-2xl font-bold tabular-nums"
        style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.5px' }}
      >
        {count}
      </p>
      <p className="text-blue-200/70 text-xs font-medium">{label}</p>
    </div>
  );
}

/* ─── Main Login Component ────────────────────────────────────────────────── */
export default function Login() {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember]         = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [bgLoaded, setBgLoaded]         = useState(false);
  const [stats, setStats]               = useState({ projects: 0, tasks: 0, completed: 0 });

  const { login } = useAuth();
  const navigate  = useNavigate();

  /* Preload background */
  useEffect(() => {
    const img = new Image();
    img.src = '/login-bg.png';
    img.onload = () => setBgLoaded(true);
  }, []);

  /* Fetch live platform stats */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/public-stats');
        if (res.data.success) setStats(res.data.stats);
      } catch {
        /* silently fall back to zeros */
      }
    };
    fetchStats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back! 👋');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Render ── */
  return (
    <div
      className="min-h-screen flex"
      style={{ background: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}
    >
      {/* ════════════════════════════════════════
          LEFT  —  Visual / Brand Panel
      ════════════════════════════════════════ */}
      <aside
        className="hidden lg:flex flex-col justify-between w-5/12 xl:w-[42%] relative overflow-hidden"
        aria-hidden="true"
      >
        {/* Fallback gradient — visible before image loads */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(160deg, #0F2A5A 0%, #172338 60%, #0A1628 100%)',
          }}
        />

        {/* Background image — team collaboration photo */}
        <div
          className="absolute inset-0 z-0 transition-opacity duration-700"
          style={{
            backgroundImage: bgLoaded ? 'url(/login-bg.png)' : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center 15%',
            opacity: bgLoaded ? 1 : 0,
          }}
        />

        {/* Layer 1 — deep navy gradient for legibility over bright photo */}
        <div
          className="absolute inset-0 z-1"
          style={{
            background:
              'linear-gradient(175deg, rgba(10,22,56,0.78) 0%, rgba(12,28,68,0.60) 38%, rgba(6,14,36,0.92) 100%)',
          }}
        />
        {/* Layer 2 — cool blue tint to unify brand color */}
        <div
          className="absolute inset-0 z-1"
          style={{ background: 'rgba(15,52,140,0.22)' }}
        />
        {/* Layer 3 — subtle vignette from edges for focus */}
        <div
          className="absolute inset-0 z-1 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 120px rgba(6,14,36,0.45)',
          }}
        />

        {/* Decorative glow orbs */}
        <div
          className="absolute z-1 pointer-events-none"
          style={{
            top: '-120px', right: '-80px',
            width: '420px', height: '420px',
            background: 'radial-gradient(circle, rgba(37,99,235,0.28) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute z-1 pointer-events-none"
          style={{
            bottom: '60px', left: '-60px',
            width: '300px', height: '300px',
            background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 65%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full justify-between p-10 xl:p-12">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <LogoMark size={40} className="shrink-0" />
            <div>
              <h1
                className="text-white font-bold text-xl leading-none"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Task Flow
              </h1>
              <p className="text-blue-300/80 text-[11px] mt-0.5 tracking-wide">
                Project Management System
              </p>
            </div>
          </div>

          {/* Main copy + stats */}
          <div>


            <h2
              className="font-bold leading-tight mb-4 text-white"
              style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(28px, 3vw, 40px)' }}
            >
              Manage your<br />
              team's work<br />
              with clarity.
            </h2>

            <p className="text-white/80 text-[15px] leading-relaxed mb-10 max-w-xs">
              A centralized platform to manage teams, projects, and tasks —
              replacing WhatsApp groups and Excel sheets.
            </p>

            {/* Stat cards */}
            <div className="flex gap-3">
              <StatCard
                icon={FolderKanban}
                label="Projects"
                value={stats.projects}
                accentColor="#60A5FA"
                delay={400}
              />
              <StatCard
                icon={ListTodo}
                label="Tasks"
                value={stats.tasks}
                accentColor="#A78BFA"
                delay={600}
              />
              <StatCard
                icon={CheckCircle2}
                label="Completed"
                value={stats.completed}
                accentColor="#4ADE80"
                delay={800}
              />
            </div>
          </div>

          {/* Footer */}
          <p className="text-blue-400/60 text-xs">
            © 2026 Task Flow. Internship Project.
          </p>
        </div>
      </aside>

      {/* ════════════════════════════════════════
          RIGHT  —  Login Form Panel
      ════════════════════════════════════════ */}
      <main
        className="flex-1 flex items-center justify-center p-6 sm:p-10 overflow-y-auto"
        style={{ background: '#FFFFFF' }}
      >
        <div className="w-full max-w-[420px]">

          {/* Mobile logo (hidden on desktop where sidebar shows) */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <LogoMark size={36} className="shrink-0" />
            <div>
              <h1
                className="font-bold text-lg text-slate-800 leading-none"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Task Flow
              </h1>
              <p className="text-slate-400 text-[10px] mt-0.5">Project Management</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2
              className="text-slate-800 font-bold mb-1.5"
              style={{ fontFamily: 'Poppins, sans-serif', fontSize: '28px', letterSpacing: '-0.4px' }}
            >
              Welcome Back
            </h2>
            <p className="text-slate-500 text-[15px]">
              Sign in to your account to continue
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div
              className="flex items-start gap-3 p-3.5 mb-6 rounded-xl text-sm"
              style={{
                background: '#FFF1F2',
                border: '1px solid #FFC1C8',
                color: '#B91C1C',
              }}
              role="alert"
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: '#94A3B8' }}
                />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setError(''); setEmail(e.target.value); }}
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-slate-800 placeholder-slate-400 transition-all duration-150 outline-none"
                  style={{
                    background: '#F8FAFC',
                    border: '1.5px solid #E2E8F0',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#2563EB';
                    e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.12)';
                    e.target.style.background = '#FFFFFF';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E2E8F0';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = '#F8FAFC';
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: '#94A3B8' }}
                />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setError(''); setPassword(e.target.value); }}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl text-sm text-slate-800 placeholder-slate-400 transition-all duration-150 outline-none"
                  style={{
                    background: '#F8FAFC',
                    border: '1.5px solid #E2E8F0',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#2563EB';
                    e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.12)';
                    e.target.style.background = '#FFFFFF';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E2E8F0';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = '#F8FAFC';
                  }}
                />
                <button
                  id="login-toggle-password"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-150"
                  style={{ color: '#94A3B8' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#475569')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <label
                id="login-remember-label"
                className="flex items-center gap-2.5 cursor-pointer group select-none"
              >
                <div className="relative shrink-0">
                  <input
                    id="login-remember"
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="sr-only"
                  />
                  {/* Custom checkbox */}
                  <div
                    className="w-4.5 h-4.5 rounded-md border-2 flex items-center justify-center transition-all duration-150"
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '5px',
                      background: remember ? '#2563EB' : '#FFFFFF',
                      borderColor: remember ? '#2563EB' : '#CBD5E1',
                    }}
                  >
                    {remember && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="white"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-slate-600">Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                id="login-forgot-link"
                className="text-sm font-semibold transition-colors duration-150"
                style={{ color: '#2563EB' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#1D4ED8')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#2563EB')}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit button */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: loading
                  ? '#94A3B8'
                  : '#2563EB',
                boxShadow: loading
                  ? 'none'
                  : '0 4px 16px rgba(37,99,235,0.38)',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.boxShadow = '0 6px 24px rgba(37,99,235,0.52)';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.38)';
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12" cy="12" r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Signing in…
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: '#E2E8F0' }} />
            <span className="text-xs text-slate-400 font-medium">OR</span>
            <div className="flex-1 h-px" style={{ background: '#E2E8F0' }} />
          </div>

          {/* Sign up CTA */}
          <p className="text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              id="login-signup-link"
              className="font-semibold transition-colors duration-150"
              style={{ color: '#2563EB' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#1D4ED8')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#2563EB')}
            >
              Sign Up
            </Link>
          </p>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mt-8">
            {['256-bit SSL', 'SOC 2 Compliant', 'GDPR Ready'].map((badge) => (
              <div
                key={badge}
                className="flex items-center gap-1.5 text-xs"
                style={{ color: '#94A3B8' }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9.5L3 11L3.5 7.5L1 5L4.5 4.5L6 1Z"
                    fill="#CBD5E1"
                  />
                </svg>
                {badge}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
