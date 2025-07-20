import React, { useState } from 'react';
import { Link } from 'wouter';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Contract Management System</p>
        </div>
        {showForgot ? (
          <form className="mt-8 space-y-6" onSubmit={handleForgot}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="forgot-email" className="sr-only">Email address</label>
                <input
                  id="forgot-email"
                  name="forgot-email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">CAPTCHA: {captcha.question}</label>
                <input type="text" name="captcha" value={captchaInput} onChange={e => { setCaptchaInput(e.target.value); setCaptchaError(''); }} className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Enter answer" />
                {captchaError && <div className="text-red-600 text-xs mt-1">{captchaError}</div>}
              </div>
            </div>
            {forgotStep === 1 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">OTP (use 123456):</label>
                <input type="text" name="otp" value={otpInput} onChange={e => { setOtpInput(e.target.value); setOtpError(''); }} className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Enter OTP" />
                {otpError && <div className="text-red-600 text-xs mt-1">{otpError}</div>}
                <div className="text-xs text-gray-500 mb-2">(Mocked: OTP is 123456)</div>
              </div>
            )}
            <div>
              <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                {forgotStep === 0 ? 'Send OTP' : 'Reset Password'}
              </button>
            </div>
            <div className="text-sm text-center mt-2">
              <button type="button" className="text-blue-700 hover:underline" onClick={() => { setShowForgot(false); setForgotStep(0); setCaptchaInput(''); setCaptchaError(''); setOtpInput(''); setOtpError(''); setMessage(''); }}>Back to Login</button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">CAPTCHA: {captcha.question}</label>
                <input type="text" name="captcha" value={captchaInput} onChange={e => { setCaptchaInput(e.target.value); setCaptchaError(''); }} className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Enter answer" />
                {captchaError && <div className="text-red-600 text-xs mt-1">{captchaError}</div>}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button type="button" className="font-medium text-blue-700 hover:underline" onClick={() => { setShowForgot(true); setCaptchaInput(''); setCaptchaError(''); setOtpInput(''); setOtpError(''); setMessage(''); }}>Forgot password?</button>
              </div>
            </div>
            <div>
              <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Sign in</button>
            </div>
            <div className="text-sm text-center mt-2">
              <span>Don&apos;t have an account? </span>
              <Link to="/register" className="text-blue-700 hover:underline">Register</Link>
            </div>
          </form>
        )}
        {message && <div className="text-center text-green-600 mt-4">{message}</div>}
      </div>
    </div>
  );
};

export default Login; 