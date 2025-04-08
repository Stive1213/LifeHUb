const { db } = require('../config/db');

const getPosts = (req, res) => {
  const { community_id } = req.query;
  if (!community_id) return res.status(400).json({ error: 'Community ID is required' });

  db.all(`
    SELECT p.*, u.email as author 
    FROM posts p 
    JOIN users u ON p.user_id = u.id 
    WHERE p.community_id = ?
  `, [community_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

const createPost = (req, res) => {
  const { community_id, title, content, category, media } = req.body;
  if (!community_id || !title || !content || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.get('SELECT admin_only_post, created_by FROM communities WHERE id = ?', [community_id], (err, community) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!community) return res.status(404).json({ error: 'Community not found' });

    if (community.admin_only_post && req.user.id !== community.created_by) {
      return res.status(403).json({ error: 'Only admins can post in this community' });
    }

    const insertPost = () => {
      db.run(
        'INSERT INTO posts (user_id, community_id, title, content, category, media) VALUES (?, ?, ?, ?, ?, ?)',
        [req.user.id, community_id, title, content, category, media || ''],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });
          db.run('UPDATE user_points SET points = points + 10 WHERE user_id = ?', [req.user.id]); // 10 points for posting
          res.status(201).json({
            id: this.lastID,
            user_id: req.user.id,
            community_id,
            title,
            content,
            category,
            media: media || '',
            date: new Date().toISOString(),
            upvotes: 0,
            downvotes: 0,
            flagged: 0,
            author: req.user.email,
          });
        }
      );
    };

    if (!community.admin_only_post) {
      db.get('SELECT id FROM subscriptions WHERE user_id = ? AND community_id = ?', [req.user.id, community_id], (err, subscription) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!subscription) return res.status(403).json({ error: 'You must be subscribed to post in this community' });
        insertPost();
      });
    } else {
      insertPost();
    }
  });
};

const votePost = (req, res) => {
  const { post_id, type } = req.body;
  const field = type === 'upvote' ? 'upvotes' : 'downvotes';
  db.run(
    `UPDATE posts SET ${field} = ${field} + 1 WHERE id = ?`,
    [post_id],
    function (err) {
      if (err || this.changes === 0) return res.status(404).json({ error: 'Post not found' });
      db.run('UPDATE user_points SET points = points + 2 WHERE user_id = ?', [req.user.id]); // 2 points for voting
      res.json({ message: 'Vote recorded' });
    }
  );
};

const flagPost = (req, res) => {
  const { post_id } = req.body;
  db.run(
    'UPDATE posts SET flagged = 1 WHERE id = ?',
    [post_id],
    function (err) {
      if (err || this.changes === 0) return res.status(404).json({ error: 'Post not found' });
      res.json({ message: 'Post flagged' });
    }
  );
};

module.exports = { getPosts, createPost, votePost, flagPost };