const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');

// GET /api/exercises - Get all exercises (with optional category filter)
router.get('/', exerciseController.getAllExercises);

// GET /api/exercises/:id - Get exercise by ID
router.get('/:id', exerciseController.getExerciseById);

// POST /api/exercises - Create new exercise
router.post('/', exerciseController.createExercise);

// PUT /api/exercises/:id - Update exercise
router.put('/:id', exerciseController.updateExercise);

// DELETE /api/exercises/:id - Delete exercise
router.delete('/:id', exerciseController.deleteExercise);

module.exports = router;