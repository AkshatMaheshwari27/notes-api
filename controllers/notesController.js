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

// GET all notes for logged in user
const getNotes = (req, res) => {
  const notes = db.prepare(
    'SELECT * FROM notes WHERE user_id = ?'
  ).all(req.user.id);

  res.json(notes);
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