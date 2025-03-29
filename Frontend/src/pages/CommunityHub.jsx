import { useState } from 'react';

function CommunityHub() {
  // Mock data for communities
  const [communities, setCommunities] = useState([
    { id: '1', name: 'LifeHub Tips', description: 'Tips and tricks for using LifeHub.' },
    { id: '2', name: 'Productivity Hacks', description: 'Share your best productivity tips!' },
  ]);

  // State for subscribed communities
  const [subscribedCommunities, setSubscribedCommunities] = useState(['1']); // Initially subscribed to "LifeHub Tips"

  // Mock data for posts
  const [posts, setPosts] = useState([
    {
      id: '1',
      communityId: '1',
      title: 'How to Use the Calendar Effectively',
      content: 'Here are some tips for organizing your events...',
      category: 'Tips',
      media: 'https://example.com/image.jpg',
      author: 'Admin',
      date: '2025-03-29T10:00:00Z',
      upvotes: 5,
      downvotes: 1,
      comments: [
        { id: 'c1', author: 'User2', content: 'Great tips!', date: '2025-03-29T10:05:00Z' },
      ],
      flagged: false,
    },
    {
      id: '2',
      communityId: '1',
      title: 'Best Practices for Budget Tracking',
      content: 'I found these strategies really helpful...',
      category: 'Finance',
      media: null,
      author: 'Admin',
      date: '2025-03-28T15:00:00Z',
      upvotes: 3,
      downvotes: 0,
      comments: [],
      flagged: false,
    },
  ]);

  // State for selected community
  const [selectedCommunity, setSelectedCommunity] = useState(null);

  // State for new post form
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'Tips',
    media: '',
  });

  // State for filters
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Recent'); // Options: Recent, Popular

  // State for comments
  const [newComment, setNewComment] = useState({});

  // Mock admin status (set to false to simulate a regular user; change to true to test admin privileges)
  const isAdmin = false;

  // Predefined categories
  const categories = ['All', 'Tips', 'Finance', 'Productivity', 'Health', 'Other'];

  // Handle community selection
  const handleSelectCommunity = (communityId) => {
    setSelectedCommunity(communityId);
    setNewPost({ ...newPost, title: '', content: '', category: 'Tips', media: '' }); // Reset form when switching communities
  };

  // Handle community subscription
  const handleSubscribe = (communityId) => {
    if (subscribedCommunities.includes(communityId)) {
      setSubscribedCommunities(subscribedCommunities.filter((id) => id !== communityId));
      if (selectedCommunity === communityId) {
        setSelectedCommunity(null); // Deselect the community if unsubscribed
      }
      console.log(`Unsubscribed from community: ${communityId}`);
    } else {
      setSubscribedCommunities([...subscribedCommunities, communityId]);
      console.log(`Subscribed to community: ${communityId}`);
    }
  };

  // Handle new post form input changes
  const handlePostChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  // Handle post submission
  const handleSubmitPost = (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content || !selectedCommunity) return;

    // Check if the selected community is "LifeHub Tips" (id: '1') and the user is not an admin
    if (selectedCommunity === '1' && !isAdmin) {
      alert('Only admins can post in LifeHub Tips.');
      return;
    }

    const post = {
      id: Date.now().toString(),
      communityId: selectedCommunity,
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      media: newPost.media || null,
      author: isAdmin ? 'Admin' : 'You',
      date: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      comments: [],
      flagged: false,
    };
    console.log('Post created:', post);
    setPosts([post, ...posts]);
    setNewPost({
      title: '',
      content: '',
      category: 'Tips',
      media: '',
    });
  };

  // Handle upvote/downvote
  const handleVote = (postId, type) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            upvotes: type === 'upvote' ? post.upvotes + 1 : post.upvotes,
            downvotes: type === 'downvote' ? post.downvotes + 1 : post.downvotes,
          };
        }
        return post;
      })
    );
  };

  // Handle flagging a post
  const handleFlag = (postId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          console.log(`Post flagged: ${postId}`);
          return { ...post, flagged: true };
        }
        return post;
      })
    );
  };

  // Handle adding a comment
  const handleAddComment = (postId) => {
    if (!newComment[postId]) return;
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const comment = {
            id: Date.now().toString(),
            author: 'You',
            content: newComment[postId],
            date: new Date().toISOString(),
          };
          console.log('Comment added:', comment);
          return { ...post, comments: [...post.comments, comment] };
        }
        return post;
      })
    );
    setNewComment({ ...newComment, [postId]: '' });
  };

  // Filter and sort posts
  const filteredPosts = posts
    .filter((post) => selectedCommunity && post.communityId === selectedCommunity) // Only show posts from the selected community
    .filter((post) => filterCategory === 'All' || post.category === filterCategory); // Filter by category

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'Popular') {
      const scoreA = a.upvotes - a.downvotes;
      const scoreB = b.upvotes - b.downvotes;
      return scoreB - scoreA; // Sort by net upvotes (descending)
    }
    return new Date(b.date) - new Date(a.date); // Sort by date (newest first)
  });

  return (
    <div className="text-white flex space-x-6">
      {/* Community Selection */}
      <div className="w-80 bg-slate-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Communities</h3>
        <div className="max-h-96 overflow-y-auto">
          {communities.length > 0 ? (
            <ul className="space-y-4">
              {communities.map((community) => (
                <li key={community.id} className="bg-slate-700 p-4 rounded-lg">
                  <div
                    onClick={() => handleSelectCommunity(community.id)}
                    className={`cursor-pointer p-2 rounded-lg ${
                      selectedCommunity === community.id ? 'bg-purple-500' : 'hover:bg-slate-600'
                    }`}
                  >
                    <p className="font-bold">{community.name}</p>
                    <p className="text-sm text-gray-400">{community.description}</p>
                  </div>
                  {subscribedCommunities.includes(community.id) ? (
                    <button
                      onClick={() => handleSubscribe(community.id)}
                      className="mt-2 w-full py-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors"
                    >
                      Unsubscribe
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(community.id)}
                      className="mt-2 w-full py-2 rounded-lg bg-purple-500 hover:bg-purple-600 transition-colors"
                    >
                      Subscribe
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No communities available.</p>
          )}
        </div>
      </div>

      {/* Post Creation and Post Feed */}
      <div className="flex-1">
        {selectedCommunity ? (
          <>
            {/* Post Creation */}
            <div className="bg-slate-800 p-6 rounded-lg shadow mb-6">
              <h3 className="text-xl font-bold mb-4">
                Create a Post in {communities.find((c) => c.id === selectedCommunity)?.name}
              </h3>
              <form onSubmit={handleSubmitPost}>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm text-gray-400 mb-2">
                    Title
                  </label>
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
                  <label htmlFor="content" className="block text-sm text-gray-400 mb-2">
                    Content
                  </label>
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
                  <label htmlFor="category" className="block text-sm text-gray-400 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={newPost.category}
                    onChange={handlePostChange}
                    className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                  >
                    {categories.slice(1).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="media" className="block text-sm text-gray-400 mb-2">
                    Media URL (Optional)
                  </label>
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

            {/* Post Feed */}
            <div className="bg-slate-800 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4">Post Feed</h3>
              {/* Filters */}
              <div className="flex space-x-4 mb-4">
                <div>
                  <label htmlFor="filter-category" className="block text-sm text-gray-400 mb-2">
                    Filter by Category
                  </label>
                  <select
                    id="filter-category"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="sort-by" className="block text-sm text-gray-400 mb-2">
                    Sort By
                  </label>
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

              {/* Posts */}
              {sortedPosts.length > 0 ? (
                <ul className="space-y-6">
                  {sortedPosts.map((post) => (
                    <li key={post.id} className="bg-slate-700 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-lg">{post.title}</p>
                          <p className="text-sm text-gray-400">
                            Posted by {post.author} in{' '}
                            {communities.find((c) => c.id === post.communityId)?.name} on{' '}
                            {new Date(post.date).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
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
                            className={`text-yellow-400 hover:text-yellow-500 ${
                              post.flagged ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={post.flagged}
                          >
                            ⚑ {post.flagged ? 'Flagged' : 'Flag'}
                          </button>
                        </div>
                      </div>
                      {/* Comments Section */}
                      <div className="mt-4">
                        <h4 className="text-sm font-bold mb-2">Comments</h4>
                        {post.comments.length > 0 ? (
                          <ul className="space-y-2">
                            {post.comments.map((comment) => (
                              <li key={comment.id} className="bg-slate-600 p-2 rounded-lg">
                                <p className="text-sm text-gray-400">
                                  {comment.author} •{' '}
                                  {new Date(comment.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
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
                            onChange={(e) =>
                              setNewComment({ ...newComment, [post.id]: e.target.value })
                            }
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