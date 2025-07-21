const db = require('./database');

class Exercise {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM exercises ORDER BY category, name', (err, rows) => {
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
      db.get('SELECT * FROM exercises WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static getByCategory(category) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM exercises WHERE category = ? ORDER BY name', [category], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static create(exerciseData) {
    return new Promise((resolve, reject) => {
      const { name, category, description } = exerciseData;
      db.run(
        'INSERT INTO exercises (name, category, description) VALUES (?, ?, ?)',
        [name, category, description],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, name, category, description });
          }
        }
      );
    });
  }

  static update(id, exerciseData) {
    return new Promise((resolve, reject) => {
      const { name, category, description } = exerciseData;
      db.run(
        'UPDATE exercises SET name = ?, category = ?, description = ? WHERE id = ?',
        [name, category, description, id],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id, name, category, description });
          }
        }
      );
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM exercises WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deletedId: id });
        }
      });
    });
  }
}

module.exports = Exercise;