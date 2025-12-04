import express from 'express';
import cors from 'cors';
import { initDb } from './db';
import { router } from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Database
initDb();

// Routes
app.use('/api', router);

app.get('/', (req, res) => {
    res.send('FluxNotes API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
