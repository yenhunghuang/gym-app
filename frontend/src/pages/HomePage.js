import React, { useState, useEffect } from 'react';
import { getUsers, getExercises, getWorkoutsBasic } from '../services/api';
import StatsDashboard from '../components/StatsDashboard';
import AchievementSystem from '../components/AchievementSystem';

const HomePage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalExercises: 0,
    totalWorkouts: 0,
    recentWorkouts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [users, exercises, workouts] = await Promise.all([
        getUsers(),
        getExercises(),
        getWorkoutsBasic()
      ]);

      setStats({
        totalUsers: users.length,
        totalExercises: exercises.length,
        totalWorkouts: workouts.length,
        recentWorkouts: workouts.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="hero">
        <h1>歡迎使用 GymApp</h1>
        <p>記錄你的健身訓練，追蹤你的進步</p>
      </div>

      {/* 基本統計概覽 */}
      <div className="stats">
        <div className="stat-card">
          <h3>{stats.totalUsers}</h3>
          <p>使用者</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalExercises}</h3>
          <p>運動動作</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalWorkouts}</h3>
          <p>訓練紀錄</p>
        </div>
      </div>

      {/* 詳細統計面板 */}
      <StatsDashboard />

      {/* 成就系統 */}
      <AchievementSystem />

      {stats.recentWorkouts.length > 0 && (
        <div className="card">
          <h2>最近的訓練紀錄</h2>
          {stats.recentWorkouts.map(workout => (
            <div key={workout.id} className="workout-item">
              <div className="workout-date">{workout.date}</div>
              <div className="workout-user">{workout.user_name}</div>
              {workout.notes && <div className="workout-notes">{workout.notes}</div>}
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <h2>快速開始</h2>
        <p>
          使用 GymApp 來記錄你的訓練！你可以：
        </p>
        <ul>
          <li>管理訓練伙伴的資料</li>
          <li>新增自定義的運動動作</li>
          <li>記錄每次訓練的詳細資訊</li>
          <li>追蹤重量和次數的進步</li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;