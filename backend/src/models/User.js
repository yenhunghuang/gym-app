const db = require('./database');

class User {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM users ORDER BY name', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static create(userData) {
    return new Promise((resolve, reject) => {
      const { name, email } = userData;
      db.run(
        'INSERT INTO users (name, email) VALUES (?, ?)',
        [name, email],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, name, email });
          }
        }
      );
    });
  }

  static update(id, userData) {
    return new Promise((resolve, reject) => {
      const { name, email } = userData;
      db.run(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        [name, email, id],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id, name, email });
          }
        }
      );
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deletedId: id });
        }
      });
    });
  }
}

module.exports = User;