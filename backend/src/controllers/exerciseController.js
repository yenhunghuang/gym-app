const Exercise = require('../models/Exercise');

const exerciseController = {
  // GET /api/exercises
  getAllExercises: async (req, res) => {
    try {
      const { category } = req.query;
      let exercises;
      
      if (category) {
        exercises = await Exercise.getByCategory(category);
      } else {
        exercises = await Exercise.getAll();
      }
      
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // GET /api/exercises/:id
  getExerciseById: async (req, res) => {
    try {
      const exercise = await Exercise.getById(req.params.id);
      if (!exercise) {
        return res.status(404).json({ error: 'Exercise not found' });
      }
      res.json(exercise);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // POST /api/exercises
  createExercise: async (req, res) => {
    try {
      const { name, category, description } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'Exercise name is required' });
      }
      
      const exercise = await Exercise.create({ name, category, description });
      res.status(201).json(exercise);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // PUT /api/exercises/:id
  updateExercise: async (req, res) => {
    try {
      const { name, category, description } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'Exercise name is required' });
      }
      
      const exercise = await Exercise.update(req.params.id, { name, category, description });
      res.json(exercise);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // DELETE /api/exercises/:id
  deleteExercise: async (req, res) => {
    try {
      const result = await Exercise.delete(req.params.id);
      res.json({ message: 'Exercise deleted successfully', ...result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = exerciseController;