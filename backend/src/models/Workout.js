const db = require('./database');

class Workout {
  static getAll() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT w.*, u.name as user_name 
        FROM workouts w 
        LEFT JOIN users u ON w.user_id = u.id 
        ORDER BY w.date DESC
      `;
      db.all(query, (err, rows) => {
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
      const query = `
        SELECT w.*, u.name as user_name 
        FROM workouts w 
        LEFT JOIN users u ON w.user_id = u.id 
        WHERE w.id = ?
      `;
      db.get(query, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static getByUserId(userId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT w.*, u.name as user_name 
        FROM workouts w 
        LEFT JOIN users u ON w.user_id = u.id 
        WHERE w.user_id = ? 
        ORDER BY w.date DESC
      `;
      db.all(query, [userId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static getWorkoutExercises(workoutId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT we.*, e.name as exercise_name, e.category 
        FROM workout_exercises we 
        JOIN exercises e ON we.exercise_id = e.id 
        WHERE we.workout_id = ?
      `;
      db.all(query, [workoutId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static create(workoutData) {
    return new Promise((resolve, reject) => {
      const { user_id, date, notes } = workoutData;
      db.run(
        'INSERT INTO workouts (user_id, date, notes) VALUES (?, ?, ?)',
        [user_id, date, notes],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, user_id, date, notes });
          }
        }
      );
    });
  }

  static addExercise(workoutExerciseData) {
    return new Promise((resolve, reject) => {
      const { workout_id, exercise_id, sets, reps, weight } = workoutExerciseData;
      db.run(
        'INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, weight) VALUES (?, ?, ?, ?, ?)',
        [workout_id, exercise_id, sets, reps, weight],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, workout_id, exercise_id, sets, reps, weight });
          }
        }
      );
    });
  }

  static update(id, workoutData) {
    return new Promise((resolve, reject) => {
      const { user_id, date, notes } = workoutData;
      db.run(
        'UPDATE workouts SET user_id = ?, date = ?, notes = ? WHERE id = ?',
        [user_id, date, notes, id],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id, user_id, date, notes });
          }
        }
      );
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('DELETE FROM workout_exercises WHERE workout_id = ?', [id]);
        db.run('DELETE FROM workouts WHERE id = ?', [id], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ deletedId: id });
          }
        });
      });
    });
  }
}

module.exports = Workout;