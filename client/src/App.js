// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

const API = 'https://toi-3.onrender.com/api/posts';

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [comments, setComments] = useState({});
  const [commented, setCommented] = useState({}); // Track if commented

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    });
    const data = await res.json();
    setPosts([data, ...posts]);
    setNewPost({ title: '', content: '' });
  };

  const upvote = async (id) => {
    const res = await fetch(`${API}/${id}/upvote`, { method: 'POST' });
    const updated = await res.json();
    setPosts(posts.map(p => (p.id === id ? updated : p)));
  };

  const handleComment = async (id) => {
    if (commented[id]) return; // Already commented
    const res = await fetch(`${API}/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: comments[id] || '' })
    });
    const updated = await res.json();
    setPosts(posts.map(p => (p.id === id ? updated : p)));
    setComments({ ...comments, [id]: '' });
    setCommented({ ...commented, [id]: true });
  };

  return (
    <div className="App">
      <header>
        <h1>🧠 TOI — Talk Of Internet</h1>
      </header>

      <section className="form-section">
        <form onSubmit={handlePost}>
          <input
            type="text"
            placeholder="Post title"
            value={newPost.title}
            onChange={e => setNewPost({ ...newPost, title: e.target.value })}
            required
          />
          <textarea
            placeholder="What do you want to say?"
            value={newPost.content}
            onChange={e => setNewPost({ ...newPost, content: e.target.value })}
            required
          />
          <button type="submit">🚀 Post</button>
        </form>
      </section>

      <section className="post-list">
        {posts.length === 0 ? (
          <p className="empty-state">No posts yet. Be the first to say something!</p>
        ) : (
          posts.map(post => (
            <div className="post-card" key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <button onClick={() => upvote(post.id)}>⬆️ {post.upvotes}</button>

              <div className="comments">
                <h4>💬 Comments</h4>
                {post.comments.map((c, idx) => (
                  <div key={idx} className="comment">{c.content}</div>
                ))}
                {!commented[post.id] ? (
                  <>
                    <input
                      type="text"
                      placeholder="Add a comment"
                      value={comments[post.id] || ''}
                      onChange={e => setComments({ ...comments, [post.id]: e.target.value })}
                    />
                    <button onClick={() => handleComment(post.id)}>Comment</button>
                  </>
                ) : (
                  <p className="one-comment-note">🛑 You've already commented.</p>
                )}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default App;
