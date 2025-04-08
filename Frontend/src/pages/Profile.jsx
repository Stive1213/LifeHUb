import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [token] = useState(localStorage.getItem('token'));

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data);
          setFormData({
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            age: data.age,
            email: data.email,
            password: '',
            profileImage: data.profileImage,
          });
        } else {
          console.error('Error fetching user data:', data.error);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    if (token) fetchUserData();
  }, [token]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle profile picture upload
  const handlePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profileImage: file }); // Store file object for FormData
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    if (formData.username) formDataToSend.append('username', formData.username);
    if (formData.firstName) formDataToSend.append('firstName', formData.firstName);
    if (formData.lastName) formDataToSend.append('lastName', formData.lastName);
    if (formData.age) formDataToSend.append('age', formData.age);
    if (formData.email) formDataToSend.append('email', formData.email);
    if (formData.password) formDataToSend.append('password', formData.password);
    if (formData.profileImage instanceof File) formDataToSend.append('profileImage', formData.profileImage);

    try {
      const response = await fetch('http://localhost:5000/api/auth/user', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });
      const data = await response.json();
      if (response.ok) {
        const updatedUser = await fetch('http://localhost:5000/api/auth/user', {
          headers: { 'Authorization': `Bearer ${token}` },
        }).then(res => res.json());
        setUser(updatedUser);
        setEditMode(false);
        setFormData({ ...updatedUser, password: '' });
      } else {
        console.error('Error updating profile:', data.error);
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  if (!user) return <div className="text-white">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 p-6 flex flex-col space-y-6">
        <h2 className="text-2xl font-bold">LifeHub</h2>
        <nav className="space-y-4">
          <Link to="/profile" className="block p-2 rounded-lg bg-purple-500 hover:bg-purple-600">Profile</Link>
          <Link to="/tasks" className="block p-2 rounded-lg hover:bg-slate-700">Tasks</Link>
          <Link to="/goals" className="block p-2 rounded-lg hover:bg-slate-700">Goals</Link>
          <Link to="/transactions" className="block p-2 rounded-lg hover:bg-slate-700">Budget</Link>
          <Link to="/events" className="block p-2 rounded-lg hover:bg-slate-700">Events</Link>
          <Link to="/habits" className="block p-2 rounded-lg hover:bg-slate-700">Habits</Link>
          <Link to="/journal" className="block p-2 rounded-lg hover:bg-slate-700">Journal</Link>
          <Link to="/communities" className="block p-2 rounded-lg hover:bg-slate-700">Communities</Link>
          <Link to="/assistant" className="block p-2 rounded-lg hover:bg-slate-700">Assistant</Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">User Profile</h2>

        {/* Profile Card */}
        <div className="bg-slate-800 p-6 rounded-lg shadow mb-6">
          <div className="flex items-center space-x-6">
            <img src={user.profileImage} alt="Profile" className="w-24 h-24 rounded-full" />
            <div>
              <h3 className="text-xl font-bold">{user.firstName} {user.lastName} ({user.username})</h3>
              <p className="text-gray-400">{user.email}</p>
              <p className="text-gray-400">Age: {user.age}</p>
              <p className="text-gray-400">Joined: {user.joinedDate}</p>
              <p className="text-gray-400">Total Points: {user.totalPoints} pts</p>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="bg-slate-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">
            {editMode ? 'Edit Profile' : 'Profile Details'}
          </h3>
          {editMode ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Password (optional)</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePictureUpload}
                  className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                />
                {formData.profileImage && (
                  <img
                    src={formData.profileImage instanceof File ? URL.createObjectURL(formData.profileImage) : formData.profileImage}
                    alt="Preview"
                    className="mt-2 w-24 h-24 rounded-full"
                  />
                )}
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <p><span className="text-gray-400">Username:</span> {user.username}</p>
              <p><span className="text-gray-400">First Name:</span> {user.firstName}</p>
              <p><span className="text-gray-400">Last Name:</span> {user.lastName}</p>
              <p><span className="text-gray-400">Age:</span> {user.age}</p>
              <p><span className="text-gray-400">Email:</span> {user.email}</p>
              <button
                onClick={() => setEditMode(true)}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;