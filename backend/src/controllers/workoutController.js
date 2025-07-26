const Workout = require('../models/Workout');

const workoutController = {
  // GET /api/workouts
  getAllWorkouts: async (req, res) => {
    try {
      const { user_id, basic } = req.query;
      let workouts;
      
      if (basic === 'true') {
        // 為HomePage提供基本統計，不包含exercises數據
        workouts = await Workout.getAllBasic();
      } else if (user_id) {
        workouts = await Workout.getByUserId(user_id);
      } else {
        workouts = await Workout.getAll();
      }
      
      res.json(workouts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // GET /api/workouts/:id
  getWorkoutById: async (req, res) => {
    try {
      const workout = await Workout.getById(req.params.id);
      if (!workout) {
        return res.status(404).json({ error: 'Workout not found' });
      }
      
      const exercises = await Workout.getWorkoutExercises(req.params.id);
      res.json({ ...workout, exercises });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // POST /api/workouts
  createWorkout: async (req, res) => {
    try {
      const { user_id, date, notes, exercises } = req.body;
      
      if (!user_id || !date) {
        return res.status(400).json({ error: 'User ID and date are required' });
      }
      
      const workout = await Workout.create({ user_id, date, notes });
      
      // Add exercises if provided
      if (exercises && exercises.length > 0) {
        for (const exercise of exercises) {
          await Workout.addExercise({
            workout_id: workout.id,
            exercise_id: exercise.exercise_id,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight
          });
        }
      }
      
      res.status(201).json(workout);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // POST /api/workouts/:id/exercises
  addExerciseToWorkout: async (req, res) => {
    try {
      const { exercise_id, sets, reps, weight } = req.body;
      
      if (!exercise_id) {
        return res.status(400).json({ error: 'Exercise ID is required' });
      }
      
      const workoutExercise = await Workout.addExercise({
        workout_id: req.params.id,
        exercise_id,
        sets,
        reps,
        weight
      });
      
      res.status(201).json(workoutExercise);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // PUT /api/workouts/:id
  updateWorkout: async (req, res) => {
    try {
      const { user_id, date, notes } = req.body;
      
      if (!user_id || !date) {
        return res.status(400).json({ error: 'User ID and date are required' });
      }
      
      const workout = await Workout.update(req.params.id, { user_id, date, notes });
      res.json(workout);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // DELETE /api/workouts/:id
  deleteWorkout: async (req, res) => {
    try {
      const result = await Workout.delete(req.params.id);
      res.json({ message: 'Workout deleted successfully', ...result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = workoutController;