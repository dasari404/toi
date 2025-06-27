const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let posts = [];
let id = 1;

app.post('/api/posts', (req, res) => {
  const { title, content } = req.body;
  const post = { id: id++, title, content, upvotes: 0, comments: [] };
  posts.push(post);
  res.json(post);
});

app.get('/api/posts', (req, res) => {
  res.json(posts);
});

app.get('/api/posts/:id', (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  res.json(post);
});

app.post('/api/posts/:id/comments', (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  const { content } = req.body;
  post.comments.push({ content });
  res.json(post);
});

app.post('/api/posts/:id/upvote', (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  post.upvotes++;
  res.json(post);
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
