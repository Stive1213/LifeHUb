import { useState } from 'react';

function DocumentVault() {
  // Mock data for files
  const [files, setFiles] = useState([
    {
      id: '1',
      name: '2024_Tax_Return.pdf',
      tags: ['Taxes', 'Finance'],
      url: 'https://example.com/files/2024_Tax_Return.pdf',
    },
    {
      id: '2',
      name: 'Passport_Scan.jpg',
      tags: ['Personal', 'Travel'],
      url: 'https://example.com/files/Passport_Scan.jpg',
    },
  ]);

  // State for upload form
  const [newFile, setNewFile] = useState({
    name: '',
    tags: '',
  });

  // State for search input
  const [searchQuery, setSearchQuery] = useState('');

  // Handle upload form input changes
  const handleFileChange = (e) => {
    setNewFile({ ...newFile, [e.target.name]: e.target.value });
  };

  // Handle file upload (simulated)
  const handleUpload = (e) => {
    e.preventDefault();
    if (!newFile.name) return;
    const tagsArray = newFile.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    const file = {
      id: Date.now().toString(),
      name: newFile.name,
      tags: tagsArray,
      url: `https://example.com/files/${newFile.name.replace(/\s/g, '_')}`,
    };
    console.log('File uploaded:', file);
    setFiles([...files, file]);
    setNewFile({ name: '', tags: '' });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Handle file download (simulated)
  const handleDownload = (file) => {
    console.log(`Downloading file: ${file.name} from ${file.url}`);
  };

  // Handle file deletion
  const handleDelete = (fileId) => {
    console.log(`Deleting file with ID: ${fileId}`);
    setFiles(files.filter((file) => file.id !== fileId));
  };

  // Filter files based on search query
  const filteredFiles = files.filter((file) => {
    const nameMatch = file.name.toLowerCase().includes(searchQuery);
    const tagMatch = file.tags.some((tag) => tag.toLowerCase().includes(searchQuery));
    return nameMatch || tagMatch;
  });

  return (
    <div className="text-white">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6">Document Vault</h2>

      {/* Upload Form */}
      <div className="bg-slate-800 p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-bold mb-4">Upload File</h3>
        <form onSubmit={handleUpload}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="file-name" className="block text-sm text-gray-400 mb-2">
                File Name (Mock File Picker)
              </label>
              <input
                type="text"
                id="file-name"
                name="name"
                value={newFile.name}
                onChange={handleFileChange}
                className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                placeholder="e.g., My_Document.pdf"
              />
            </div>
            <div>
              <label htmlFor="file-tags" className="block text-sm text-gray-400 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="file-tags"
                name="tags"
                value={newFile.tags}
                onChange={handleFileChange}
                className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                placeholder="e.g., Taxes, Finance"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Upload
          </button>
        </form>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
          placeholder="Search by name or tag..."
        />
      </div>

      {/* File List */}
      <div className="bg-slate-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Files</h3>
        {filteredFiles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="p-3">Name</th>
                  <th className="p-3">Tags</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="border-b border-slate-600">
                    <td className="p-3">{file.name}</td>
                    <td className="p-3">
                      {file.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block bg-purple-500 text-white text-xs px-2 py-1 rounded-full mr-2"
                        >
                          {tag}
                        </span>
                      ))}
                    </td>
                    <td className="p-3 flex space-x-2">
                      <button
                        onClick={() => handleDownload(file)}
                        className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400">No files found.</p>
        )}
      </div>
    </div>
  );
}

export default DocumentVault;