const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');

// GET /api/workouts - Get all workouts (with optional user_id filter)
router.get('/', workoutController.getAllWorkouts);

// GET /api/workouts/:id - Get workout by ID with exercises
router.get('/:id', workoutController.getWorkoutById);

// POST /api/workouts - Create new workout
router.post('/', workoutController.createWorkout);

// POST /api/workouts/:id/exercises - Add exercise to workout
router.post('/:id/exercises', workoutController.addExerciseToWorkout);

// PUT /api/workouts/:id - Update workout
router.put('/:id', workoutController.updateWorkout);

// DELETE /api/workouts/:id - Delete workout
router.delete('/:id', workoutController.deleteWorkout);

module.exports = router;