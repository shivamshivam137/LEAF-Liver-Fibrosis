// LEAF - Login Page
// Split two-column layout matching reference screenshot

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LeafIcon } from '../components/common/LeafLogo';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    clearError();
    const ok = await login(data.email, data.password);
    if (ok) navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left branding column ── */}
      <div
        className="hidden lg:flex lg:w-5/12 flex-col justify-between p-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0f1b2d 0%, #162033 60%, #0d3321 100%)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <LeafIcon size={44} />
          <div>
            <p className="text-2xl font-bold text-white tracking-tight">LEAF</p>
            <p className="text-xs text-green-400 font-medium">Liver Evaluation and Assessment for Fibrosis</p>
          </div>
        </div>

        {/* Tagline */}
        <div className="space-y-4 z-10">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Better insights.<br />
            <span className="text-green-400">Healthier</span> tomorrows.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            A digital framework for liver-fibrosis assessment, calculation and tracking.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 pt-4">
            {['FIB-4 Calculator', 'FibroScan Tracking', 'Trend Visualization', 'Clinical Reports'].map(f => (
              <span key={f} className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: 'rgba(22,163,74,0.15)', color: '#86efac', border: '1px solid rgba(22,163,74,0.25)' }}>
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Decorative leaf illustration */}
        <div className="absolute bottom-0 right-0 opacity-10">
          <svg width="300" height="300" viewBox="0 0 300 300" fill="none">
            <path d="M150 20C150 20 40 90 40 170C40 230 90 280 150 280C210 280 260 230 260 170C260 90 150 20 150 20Z" fill="white" />
            <path d="M150 50V270M150 130L100 90M150 170L100 140M150 170L200 140M150 130L200 90" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
          </svg>
        </div>

        {/* Footer note */}
        <p className="text-xs text-slate-600 z-10">
          Academic prototype · Fictional data only · Not for clinical use
        </p>
      </div>

      {/* ── Right login form column ── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white lg:bg-slate-50">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <LeafIcon size={36} />
            <div>
              <p className="text-xl font-bold text-slate-800">LEAF</p>
              <p className="text-xs text-green-600">Liver Evaluation and Assessment for Fibrosis</p>
            </div>
          </div>

          <div className="lg:card lg:p-8 fade-in">
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
              <p className="text-sm text-slate-500 mt-1">Sign in to your LEAF account</p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-5" role="alert">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  placeholder="doctor@example.test"
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.email ? 'border-red-400' : 'border-slate-300'}`}
                  aria-invalid={!!errors.email}
                />
                {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                  <button type="button" className="text-xs text-teal-600 hover:text-teal-700 font-medium">Forgot password?</button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    {...register('password')}
                    placeholder="Enter your password"
                    className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.password ? 'border-red-400' : 'border-slate-300'}`}
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password.message}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                {isLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />Signing in...</>
                  : 'Sign In'
                }
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-5">
              Don't have an account?{' '}
              <button className="text-teal-600 hover:text-teal-700 font-medium">Create one</button>
            </p>

            {/* Demo hint */}
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-xs font-medium text-slate-500 mb-1.5">Demo credentials</p>
              <p className="text-xs text-slate-600">Email: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">doctor@example.test</code></p>
              <p className="text-xs text-slate-600 mt-1">Password: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">demo-password</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
