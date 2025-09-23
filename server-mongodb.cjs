const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

// Database configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'elivo_contacts';
const COLLECTION_NAME = 'contacts';

let db;
let contactsCollection;

// Initialize database connection
async function initializeDatabase() {
    try {
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        db = client.db(DB_NAME);
        contactsCollection = db.collection(COLLECTION_NAME);
        
        // Create indexes for better performance
        await contactsCollection.createIndex({ email: 1 });
        await contactsCollection.createIndex({ created_at: -1 });
        await contactsCollection.createIndex({ status: 1 });
        
        console.log('✅ MongoDB database initialized successfully');
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
        const newContact = {
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
            status: 'nuevo',
            created_at: new Date(),
            updated_at: new Date()
        };

        const result = await contactsCollection.insertOne(newContact);
        
        console.log(`✅ New contact saved: ${nombre} ${apellido} (${email})`);
        
        res.json({
            success: true,
            message: 'Contacto guardado exitosamente',
            id: result.insertedId
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
        const contacts = await contactsCollection
            .find({})
            .sort({ created_at: -1 })
            .toArray();
            
        res.json({
            success: true,
            contacts: contacts
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
        const { ObjectId } = require('mongodb');
        const contact = await contactsCollection.findOne({ _id: new ObjectId(id) });
        
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
        const { ObjectId } = require('mongodb');
        await contactsCollection.updateOne(
            { _id: new ObjectId(id) },
            { 
                $set: { 
                    status: status,
                    updated_at: new Date()
                }
            }
        );
        
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
    console.log(`🗄️ Database: MongoDB`);
    console.log(`📧 Contact form: http://localhost:${PORT}/contacto`);
    console.log(`👥 About page: http://localhost:${PORT}/nosotros`);
    console.log(`🔧 Admin panel: http://localhost:${PORT}/admin`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    process.exit(0);
});

