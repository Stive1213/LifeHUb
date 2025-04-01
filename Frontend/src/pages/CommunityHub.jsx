import { useState, useEffect } from 'react';
import axios from 'axios';

function CommunityHub() {
  const [communities, setCommunities] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [subscribedCommunities, setSubscribedCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'Tips', media: '' });
  const [newComment, setNewComment] = useState({});
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const isAdmin = localStorage.getItem('userId') === '1';
  const categories = selectedCommunity === '2' ? ['All', 'Hiring', 'For Hire'] : ['All', 'Tips', 'Finance', 'Productivity', 'Health', 'Other'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to access Community Hub');
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      axios.get('http://localhost:5000/api/communities', { headers }),
      axios.get('http://localhost:5000/api/subscriptions', { headers }),
    ])
      .then(([communitiesRes, subscriptionsRes]) => {
        setCommunities(communitiesRes.data);
        setSubscribedCommunities(subscriptionsRes.data.map(sub => sub.id));
      })
      .catch((err) => {
        console.error('Fetch error:', err.response?.data);
        setError(err.response?.data?.error || 'Error fetching data');
      });

    if (selectedCommunity) {
      fetchPosts(selectedCommunity);
    }
  }, [selectedCommunity]);

  const fetchPosts = async (communityId) => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const postsRes = await axios.get(`http://localhost:5000/api/posts?community_id=${communityId}`, { headers });
      const postsWithComments = await Promise.all(postsRes.data.map(async (post) => {
        const commentsRes = await axios.get(`http://localhost:5000/api/comments?post_id=${post.id}`, { headers });
        return { ...post, comments: commentsRes.data };
      }));
      setPosts(postsWithComments);
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching posts');
    }
  };

  const handleSelectCommunity = (communityId) => {
    setSelectedCommunity(communityId);
    setNewPost({ title: '', content: '', category: communityId === '2' ? 'Hiring' : 'Tips', media: '' });
    setFilterCategory('All');
    fetchPosts(communityId);
  };

  const handleSubscribe = async (communityId) => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    try {
      if (subscribedCommunities.includes(communityId)) {
        await axios.delete('http://localhost:5000/api/subscriptions', { data: { community_id: communityId }, headers });
        setSubscribedCommunities(subscribedCommunities.filter(id => id !== communityId));
        setCommunities(communities.map(c => c.id === communityId ? { ...c, subscribers: c.subscribers - 1, isSubscribed: false } : c));
        if (selectedCommunity === communityId) setSelectedCommunity(null);
      } else {
        await axios.post('http://localhost:5000/api/subscriptions', { community_id: communityId }, { headers });
        setSubscribedCommunities([...subscribedCommunities, communityId]);
        setCommunities(communities.map(c => c.id === communityId ? { ...c, subscribers: c.subscribers + 1, isSubscribed: true } : c));
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating subscription');
    }
  };

  const handlePostChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault(); // This prevents the default form submission
    if (!newPost.title || !newPost.content || !selectedCommunity) {
      setError('Please fill in all required fields');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to post');
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };
    try {
      const res = await axios.post('http://localhost:5000/api/posts', {
        community_id: selectedCommunity,
        title: newPost.title,
        content: newPost.content,
        category: newPost.category,
        media: newPost.media,
      }, { headers });
      setPosts([res.data, ...posts]);
      setNewPost({ title: '', content: '', category: selectedCommunity === '2' ? 'Hiring' : 'Tips', media: '' });
      setError(''); // Clear any previous errors on success
    } catch (err) {
      console.error('Post submission error:', err.response?.data);
      setError(err.response?.data?.error || 'Error creating post');
    }
  };

  const handleVote = async (postId, type) => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    try {
      await axios.post('http://localhost:5000/api/posts/vote', { post_id: postId, type }, { headers });
      setPosts(posts.map(post =>
        post.id === postId ? { ...post, [type + 's']: post[type + 's'] + 1 } : post
      ));
    } catch (err) {
      setError(err.response?.data?.error || 'Error voting');
    }
  };

  const handleFlag = async (postId) => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    try {
      await axios.post('http://localhost:5000/api/posts/flag', { post_id: postId }, { headers });
      setPosts(posts.map(post => post.id === postId ? { ...post, flagged: 1 } : post));
    } catch (err) {
      setError(err.response?.data?.error || 'Error flagging post');
    }
  };

  const handleAddComment = async (postId) => {
    if (!newComment[postId]) return;
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const res = await axios.post('http://localhost:5000/api/comments', { post_id: postId, content: newComment[postId] }, { headers });
      setPosts(posts.map(post =>
        post.id === postId ? { ...post, comments: [...post.comments, res.data] } : post
      ));
      setNewComment({ ...newComment, [postId]: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Error adding comment');
    }
  };

  const filteredCommunities = communities.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topCommunities = [...communities]
    .sort((a, b) => b.subscribers - a.subscribers)
    .slice(0, 3);

  const filteredPosts = posts
    .filter(post => selectedCommunity && post.community_id === selectedCommunity)
    .filter(post => filterCategory === 'All' || post.category === filterCategory);

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'Popular') return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <div className="text-white flex space-x-6">
      <div className="w-80 bg-slate-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Communities</h3>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
            placeholder="Search communities..."
          />
        </div>
        <div className="max-h-48 overflow-y-auto mb-4">
          {filteredCommunities.length > 0 ? (
            <ul className="space-y-4">
              {filteredCommunities.map(community => (
                <li key={community.id} className="bg-slate-700 p-4 rounded-lg">
                  <div
                    onClick={() => handleSelectCommunity(community.id)}
                    className={`cursor-pointer p-2 rounded-lg ${selectedCommunity === community.id ? 'bg-purple-500' : 'hover:bg-slate-600'}`}
                  >
                    <p className="font-bold">{community.name}</p>
                    <p className="text-sm text-gray-400">{community.description}</p>
                    <p className="text-sm text-gray-400">{community.subscribers} subscribers</p>
                  </div>
                  <button
                    onClick={() => handleSubscribe(community.id)}
                    className={`mt-2 w-full py-2 rounded-lg ${community.isSubscribed ? 'bg-red-500 hover:bg-red-600' : 'bg-purple-500 hover:bg-purple-600'} transition-colors`}
                  >
                    {community.isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No communities found.</p>
          )}
        </div>
        <h4 className="text-lg font-bold mb-2">Top Communities</h4>
        <div className="max-h-48 overflow-y-auto">
          {topCommunities.length > 0 ? (
            <ul className="space-y-2">
              {topCommunities.map(community => (
                <li key={community.id} className="bg-slate-700 p-2 rounded-lg">
                  <p className="font-bold">{community.name}</p>
                  <p className="text-sm text-gray-400">{community.subscribers} subscribers</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No top communities available.</p>
          )}
        </div>
      </div>

      <div className="flex-1">
        {selectedCommunity ? (
          <>
            <div className="bg-slate-800 p-6 rounded-lg shadow mb-6">
              <h3 className="text-xl font-bold mb-4">
                Create a Post in {communities.find(c => c.id === selectedCommunity)?.name}
              </h3>
              <form onSubmit={handleSubmitPost}>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm text-gray-400 mb-2">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newPost.title}
                    onChange={handlePostChange}
                    className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                    placeholder="Enter post title"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="content" className="block text-sm text-gray-400 mb-2">Content</label>
                  <textarea
                    id="content"
                    name="content"
                    value={newPost.content}
                    onChange={handlePostChange}
                    className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                    rows="4"
                    placeholder="Write your post..."
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="category" className="block text-sm text-gray-400 mb-2">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={newPost.category}
                    onChange={handlePostChange}
                    className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                  >
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="media" className="block text-sm text-gray-400 mb-2">Media URL (Optional)</label>
                  <input
                    type="text"
                    id="media"
                    name="media"
                    value={newPost.media}
                    onChange={handlePostChange}
                    className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                    placeholder="e.g., https://example.com/image.jpg"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Submit
                </button>
              </form>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4">Post Feed</h3>
              <div className="flex space-x-4 mb-4">
                <div>
                  <label htmlFor="filter-category" className="block text-sm text-gray-400 mb-2">Filter by Category</label>
                  <select
                    id="filter-category"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="sort-by" className="block text-sm text-gray-400 mb-2">Sort By</label>
                  <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Recent">Recent</option>
                    <option value="Popular">Popular</option>
                  </select>
                </div>
              </div>

              {sortedPosts.length > 0 ? (
                <ul className="space-y-6">
                  {sortedPosts.map(post => (
                    <li key={post.id} className="bg-slate-700 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-lg">{post.title}</p>
                          <p className="text-sm text-gray-400">
                            Posted by {post.author} in {communities.find(c => c.id === post.community_id)?.name} on{' '}
                            {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                          <p className="text-sm text-purple-400">Category: {post.category}</p>
                          <p className="mt-2">{post.content}</p>
                          {post.media && (
                            <img
                              src={post.media}
                              alt="Post media"
                              className="mt-2 max-w-xs rounded-lg"
                              onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                            />
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleVote(post.id, 'upvote')}
                            className="text-green-400 hover:text-green-500"
                          >
                            ▲ {post.upvotes}
                          </button>
                          <button
                            onClick={() => handleVote(post.id, 'downvote')}
                            className="text-red-400 hover:text-red-500"
                          >
                            ▼ {post.downvotes}
                          </button>
                          <button
                            onClick={() => handleFlag(post.id)}
                            className={`text-yellow-400 hover:text-yellow-500 ${post.flagged ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={post.flagged}
                          >
                            ⚑ {post.flagged ? 'Flagged' : 'Flag'}
                          </button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <h4 className="text-sm font-bold mb-2">Comments</h4>
                        {post.comments.length > 0 ? (
                          <ul className="space-y-2">
                            {post.comments.map(comment => (
                              <li key={comment.id} className="bg-slate-600 p-2 rounded-lg">
                                <p className="text-sm text-gray-400">
                                  {comment.author} • {new Date(comment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </p>
                                <p>{comment.content}</p>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-400 text-sm">No comments yet.</p>
                        )}
                        <div className="mt-2 flex space-x-2">
                          <input
                            type="text"
                            value={newComment[post.id] || ''}
                            onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                            className="flex-1 p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                            placeholder="Add a comment..."
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                          >
                            Comment
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No posts available in this community.</p>
              )}
            </div>
          </>
        ) : (
          <div className="bg-slate-800 p-6 rounded-lg shadow">
            <p className="text-gray-400">Select a community to view posts and create new ones.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommunityHub;