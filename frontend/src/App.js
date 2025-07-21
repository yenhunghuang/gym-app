import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import UsersPage from './pages/UsersPage';
import ExercisesPage from './pages/ExercisesPage';
import WorkoutsPage from './pages/WorkoutsPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <Navigation />
        </div>
      </header>
      
      <main className="main-content">
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/exercises" element={<ExercisesPage />} />
            <Route path="/workouts" element={<WorkoutsPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;