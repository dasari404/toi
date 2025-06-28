import React, { useState, useEffect } from 'react';
import './App.css';

const API = 'https://toi-3.onrender.com/api/posts';

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });

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
    setPosts([...posts, data]);
    setNewPost({ title: '', content: '' });
  };

  const upvote = (id) => {
    setPosts(posts.map(p => p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p));
  };

  return (
    <div className="App">
      <h1>🧠 TOI - Talk Of Internet</h1>

      <form onSubmit={handlePost}>
        <input
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={e => setNewPost({ ...newPost, title: e.target.value })}
          required
        />
        <textarea
          placeholder="What's on your mind?"
          value={newPost.content}
          onChange={e => setNewPost({ ...newPost, content: e.target.value })}
          required
        />
        <button type="submit">Post</button>
      </form>

      <hr />

      <ul>
        {posts.map(post => (
          <li key={post.id} className="post">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <button onClick={() => upvote(post.id)}>⬆️ {post.upvotes}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
