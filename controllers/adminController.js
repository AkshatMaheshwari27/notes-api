const db = require('../config/database');

// GET all notes (admin only)
const getAllNotes = (req, res) => {
  const notes = db.prepare(
    'SELECT notes.*, users.username, users.email FROM notes JOIN users ON notes.user_id = users.id'
  ).all();

  res.json(notes);
};

// DELETE any note (admin only)
const deleteAnyNote = (req, res) => {
  const note = db.prepare(
    'SELECT * FROM notes WHERE id = ?'
  ).get(req.params.id);

  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }

  db.prepare('DELETE FROM notes WHERE id = ?').run(req.params.id);

  res.json({ message: 'Note deleted by admin successfully' });
};

module.exports = { getAllNotes, deleteAnyNote };