import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle, sendLoginLink, loginWithEmailLink, isEmailLink, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect home
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Handle email link sign-in when they click the magic link
  useEffect(() => {
    const processEmailLink = async () => {
      if (isEmailLink(window.location.href)) {
        let emailForSignIn = window.localStorage.getItem('emailForSignIn');
        if (!emailForSignIn) {
          emailForSignIn = window.prompt('Please provide your email for confirmation');
        }

        if (emailForSignIn) {
          try {
            setLoading(true);
            await loginWithEmailLink(emailForSignIn, window.location.href);
            window.localStorage.removeItem('emailForSignIn');
            navigate('/');
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        }
      }
    };
    processEmailLink();
  }, [isEmailLink, loginWithEmailLink, navigate]);

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      console.error("Failed to log in", error);
      setError(error.message);
    }
  };

  const handleSendLink = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email.endsWith('@northwestern.edu') && !email.endsWith('@u.northwestern.edu')) {
      setError('Please use a valid Northwestern email address (@u.northwestern.edu or @northwestern.edu).');
      return;
    }

    try {
      setLoading(true);
      await sendLoginLink(email);
      window.localStorage.setItem('emailForSignIn', email);
      setMessage('A secure magic link has been sent. Please check your Northwestern email inbox to log in.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50">
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-purple-100 space-y-8 w-full max-w-sm text-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight mb-2">ClassHub</h1>
          <p className="text-gray-500 text-sm font-medium">Log in with your Northwestern email</p>
        </div>

        {message && <div className="bg-green-100 text-green-700 p-3 text-sm rounded font-medium">{message}</div>}
        {error && <div className="bg-red-100 text-red-700 p-3 text-sm rounded font-medium">{error}</div>}

        <form onSubmit={handleSendLink} className="w-full space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            placeholder="netid@u.northwestern.edu"
            className="w-full bg-page border border-line rounded-lg px-4 py-3 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            required
          />
          <button 
            type="submit"
            disabled={loading || !email}
            className="w-full bg-brand hover:bg-brand-hover disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-sm"
          >
            {loading ? 'Sending...' : 'Email me a login link'}
          </button>
        </form>

        <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
          <span className="h-px bg-gray-200 flex-1"></span>
          <span>OR</span>
          <span className="h-px bg-gray-200 flex-1"></span>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors shadow-sm"
        >
          <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}