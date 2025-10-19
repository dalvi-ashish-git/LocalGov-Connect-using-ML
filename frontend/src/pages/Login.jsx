import './Login.css';
import '../components/google-button.js';
import { useState, useEffect } from 'react';
import supabase from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { handleCitizen } from '../services/citizenManager.js';

function Login({ userType }) {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session && session.user) {
        handleCitizen();
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session && session.user) {
        handleCitizen();
        redirectAfterLogin();
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const redirectAfterLogin = () => {
    if (userType === 'citizen') {
      navigate('/citizen/home');
    }
    else if (userType === 'gov') {
      navigate('/');
    }
  };



  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const updateUserMetadata = async () => {
    const userResponse = await supabase.auth.getUser();
    const currentUser = userResponse.data.user;
    if (currentUser) {
      await supabase.auth.updateUser({
        data: { user_type: 'citizen' },
      });
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setMessage(error.message);
    else {
      await updateUserMetadata();
      setMessage('Login successful!');
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) setMessage(error.message);
    setLoading(false);
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      setMessage('Please provide email and password for sign up.');
      return;
    }

    setLoading(true);
    setMessage('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { user_type: 'citizen' } },
    });

    if (error) setMessage(error.message);
    else setMessage('Sign up successful! Please check your email to confirm.');

    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage('Please enter your email to reset password.');
      return;
    }

    setLoading(true);
    setMessage('');

    const { data, error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) setMessage(error.message);
    else setMessage('Password reset email sent! Check your inbox.');

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>{userType === 'citizen' ? 'Citizen' : 'Official'} Login</h1>

        <form onSubmit={handleEmailLogin}>
          <md-outlined-text-field
            label="Email"
            type="email"
            supporting-text="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          ></md-outlined-text-field>

          <md-outlined-text-field
            label="Password"
            type="password"
            supporting-text="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          ></md-outlined-text-field>

          <md-filled-button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </md-filled-button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <google-button onClick={handleGoogleLogin}>
          Sign in with Google
        </google-button>

        <div className="extra-options">
          <span className="link" onClick={handleSignUp}>Sign Up</span>
          <span className="separator">|</span>
          <span className="link" onClick={handleForgotPassword}>Forgot Password?</span>
        </div>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default Login;
