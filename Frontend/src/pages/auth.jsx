import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const toggleAuthMode = () => {
    setIsSignup(!isSignup);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      const endpoint = isSignup ? '/signup' : '/login';
      const url = `http://localhost:5000/api/auth${endpoint}`;
      console.log(`Sending ${isSignup ? 'signup' : 'login'} request to:`, url);

      const response = await axios.post(url, { email, password });
      console.log('Response:', response.data);

      if (!isSignup) {
        if (!response.data.token) {
          throw new Error('No token received from login');
        }
        localStorage.setItem('token', response.data.token);
        console.log('Token stored:', response.data.token);
        navigate('/dashboard');
      } else {
        setError('Signup successful! Please log in.');
        setIsSignup(false);
      }
    } catch (err) {
      console.error('Error:', err);
      if (err.code === 'ERR_NETWORK') {
        setError('Network error: Backend might not be running on http://localhost:5000');
      } else {
        const errorMessage = err.response?.data?.error || err.message || 'Something went wrong';
        setError(errorMessage);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg">
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {isSignup ? 'Sign Up' : 'Login'}
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-400 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition-colors"
          >
            {isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>
        <p className="text-gray-400 mt-4 text-center">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={toggleAuthMode}
            className="text-purple-400 hover:underline ml-1"
          >
            {isSignup ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;