const db = require('../config/database');

// CREATE a note
const createNote = (req, res) => {
  const { title, content } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const result = db.prepare(
    'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)'
  ).run(req.user.id, title, content || '');

  res.status(201).json({ message: 'Note created successfully', noteId: result.lastInsertRowid });
};

// GET all notes for logged in user (with search and pagination)
const getNotes = (req, res) => {
  const { search, page = 1, limit = 5 } = req.query;
  const offset = (page - 1) * limit;

  let query = 'SELECT * FROM notes WHERE user_id = ?';
  let countQuery = 'SELECT COUNT(*) as total FROM notes WHERE user_id = ?';
  const params = [req.user.id];

  if (search) {
    query += ' AND title LIKE ?';
    countQuery += ' AND title LIKE ?';
    params.push(`%${search}%`);
  }

  query += ' LIMIT ? OFFSET ?';
  const notes = db.prepare(query).all(...params, parseInt(limit), parseInt(offset));
  const total = db.prepare(countQuery).get(...params).total;

  res.json({
    notes,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    }
  });
};

// GET a single note
const getNote = (req, res) => {
  const note = db.prepare(
    'SELECT * FROM notes WHERE id = ? AND user_id = ?'
  ).get(req.params.id, req.user.id);

  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }

  res.json(note);
};

// UPDATE a note
const updateNote = (req, res) => {
  const { title, content } = req.body;

  const note = db.prepare(
    'SELECT * FROM notes WHERE id = ? AND user_id = ?'
  ).get(req.params.id, req.user.id);

  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }

  db.prepare(
    'UPDATE notes SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  ).run(title || note.title, content || note.content, req.params.id);

  res.json({ message: 'Note updated successfully' });
};

// DELETE a note
const deleteNote = (req, res) => {
  const note = db.prepare(
    'SELECT * FROM notes WHERE id = ? AND user_id = ?'
  ).get(req.params.id, req.user.id);

  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }

  db.prepare('DELETE FROM notes WHERE id = ?').run(req.params.id);

  res.json({ message: 'Note deleted successfully' });
};

module.exports = { createNote, getNotes, getNote, updateNote, deleteNote };