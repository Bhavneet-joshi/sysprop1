import React, { useState } from 'react';
import { Link } from 'wouter';
import { Mail, Lock } from 'lucide-react';

function generateCaptcha() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  return { question: `${a} + ${b} = ?`, answer: (a + b).toString() };
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [message, setMessage] = useState('');
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [forgotStep, setForgotStep] = useState(0); // 0: email+captcha, 1: OTP
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (captchaInput !== captcha.answer) {
      setCaptchaError('Incorrect CAPTCHA answer.');
      return;
    }
    setCaptchaError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        window.location.href = '/dashboard';
      } else {
        const { message } = await response.json();
        setMessage(message);
      }
    } catch (error) {
      setMessage('An unexpected error occurred.');
    }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotStep === 0) {
      if (captchaInput !== captcha.answer) {
        setCaptchaError('Incorrect CAPTCHA answer.');
        return;
      }
      setCaptchaError('');
      setMessage('OTP sent to: ' + forgotEmail + ' (use 123456)');
      setForgotStep(1);
    } else if (forgotStep === 1) {
      if (otpInput !== '123456') {
        setOtpError('Invalid OTP. Use 123456 (mocked).');
        return;
      }
      setOtpError('');
      setMessage('Password reset link sent to: ' + forgotEmail);
      setForgotStep(0);
      setShowForgot(false);
      setForgotEmail('');
      setOtpInput('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gold-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl transition-transform duration-300 hover:scale-[1.01] hover:shadow-gold-200/40">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-navyblue dark:text-gold-400 drop-shadow-lg">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">Contract Management System</p>
        </div>
        {showForgot ? (
          <form className="mt-8 space-y-6" onSubmit={handleForgot}>
            <div className="rounded-md shadow-sm space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-400 w-5 h-5" />
                <input
                  id="forgot-email"
                  name="forgot-email"
                  type="email"
                  autoComplete="email"
                  required
                  className="pl-10 input-field"
                  placeholder="Email address"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CAPTCHA: {captcha.question}</label>
                <input type="text" name="captcha" value={captchaInput} onChange={e => { setCaptchaInput(e.target.value); setCaptchaError(''); }} className="input-field" placeholder="Enter answer" />
                {captchaError && <div className="text-red-600 text-xs mt-1">{captchaError}</div>}
              </div>
            </div>
            {forgotStep === 1 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">OTP (use 123456):</label>
                <input type="text" name="otp" value={otpInput} onChange={e => { setOtpInput(e.target.value); setOtpError(''); }} className="input-field" placeholder="Enter OTP" />
                {otpError && <div className="text-red-600 text-xs mt-1">{otpError}</div>}
                <div className="text-xs text-gray-500 mb-2">(Mocked: OTP is 123456)</div>
              </div>
            )}
            <div>
              <button type="submit" className="btn-primary w-full bg-gradient-to-r from-gold-400 to-navyblue text-white font-bold py-2 rounded-lg shadow-lg hover:from-navyblue hover:to-gold-400 transition-all duration-200">
                {forgotStep === 0 ? 'Send OTP' : 'Reset Password'}
              </button>
            </div>
            <div className="text-sm text-center mt-2">
              <button type="button" className="text-blue-700 dark:text-gold-400 hover:underline" onClick={() => { setShowForgot(false); setForgotStep(0); setCaptchaInput(''); setCaptchaError(''); setOtpInput(''); setOtpError(''); setMessage(''); }}>Back to Login</button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-400 w-5 h-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="pl-10 input-field"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-400 w-5 h-5" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="pl-10 input-field"
                  placeholder="Password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CAPTCHA: {captcha.question}</label>
                <input type="text" name="captcha" value={captchaInput} onChange={e => { setCaptchaInput(e.target.value); setCaptchaError(''); }} className="input-field" placeholder="Enter answer" />
                {captchaError && <div className="text-red-600 text-xs mt-1">{captchaError}</div>}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button type="button" className="font-medium text-blue-700 dark:text-gold-400 hover:underline" onClick={() => { setShowForgot(true); setCaptchaInput(''); setCaptchaError(''); setOtpInput(''); setOtpError(''); setMessage(''); }}>Forgot password?</button>
              </div>
            </div>
            <div>
              <button type="submit" className="btn-primary w-full bg-gradient-to-r from-gold-400 to-navyblue text-white font-bold py-2 rounded-lg shadow-lg hover:from-navyblue hover:to-gold-400 transition-all duration-200">Sign in</button>
            </div>
            <div className="text-sm text-center mt-2">
              <span>Don&apos;t have an account? </span>
              <Link to="/register" className="text-blue-700 dark:text-gold-400 hover:underline">Register</Link>
            </div>
          </form>
        )}
        {message && <div className="text-center mt-4 p-3 rounded-lg bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 font-semibold shadow animate-pulse-slow">{message}</div>}
      <style>{`
        .input-field {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          color: #1a202c;
          font-size: 1rem;
          outline: none;
          transition: border 0.2s, box-shadow 0.2s;
        }
        .input-field:focus {
          border-color: #FFD700;
          box-shadow: 0 0 0 2px #FFD70033;
        }
        .btn-primary {
          background: linear-gradient(90deg, #FFD700 0%, #1e3a8a 100%);
        }
        .animate-pulse-slow {
          animation: pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
      </div>
    </div>
  );
};

export default Login; 