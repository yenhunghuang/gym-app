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
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    
    // Initialize schema if database is empty
    initializeSchema();
  }
});

function initializeSchema() {
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
    if (err) {
      console.error('Error checking for tables:', err.message);
    } else if (!row) {
      // Database is empty, initialize with schema
      console.log('Initializing database schema...');
      
      if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        db.exec(schema, (err) => {
          if (err) {
            console.error('Error initializing schema:', err.message);
          } else {
            console.log('Database schema initialized successfully');
          }
        });
      } else {
        console.error('Schema file not found:', schemaPath);
      }
    }
  });
}

module.exports = db;