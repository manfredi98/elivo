const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

// Database configuration
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'elivo_contacts',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

// Initialize database
async function initializeDatabase() {
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS contacts (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                apellido VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL,
                telefono VARCHAR(20) NOT NULL,
                empresa VARCHAR(255),
                tipo_servicio VARCHAR(50) NOT NULL,
                ubicacion VARCHAR(255) NOT NULL,
                presupuesto_estimado VARCHAR(50),
                fecha_preferida DATE,
                mensaje TEXT NOT NULL,
                acepto_terminos BOOLEAN NOT NULL,
                newsletter BOOLEAN DEFAULT FALSE,
                ip_address INET,
                status VARCHAR(20) DEFAULT 'nuevo',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        await pool.query(createTableQuery);
        console.log('✅ PostgreSQL database initialized successfully');
    } catch (error) {
        console.error('❌ Database initialization error:', error);
    }
}

// Initialize database on startup
initializeDatabase();

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'test.html'));
});

app.get('/contacto', (req, res) => {
    res.sendFile(path.join(__dirname, 'contacto.html'));
});

app.get('/nosotros', (req, res) => {
    res.sendFile(path.join(__dirname, 'nosotros.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// API Routes
app.post('/api/contact', async (req, res) => {
    const {
        nombre,
        apellido,
        email,
        telefono,
        empresa,
        tipo_servicio,
        ubicacion,
        presupuesto_estimado,
        fecha_preferida,
        mensaje,
        acepto_terminos,
        newsletter,
        ip
    } = req.body;

    // Validate required fields
    if (!nombre || !apellido || !email || !telefono || !tipo_servicio || !ubicacion || !mensaje) {
        return res.status(400).json({
            success: false,
            message: 'Faltan campos requeridos'
        });
    }

    try {
        const insertQuery = `
            INSERT INTO contacts (
                nombre, apellido, email, telefono, empresa, tipo_servicio,
                ubicacion, presupuesto_estimado, fecha_preferida, mensaje,
                acepto_terminos, newsletter, ip_address
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING id
        `;

        const values = [
            nombre, apellido, email, telefono, empresa || null,
            tipo_servicio, ubicacion, presupuesto_estimado || null,
            fecha_preferida || null, mensaje, acepto_terminos === 'on' ? true : false,
            newsletter === 'on' ? true : false, ip || req.ip
        ];

        const result = await pool.query(insertQuery, values);
        
        console.log(`✅ New contact saved: ${nombre} ${apellido} (${email})`);
        
        res.json({
            success: true,
            message: 'Contacto guardado exitosamente',
            id: result.rows[0].id
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            success: false,
            message: 'Error al guardar el contacto'
        });
    }
});

// Get all contacts
app.get('/api/contacts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
        res.json({
            success: true,
            contacts: result.rows
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener contactos'
        });
    }
});

// Get contact by ID
app.get('/api/contacts/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await pool.query('SELECT * FROM contacts WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Contacto no encontrado'
            });
        }
        
        res.json({
            success: true,
            contact: result.rows[0]
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener contacto'
        });
    }
});

// Update contact status
app.put('/api/contacts/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['nuevo', 'contactado', 'en_proceso', 'completado', 'cancelado'];
    
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Estado inválido'
        });
    }

    try {
        await pool.query('UPDATE contacts SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [status, id]);
        res.json({
            success: true,
            message: 'Estado actualizado exitosamente'
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar estado'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🗄️ Database: PostgreSQL`);
    console.log(`📧 Contact form: http://localhost:${PORT}/contacto`);
    console.log(`👥 About page: http://localhost:${PORT}/nosotros`);
    console.log(`🔧 Admin panel: http://localhost:${PORT}/admin`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    await pool.end();
    process.exit(0);
});
