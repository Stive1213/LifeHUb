import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const toggleAuthMode = () => {
    setIsSignup(!isSignup);
    setError('');
    setUsername('');
    setFirstName('');
    setLastName('');
    setProfileImage(null);
    setAge('');
    setEmail('');
    setPassword('');
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const checkBackendStatus = async () => {
    try {
      await axios.get('http://localhost:5000/');
      console.log('Backend is running');
      return true;
    } catch (err) {
      console.error('Backend check failed:', err);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isSignup) {
      if (!username || !firstName || !lastName || !age || !email || !password) {
        setError('All fields except profile image are required for signup');
        return;
      }
    } else {
      if (!username || !password) {
        setError('Username and password are required for login');
        return;
      }
    }

    try {
      const endpoint = isSignup ? '/signup' : '/login';
      const url = `http://localhost:5000/api/auth${endpoint}`;
      console.log(`Sending ${isSignup ? 'signup' : 'login'} request to:`, url);

      if (isSignup) {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        if (profileImage) formData.append('profileImage', profileImage);
        formData.append('age', age);
        formData.append('email', email);
        formData.append('password', password);

        const response = await axios.post(url, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('Signup response:', response.data);
        setError('Signup successful! Please log in.');
        setIsSignup(false);
      } else {
        const isBackendUp = await checkBackendStatus();
        if (!isBackendUp) {
          throw new Error('Backend is not responding');
        }

        const response = await axios.post(url, { username, password });
        console.log('Login response:', response.data);

        if (!response.data.token) {
          throw new Error('No token received from login');
        }
        localStorage.setItem('token', response.data.token);
        console.log('Token stored:', response.data.token);
        navigate('/dashboard');
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
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {isSignup && (
            <>
              <div className="mb-4">
                <label className="block text-gray-400 mb-2" htmlFor="username">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your username"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 mb-2" htmlFor="firstName">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your first name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 mb-2" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your last name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 mb-2" htmlFor="profileImage">
                  Profile Image (optional)
                </label>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 mb-2" htmlFor="age">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your age"
                />
              </div>
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
            </>
          )}
          {!isSignup && (
            <div className="mb-4">
              <label className="block text-gray-400 mb-2" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your username"
              />
            </div>
          )}
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