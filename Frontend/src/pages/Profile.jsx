import { useState } from 'react';

function Profile() {
  // Mock user data
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    profilePicture: 'https://via.placeholder.com/150',
    joinedDate: '2025-01-01',
    totalPoints: 150,
  });

  // State for editing profile
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: '',
  });

  // State for profile picture upload
  const [newProfilePicture, setNewProfilePicture] = useState(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle profile picture upload
  const handlePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setUser({
      ...user,
      name: formData.name,
      email: formData.email,
      profilePicture: newProfilePicture || user.profilePicture,
    });
    setEditMode(false);
    setNewProfilePicture(null);
    setFormData({ ...formData, password: '' });
  };

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-6">User Profile</h2>

      {/* Profile Card */}
      <div className="bg-slate-800 p-6 rounded-lg shadow mb-6">
        <div className="flex items-center space-x-6">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full"
          />
          <div>
            <h3 className="text-xl font-bold">{user.name}</h3>
            <p className="text-gray-400">{user.email}</p>
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
              <label className="block text-gray-400 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                placeholder="Enter your name"
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
                placeholder="Enter your email"
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
              {newProfilePicture && (
                <img
                  src={newProfilePicture}
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
            <p>
              <span className="text-gray-400">Name:</span> {user.name}
            </p>
            <p>
              <span className="text-gray-400">Email:</span> {user.email}
            </p>
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
  );
}

export default Profile;