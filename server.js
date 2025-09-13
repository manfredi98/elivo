const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

// Database setup
const db = new sqlite3.Database('./elivo_contacts.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        createTable();
    }
});

// Create contacts table
function createTable() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            apellido TEXT NOT NULL,
            email TEXT NOT NULL,
            telefono TEXT NOT NULL,
            empresa TEXT,
            tipo_servicio TEXT NOT NULL,
            ubicacion TEXT NOT NULL,
            presupuesto_estimado TEXT,
            fecha_preferida TEXT,
            mensaje TEXT NOT NULL,
            acepto_terminos BOOLEAN NOT NULL,
            newsletter BOOLEAN DEFAULT 0,
            ip_address TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'nuevo'
        )
    `;
    
    db.run(createTableQuery, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Contacts table ready');
        }
    });
}

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

// API Routes
app.post('/api/contact', (req, res) => {
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

    // Insert contact into database
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

    db.run(insertQuery, values, function(err) {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({
                success: false,
                message: 'Error al guardar el contacto'
            });
        }

        console.log(`New contact saved with ID: ${this.lastID}`);
        
        // Send email notification (optional)
        sendEmailNotification({
            id: this.lastID,
            nombre,
            apellido,
            email,
            telefono,
            tipo_servicio,
            ubicacion,
            mensaje
        });

        res.json({
            success: true,
            message: 'Contacto guardado exitosamente',
            id: this.lastID
        });
    });
});

// Get all contacts (admin endpoint)
app.get('/api/contacts', (req, res) => {
    const query = 'SELECT * FROM contacts ORDER BY timestamp DESC';
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({
                success: false,
                message: 'Error al obtener contactos'
            });
        }

        res.json({
            success: true,
            contacts: rows
        });
    });
});

// Get contact by ID
app.get('/api/contacts/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM contacts WHERE id = ?';
    
    db.get(query, [id], (err, row) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({
                success: false,
                message: 'Error al obtener contacto'
            });
        }

        if (!row) {
            return res.status(404).json({
                success: false,
                message: 'Contacto no encontrado'
            });
        }

        res.json({
            success: true,
            contact: row
        });
    });
});

// Update contact status
app.put('/api/contacts/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['nuevo', 'contactado', 'en_proceso', 'completado', 'cancelado'];
    
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Estado inválido'
        });
    }

    const query = 'UPDATE contacts SET status = ? WHERE id = ?';
    
    db.run(query, [status, id], function(err) {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({
                success: false,
                message: 'Error al actualizar estado'
            });
        }

        res.json({
            success: true,
            message: 'Estado actualizado exitosamente'
        });
    });
});

// Email notification function (placeholder)
function sendEmailNotification(contact) {
    console.log('📧 Email notification for contact:', {
        id: contact.id,
        name: `${contact.nombre} ${contact.apellido}`,
        email: contact.email,
        service: contact.tipo_servicio,
        location: contact.ubicacion
    });
    
    // Here you would integrate with an email service like:
    // - Nodemailer with SMTP
    // - SendGrid
    // - Mailgun
    // - AWS SES
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Database: elivo_contacts.db`);
    console.log(`📧 Contact form: http://localhost:${PORT}/contacto`);
    console.log(`👥 About page: http://localhost:${PORT}/nosotros`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('✅ Database connection closed');
        }
        process.exit(0);
    });
});
