import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Community({ user, socket }) {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchPosts();

    socket.on('post_created', (data) => {
      fetchPosts();
    });

    return () => socket.off('post_created');
  }, [socket]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/community');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/community',
        { userId: user.id, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      socket.emit('new_post', { userId: user.id, content });
      setContent('');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="container">
      <h2>Community</h2>
      
      <div className="card">
        <h3>Share Your Thoughts</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="What's on your mind about REITs?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4"
            required
          />
          <button type="submit" className="btn btn-primary">
            Post
          </button>
        </form>
      </div>

      <div style={{ marginTop: '20px' }}>
        {posts.map((post) => (
          <div key={post.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <strong>{post.username}</strong>
              <span style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
                {new Date(post.created_at).toLocaleString()}
              </span>
            </div>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Community;
