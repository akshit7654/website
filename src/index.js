const express = require('express');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');

const app = express();
app.use(express.json());

const file = path.join(__dirname, '../data/db.json');
const adapter = new JSONFile(file);
const defaultData = { users: [], posts: [], comments: [], categories: [], tags: [] };
const db = new Low(adapter, defaultData);

async function initDB() {
  await db.read();
  
}

function auth(role) {
  return async (req, res, next) => {
    const token = req.headers['x-auth-token'];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    const user = db.data.users.find(u => u.token === token);
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    if (role && user.role !== role && user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.user = user;
    next();
  };
}

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
  await initDB();
  if (db.data.users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'User exists' });
  }
  const hash = await bcrypt.hash(password, 10);
  const token = uuidv4();
  db.data.users.push({ id: uuidv4(), username, password: hash, role: role || 'reader', token });
  await db.write();
  res.json({ token });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  await initDB();
  const user = db.data.users.find(u => u.username === username);
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: 'Invalid credentials' });
  if (!user.token) user.token = uuidv4();
  await db.write();
  res.json({ token: user.token });
});

app.get('/posts', async (req, res) => {
  await initDB();
  res.json(db.data.posts);
});

app.post('/posts', auth('author'), async (req, res) => {
  const { title, content, categories, tags } = req.body;
  await initDB();
  const post = { id: uuidv4(), authorId: req.user.id, title, content, categories: categories || [], tags: tags || [], created: new Date() };
  db.data.posts.push(post);
  await db.write();
  res.json(post);
});

app.put('/posts/:id', auth('author'), async (req, res) => {
  const { id } = req.params;
  await initDB();
  const post = db.data.posts.find(p => p.id === id);
  if (!post) return res.status(404).json({ error: 'Not found' });
  if (post.authorId !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'editor') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  Object.assign(post, req.body);
  await db.write();
  res.json(post);
});

app.delete('/posts/:id', auth('author'), async (req, res) => {
  const { id } = req.params;
  await initDB();
  const idx = db.data.posts.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const post = db.data.posts[idx];
  if (post.authorId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  db.data.posts.splice(idx, 1);
  await db.write();
  res.json({ success: true });
});

app.get('/posts/:id/comments', async (req, res) => {
  await initDB();
  const comments = db.data.comments.filter(c => c.postId === req.params.id);
  res.json(comments);
});

app.post('/posts/:id/comments', auth(), async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  await initDB();
  const comment = { id: uuidv4(), postId: id, userId: req.user.id, content, created: new Date() };
  db.data.comments.push(comment);
  await db.write();
  res.json(comment);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
