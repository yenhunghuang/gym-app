-- GymApp Database Schema

-- Users table - stores user information
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Exercises table - stores exercise information
CREATE TABLE exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Workouts table - stores workout sessions
CREATE TABLE workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    date DATE NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Workout_Exercises table - links workouts to exercises with sets/reps/weight
CREATE TABLE workout_exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workout_id INTEGER,
    exercise_id INTEGER,
    sets INTEGER,
    reps INTEGER,
    weight DECIMAL(5,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workout_id) REFERENCES workouts(id),
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

-- Insert some sample data for testing
INSERT INTO users (name, email) VALUES 
('John Doe', 'john@example.com'),
('Jane Smith', 'jane@example.com');

INSERT INTO exercises (name, category, description) VALUES 
('Bench Press', 'Chest', 'Chest press exercise using barbell'),
('Squat', 'Legs', 'Lower body exercise targeting quadriceps and glutes'),
('Deadlift', 'Back', 'Full body exercise focusing on posterior chain'),
('Pull-ups', 'Back', 'Upper body pulling exercise'),
('Push-ups', 'Chest', 'Bodyweight chest exercise'),
('Shoulder Press', 'Shoulders', 'Overhead pressing movement for shoulders');