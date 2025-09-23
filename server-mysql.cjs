const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'elivo_contacts',
    port: process.env.DB_PORT || 3306
};

// Create database connection pool
const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Initialize database
async function initializeDatabase() {
    try {
        // Create database if it doesn't exist
        const connection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password,
            port: dbConfig.port
        });
        
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
        await connection.end();
        
        // Create table
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS contacts (
                id INT AUTO_INCREMENT PRIMARY KEY,
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
                ip_address VARCHAR(45),
                status VARCHAR(20) DEFAULT 'nuevo',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `;
        
        await pool.execute(createTableQuery);
        console.log('✅ Database initialized successfully');
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
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            nombre, apellido, email, telefono, empresa || null,
            tipo_servicio, ubicacion, presupuesto_estimado || null,
            fecha_preferida || null, mensaje, acepto_terminos === 'on' ? 1 : 0,
            newsletter === 'on' ? 1 : 0, ip || req.ip
        ];

        const [result] = await pool.execute(insertQuery, values);
        
        console.log(`✅ New contact saved: ${nombre} ${apellido} (${email})`);
        
        // Send email notification
        sendEmailNotification({
            id: result.insertId,
            nombre,
            apellido,
            email,
            tipo_servicio,
            ubicacion
        });
        
        res.json({
            success: true,
            message: 'Contacto guardado exitosamente',
            id: result.insertId
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
        const [rows] = await pool.execute('SELECT * FROM contacts ORDER BY created_at DESC');
        res.json({
            success: true,
            contacts: rows
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
        const [rows] = await pool.execute('SELECT * FROM contacts WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Contacto no encontrado'
            });
        }
        
        res.json({
            success: true,
            contact: rows[0]
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
        await pool.execute('UPDATE contacts SET status = ? WHERE id = ?', [status, id]);
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

// Email notification function
function sendEmailNotification(contact) {
    console.log('📧 Email notification for contact:', {
        id: contact.id,
        name: `${contact.nombre} ${contact.apellido}`,
        email: contact.email,
        service: contact.tipo_servicio,
        location: contact.ubicacion
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🗄️ Database: MySQL (${dbConfig.database})`);
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

