import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function Auth() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [transactionScreenshot, setTransactionScreenshot] = useState(null);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const navigate = useNavigate(); // Initialize useNavigate

  // Validate form inputs
  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle Sign-Up form submission
  const handleSignUp = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Signing up with email:', email, 'and password:', password);
      setIsSignedUp(true); // Move to payment step
    }
  };

  // Handle Login form submission
  const handleLogin = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Logging in with email:', email, 'and password:', password);
      navigate('/dashboard'); // Navigate to Dashboard
    }
  };

  // Handle file upload for transaction screenshot
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTransactionScreenshot(URL.createObjectURL(file));
      console.log('Transaction screenshot uploaded:', file.name);
    }
  };

  // Handle payment submission
  const handlePaymentSubmit = () => {
    if (!transactionScreenshot) {
      alert('Please upload a transaction screenshot.');
      return;
    }
    console.log('Payment verified with screenshot. Completing sign-up...');
    navigate('/dashboard'); // Navigate to Dashboard
  };

  return (
    <div className="min-h-screen gradient-bg text-white flex flex-col">
      {/* Navbar */}
      <nav className="p-4 bg-slate-800">
        <h1 className="text-xl font-bold">LifeHub</h1>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
          {!isSignedUp ? (
            <>
              {/* Form Toggle */}
              <div className="flex justify-center mb-6">
                <button
                  onClick={() => setIsSignUp(true)}
                  className={`px-4 py-2 rounded-l-lg ${
                    isSignUp ? 'bg-purple-500' : 'bg-slate-700'
                  } hover:bg-purple-600 transition-colors`}
                >
                  Sign Up
                </button>
                <button
                  onClick={() => setIsSignUp(false)}
                  className={`px-4 py-2 rounded-r-lg ${
                    !isSignUp ? 'bg-purple-500' : 'bg-slate-700'
                  } hover:bg-purple-600 transition-colors`}
                >
                  Log In
                </button>
              </div>

              {/* Form */}
              <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
                {/* Email Field */}
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm text-gray-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm text-gray-400 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                    placeholder="Enter your password"
                  />
                  {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  {isSignUp ? 'Sign Up' : 'Log In'}
                </button>
              </form>

              {/* Switch Link */}
              <p className="text-center text-sm text-gray-400 mt-4">
                {isSignUp ? 'Already have an account?' : 'Need an account?'}{' '}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-purple-400 hover:text-purple-300"
                >
                  {isSignUp ? 'Log in' : 'Sign up'}
                </button>
              </p>

              {/* Subscription Note (only for Sign-Up) */}
              {isSignUp && (
                <p className="text-center text-sm text-gray-400 mt-4">
                  Join for 100 ETB/year after signing up!
                </p>
              )}
            </>
          ) : (
            <>
              {/* Payment Step */}
              <h2 className="text-2xl font-bold mb-4 text-center">Complete Your Subscription</h2>
              <p className="text-sm text-gray-400 mb-4 text-center">
                Please pay 100 ETB/year to activate your LifeHub account. Send the payment to [Your Payment Details] and upload a screenshot of the transaction below.
              </p>

              {/* File Upload */}
              <div className="mb-4">
                <label htmlFor="transaction-screenshot" className="block text-sm text-gray-400 mb-2">
                  Upload Transaction Screenshot
                </label>
                <input
                  type="file"
                  id="transaction-screenshot"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Screenshot Preview */}
              {transactionScreenshot && (
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">Preview:</p>
                  <img
                    src={transactionScreenshot}
                    alt="Transaction Screenshot"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Submit Payment */}
              <button
                onClick={handlePaymentSubmit}
                className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors"
              >
                Submit Payment
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Auth;