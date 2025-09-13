const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

// Data file path
const DATA_FILE = './contacts.json';

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// Helper functions
function readContacts() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading contacts:', error);
        return [];
    }
}

function writeContacts(contacts) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(contacts, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing contacts:', error);
        return false;
    }
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

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
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

    // Create new contact
    const newContact = {
        id: Date.now(), // Simple ID generation
        nombre,
        apellido,
        email,
        telefono,
        empresa: empresa || null,
        tipo_servicio,
        ubicacion,
        presupuesto_estimado: presupuesto_estimado || null,
        fecha_preferida: fecha_preferida || null,
        mensaje,
        acepto_terminos: acepto_terminos === 'on' ? true : false,
        newsletter: newsletter === 'on' ? true : false,
        ip_address: ip || req.ip,
        timestamp: new Date().toISOString(),
        status: 'nuevo'
    };

    // Read existing contacts
    const contacts = readContacts();
    
    // Add new contact
    contacts.push(newContact);
    
    // Write back to file
    if (writeContacts(contacts)) {
        console.log(`✅ New contact saved: ${nombre} ${apellido} (${email})`);
        
        // Send email notification (placeholder)
        sendEmailNotification(newContact);
        
        res.json({
            success: true,
            message: 'Contacto guardado exitosamente',
            id: newContact.id
        });
    } else {
        res.status(500).json({
            success: false,
            message: 'Error al guardar el contacto'
        });
    }
});

// Get all contacts
app.get('/api/contacts', (req, res) => {
    const contacts = readContacts();
    res.json({
        success: true,
        contacts: contacts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    });
});

// Get contact by ID
app.get('/api/contacts/:id', (req, res) => {
    const { id } = req.params;
    const contacts = readContacts();
    const contact = contacts.find(c => c.id == id);
    
    if (!contact) {
        return res.status(404).json({
            success: false,
            message: 'Contacto no encontrado'
        });
    }
    
    res.json({
        success: true,
        contact: contact
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

    const contacts = readContacts();
    const contactIndex = contacts.findIndex(c => c.id == id);
    
    if (contactIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Contacto no encontrado'
        });
    }
    
    contacts[contactIndex].status = status;
    
    if (writeContacts(contacts)) {
        res.json({
            success: true,
            message: 'Estado actualizado exitosamente'
        });
    } else {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar estado'
        });
    }
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
    console.log(`📊 Data file: ${DATA_FILE}`);
    console.log(`📧 Contact form: http://localhost:${PORT}/contacto`);
    console.log(`👥 About page: http://localhost:${PORT}/nosotros`);
    console.log(`🔧 Admin panel: http://localhost:${PORT}/admin`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    process.exit(0);
});

