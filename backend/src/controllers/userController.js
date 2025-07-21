const User = require('../models/User');

const userController = {
  // GET /api/users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.getAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // GET /api/users/:id
  getUserById: async (req, res) => {
    try {
      const user = await User.getById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // POST /api/users
  createUser: async (req, res) => {
    try {
      const { name, email } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }
      
      const user = await User.create({ name, email });
      res.status(201).json(user);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        res.status(400).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // PUT /api/users/:id
  updateUser: async (req, res) => {
    try {
      const { name, email } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }
      
      const user = await User.update(req.params.id, { name, email });
      res.json(user);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        res.status(400).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // DELETE /api/users/:id
  deleteUser: async (req, res) => {
    try {
      const result = await User.delete(req.params.id);
      res.json({ message: 'User deleted successfully', ...result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = userController;