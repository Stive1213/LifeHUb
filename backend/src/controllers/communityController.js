const { db } = require('../config/db');

const getCommunities = (req, res) => {
  db.all(`
    SELECT c.*, 
           (SELECT COUNT(*) FROM subscriptions s WHERE s.community_id = c.id) as subscriber_count,
           EXISTS(SELECT 1 FROM subscriptions s WHERE s.community_id = c.id AND s.user_id = ?) as is_subscribed
    FROM communities c
    GROUP BY c.id, c.name, c.description, c.admin_only_post, c.created_by
  `, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(row => ({
      ...row,
      subscribers: row.subscriber_count,
      isSubscribed: !!row.is_subscribed,
    })));
  });
};

module.exports = { getCommunities };