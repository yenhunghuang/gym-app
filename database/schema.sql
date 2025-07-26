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
('臥推', '胸部', '使用槓鈴進行的胸部訓練動作'),
('深蹲', '腿部', '主要訓練股四頭肌和臀肌的下肢運動'),
('硬舉', '背部', '訓練後鏈肌群的全身性動作'),
('引體向上', '背部', '上肢拉動動作'),
('伏地挺身', '胸部', '自體重量胸部訓練動作'),
('肩上推舉', '肩部', '肩部上推動作，訓練三角肌');