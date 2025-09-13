const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const db = new sqlite3.Database('./elivo_contacts.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    } else {
        console.log('✅ Connected to SQLite database');
        initializeDatabase();
    }
});

function initializeDatabase() {
    // Create contacts table
    const createContactsTable = `
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

    // Create admin users table
    const createAdminTable = `
        CREATE TABLE IF NOT EXISTS admin_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            role TEXT DEFAULT 'admin',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;

    // Create contact status history table
    const createStatusHistoryTable = `
        CREATE TABLE IF NOT EXISTS contact_status_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            contact_id INTEGER NOT NULL,
            old_status TEXT,
            new_status TEXT NOT NULL,
            changed_by TEXT,
            notes TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (contact_id) REFERENCES contacts (id)
        )
    `;

    // Execute table creation
    db.serialize(() => {
        db.run(createContactsTable, (err) => {
            if (err) {
                console.error('Error creating contacts table:', err.message);
            } else {
                console.log('✅ Contacts table created/verified');
            }
        });

        db.run(createAdminTable, (err) => {
            if (err) {
                console.error('Error creating admin table:', err.message);
            } else {
                console.log('✅ Admin users table created/verified');
            }
        });

        db.run(createStatusHistoryTable, (err) => {
            if (err) {
                console.error('Error creating status history table:', err.message);
            } else {
                console.log('✅ Status history table created/verified');
            }
        });

        // Insert sample data
        insertSampleData();
    });
}

function insertSampleData() {
    // Check if sample data already exists
    db.get("SELECT COUNT(*) as count FROM contacts", (err, row) => {
        if (err) {
            console.error('Error checking existing data:', err.message);
            return;
        }

        if (row.count > 0) {
            console.log('📊 Sample data already exists, skipping...');
            closeDatabase();
            return;
        }

        // Insert sample contacts
        const sampleContacts = [
            {
                nombre: 'Juan',
                apellido: 'Pérez',
                email: 'juan.perez@email.com',
                telefono: '+56912345678',
                empresa: 'Constructora Norte',
                tipo_servicio: 'instalacion_comercial',
                ubicacion: 'La Serena, Coquimbo',
                presupuesto_estimado: '1000000_2000000',
                mensaje: 'Necesito una instalación eléctrica para un edificio de oficinas de 5 pisos.',
                acepto_terminos: 1,
                newsletter: 1,
                status: 'nuevo'
            },
            {
                nombre: 'María',
                apellido: 'González',
                email: 'maria.gonzalez@email.com',
                telefono: '+56987654321',
                empresa: null,
                tipo_servicio: 'instalacion_residencial',
                ubicacion: 'Coquimbo, Coquimbo',
                presupuesto_estimado: '500000_1000000',
                mensaje: 'Quiero modernizar la instalación eléctrica de mi casa con sistema smart home.',
                acepto_terminos: 1,
                newsletter: 0,
                status: 'contactado'
            },
            {
                nombre: 'Carlos',
                apellido: 'Rodríguez',
                email: 'carlos.rodriguez@empresa.com',
                telefono: '+56955555555',
                empresa: 'Minería del Norte',
                tipo_servicio: 'instalacion_industrial',
                ubicacion: 'Ovalle, Coquimbo',
                presupuesto_estimado: 'mas_5000000',
                mensaje: 'Proyecto de instalación eléctrica para planta minera con alta tensión.',
                acepto_terminos: 1,
                newsletter: 1,
                status: 'en_proceso'
            }
        ];

        const insertQuery = `
            INSERT INTO contacts (
                nombre, apellido, email, telefono, empresa, tipo_servicio,
                ubicacion, presupuesto_estimado, mensaje, acepto_terminos,
                newsletter, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        let completed = 0;
        sampleContacts.forEach((contact, index) => {
            const values = [
                contact.nombre, contact.apellido, contact.email, contact.telefono,
                contact.empresa, contact.tipo_servicio, contact.ubicacion,
                contact.presupuesto_estimado, contact.mensaje, contact.acepto_terminos,
                contact.newsletter, contact.status
            ];

            db.run(insertQuery, values, function(err) {
                if (err) {
                    console.error(`Error inserting sample contact ${index + 1}:`, err.message);
                } else {
                    console.log(`✅ Sample contact ${index + 1} inserted with ID: ${this.lastID}`);
                }

                completed++;
                if (completed === sampleContacts.length) {
                    console.log('🎉 Database initialization completed!');
                    closeDatabase();
                }
            });
        });
    });
}

function closeDatabase() {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('🔒 Database connection closed');
        }
        process.exit(0);
    });
}

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n🛑 Initialization interrupted');
    closeDatabase();
});
