import { Router } from 'express';
import { query } from './db';

export const router = Router();

// --- NOTES ---

// Get all notes
router.get('/notes', async (req, res) => {
    try {
        const result = await query('SELECT * FROM notes ORDER BY updated_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

// Get single note
router.get('/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('SELECT * FROM notes WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch note' });
    }
});

// Create note
router.post('/notes', async (req, res) => {
    try {
        const { title, content } = req.body;
        const result = await query(
            'INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *',
            [title, content]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create note' });
    }
});

// Update note
router.put('/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, is_favorite } = req.body;

        // Dynamic update query
        let updateFields = [];
        let values = [];
        let idx = 1;

        if (title !== undefined) {
            updateFields.push(`title = $${idx++}`);
            values.push(title);
        }
        if (content !== undefined) {
            updateFields.push(`content = $${idx++}`);
            values.push(content);
        }
        if (is_favorite !== undefined) {
            updateFields.push(`is_favorite = $${idx++}`);
            values.push(is_favorite);
        }

        updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const result = await query(
            `UPDATE notes SET ${updateFields.join(', ')} WHERE id = $${idx} RETURNING *`,
            values
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update note' });
    }
});

// Delete note
router.delete('/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM notes WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json({ message: 'Note deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete note' });
    }
});
