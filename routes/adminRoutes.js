const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const { getAllNotes, deleteAnyNote } = require('../controllers/adminController');

router.get('/notes', authMiddleware, adminMiddleware, getAllNotes);
router.delete('/notes/:id', authMiddleware, adminMiddleware, deleteAnyNote);

module.exports = router;