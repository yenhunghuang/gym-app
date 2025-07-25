const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../../../database/gym.db');
const schemaPath = path.join(__dirname, '../../../database/schema.sql');

// Create database directory if it doesn't exist
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message); // eslint-disable-line no-console
  } else {
    console.log('Connected to SQLite database at:', dbPath); // eslint-disable-line no-console
    
    // Initialize schema if database is empty
    initializeSchema();
  }
});

function initializeSchema() {
  db.get('SELECT name FROM sqlite_master WHERE type=\'table\' AND name=\'users\'', (err, row) => {
    if (err) {
      console.error('Error checking for tables:', err.message); // eslint-disable-line no-console
    } else if (!row) {
      // Database is empty, initialize with schema
      console.log('Initializing database schema...'); // eslint-disable-line no-console
      
      if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        db.exec(schema, (err) => {
          if (err) {
            console.error('Error initializing schema:', err.message); // eslint-disable-line no-console
          } else {
            console.log('Database schema initialized successfully'); // eslint-disable-line no-console
          }
        });
      } else {
        console.error('Schema file not found:', schemaPath); // eslint-disable-line no-console
      }
    }
  });
}

module.exports = db;