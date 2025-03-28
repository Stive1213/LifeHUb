function Navbar({ toggleSidebar, toggleTheme, theme }) {
    const handleExport = () => {
      console.log('Exporting data...');
    };
  
    const handleCreateReport = () => {
      console.log('Creating report...');
    };
  
    return (
      <nav
        className={`p-4 flex justify-between items-center ${
          theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'
        }`}
      >
        {/* Left: Logo and Hamburger */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              toggleSidebar();
              console.log('Hamburger button clicked'); // Debug log
            }}
            className="md:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">LifeHub</h1>
        </div>
  
        {/* Right: Welcome, Theme Toggle, and Actions */}
        <div className="flex items-center space-x-4">
          <p className="text-sm">Welcome back, John!</p>
          <button onClick={toggleTheme}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  theme === 'dark'
                    ? 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
                    : 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
                }
              />
            </svg>
          </button>
          <button onClick={handleExport} className="text-sm text-purple-400 hover:text-purple-300">
            Export data
          </button>
          <button
            onClick={handleCreateReport}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
          >
            Create report
          </button>
        </div>
      </nav>
    );
  }
  
  export default Navbar;