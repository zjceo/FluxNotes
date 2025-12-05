import express from 'express';
import cors from 'cors';
import { initDb, checkConnection } from './db';
import { router } from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Database
initDb();

// Routes
app.use('/api', router);

// Health check endpoint with database status
app.get('/', async (req, res) => {
    const dbStatus = await checkConnection();
    
    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FluxNotes API - Status</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            padding: 40px;
            max-width: 600px;
            width: 100%;
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 28px;
        }
        .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 14px;
        }
        .status-card {
            background: ${dbStatus.connected ? '#f0fdf4' : '#fef2f2'};
            border: 2px solid ${dbStatus.connected ? '#86efac' : '#fca5a5'};
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .status-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
        }
        .status-indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: ${dbStatus.connected ? '#22c55e' : '#ef4444'};
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        .status-text {
            font-weight: 600;
            font-size: 18px;
            color: ${dbStatus.connected ? '#166534' : '#991b1b'};
        }
        .info-grid {
            display: grid;
            gap: 12px;
            margin-top: 15px;
        }
        .info-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid ${dbStatus.connected ? '#d1fae5' : '#fee2e2'};
        }
        .info-label {
            font-weight: 500;
            color: #666;
        }
        .info-value {
            color: #333;
            font-family: 'Courier New', monospace;
        }
        .error-message {
            background: #fee2e2;
            border-left: 4px solid #ef4444;
            padding: 12px;
            border-radius: 6px;
            margin-top: 15px;
            color: #991b1b;
            font-size: 14px;
        }
        .endpoints {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }
        .endpoints h3 {
            color: #333;
            margin-bottom: 15px;
            font-size: 18px;
        }
        .endpoint-list {
            list-style: none;
        }
        .endpoint-list li {
            padding: 8px 0;
            color: #666;
            font-family: 'Courier New', monospace;
            font-size: 13px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 FluxNotes API</h1>
        <p class="subtitle">Servidor corriendo en el puerto ${PORT}</p>
        
        <div class="status-card">
            <div class="status-header">
                <div class="status-indicator"></div>
                <div class="status-text">
                    ${dbStatus.connected ? '✅ Conexión exitosa' : '❌ Error de conexión'}
                </div>
            </div>
            
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Base de datos:</span>
                    <span class="info-value">${dbStatus.database || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Host:</span>
                    <span class="info-value">${dbStatus.host || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Puerto:</span>
                    <span class="info-value">${dbStatus.port || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Usuario:</span>
                    <span class="info-value">${dbStatus.user || 'N/A'}</span>
                </div>
                ${dbStatus.connected ? `
                <div class="info-item">
                    <span class="info-label">Versión PostgreSQL:</span>
                    <span class="info-value">${dbStatus.version || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Hora del servidor:</span>
                    <span class="info-value">${new Date(dbStatus.timestamp).toLocaleString('es-ES')}</span>
                </div>
                ` : ''}
            </div>
            
            ${!dbStatus.connected && dbStatus.error ? `
            <div class="error-message">
                <strong>Error:</strong> ${dbStatus.error}
            </div>
            ` : ''}
        </div>
        
        <div class="endpoints">
            <h3>📡 Endpoints disponibles:</h3>
            <ul class="endpoint-list">
                <li>GET /api/notes - Obtener todas las notas</li>
                <li>GET /api/notes/:id - Obtener una nota</li>
                <li>POST /api/notes - Crear una nota</li>
                <li>PUT /api/notes/:id - Actualizar una nota</li>
                <li>DELETE /api/notes/:id - Eliminar una nota</li>
            </ul>
        </div>
    </div>
</body>
</html>
    `;
    
    res.send(html);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Visit http://localhost:${PORT} to check database connection status`);
});
