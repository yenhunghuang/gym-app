import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import BottomNavigation from './components/BottomNavigation';
import FloatingActionButton from './components/FloatingActionButton';
import PWAManager from './components/PWAManager';
import NotificationManager from './components/NotificationManager';
import HomePage from './pages/HomePage';
import UsersPage from './pages/UsersPage';
import ExercisesPage from './pages/ExercisesPage';
import WorkoutsPage from './pages/WorkoutsPage';
import WorkoutDetailPage from './pages/WorkoutDetailPage';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* Desktop Header Navigation */}
      <header className="header desktop-only">
        <div className="container">
          <Navigation />
        </div>
      </header>
      
      {/* Mobile Header */}
      <header className="mobile-header mobile-only">
        <div className="container">
          <div className="mobile-header-content">
            <h1 className="app-title">GymApp</h1>
          </div>
        </div>
      </header>
      
      <main className="main-content">
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/exercises" element={<ExercisesPage />} />
            <Route path="/workouts" element={<WorkoutsPage />} />
            <Route path="/workouts/:id" element={<WorkoutDetailPage />} />
          </Routes>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
      
      {/* Floating Action Button */}
      <FloatingActionButton />
      
      {/* PWA Manager */}
      <PWAManager />
      
      {/* Notification Manager */}
      <NotificationManager />
    </div>
  );
}

export default App;