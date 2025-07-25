import React, { useState, useEffect } from 'react';
import ProgressChart from './ProgressChart';
import { getWorkouts, getUsers } from '../services/api';

const StatsDashboard = () => {
  const [workoutData, setWorkoutData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState('all');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalWeight: 0,
    totalExercises: 0,
    avgWeightPerWorkout: 0,
    mostActiveDay: '',
    streak: 0
  });

  useEffect(() => {
    fetchData();
  }, [selectedUser]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 獲取用戶列表
      const usersData = await getUsers();
      setUsers(usersData);
      
      // 獲取訓練數據（包含練習詳情）
      const userId = selectedUser === 'all' ? null : selectedUser;
      const workouts = await getWorkouts(userId);
      
      // 為每個訓練獲取詳細信息
      const detailedWorkouts = await Promise.all(
        workouts.map(async (workout) => {
          try {
            // 這裡應該調用詳細的API，但目前使用現有數據結構
            return {
              ...workout,
              exercises: workout.exercises || []
            };
          } catch (err) {
            console.error('Error fetching workout details:', err);
            return { ...workout, exercises: [] };
          }
        })
      );
      
      setWorkoutData(detailedWorkouts);
      calculateStats(detailedWorkouts);
      
    } catch (err) {
      console.error('Error fetching stats data:', err);
      setError('無法載入統計數據');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (workouts) => {
    if (!workouts || workouts.length === 0) {
      setStats({
        totalWorkouts: 0,
        totalWeight: 0,
        totalExercises: 0,
        avgWeightPerWorkout: 0,
        mostActiveDay: '無數據',
        streak: 0
      });
      return;
    }

    // 計算基本統計
    let totalWeight = 0;
    let totalExercises = 0;
    const dayCount = {};

    workouts.forEach(workout => {
      if (workout.exercises) {
        workout.exercises.forEach(exercise => {
          totalWeight += (exercise.weight || 0) * (exercise.sets || 0) * (exercise.reps || 0);
          totalExercises += 1;
        });
      }

      // 統計每週幾的訓練次數
      const date = new Date(workout.date);
      const dayOfWeek = date.getDay();
      const dayNames = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
      const dayName = dayNames[dayOfWeek];
      dayCount[dayName] = (dayCount[dayName] || 0) + 1;
    });

    // 找出最活躍的日子
    const mostActiveDay = Object.keys(dayCount).reduce((a, b) => 
      dayCount[a] > dayCount[b] ? a : b, '週一'
    );

    // 計算連續訓練天數
    const sortedDates = workouts
      .map(w => new Date(w.date))
      .sort((a, b) => b - a); // 降序排列

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedDates.length; i++) {
      const workoutDate = new Date(sortedDates[i]);
      workoutDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate - workoutDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak || (streak === 0 && diffDays <= 1)) {
        streak = diffDays + 1;
        currentDate = new Date(workoutDate);
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    setStats({
      totalWorkouts: workouts.length,
      totalWeight: totalWeight,
      totalExercises: totalExercises,
      avgWeightPerWorkout: workouts.length > 0 ? totalWeight / workouts.length : 0,
      mostActiveDay: mostActiveDay,
      streak: Math.max(0, streak - 1)
    });
  };

  if (loading) {
    return (
      <div className="stats-dashboard">
        <div className="loading">載入統計數據中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-dashboard">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="stats-dashboard">
      {/* 用戶選擇器 */}
      <div className="stats-header">
        <h2>訓練統計</h2>
        <select 
          value={selectedUser} 
          onChange={(e) => setSelectedUser(e.target.value)}
          className="stats-user-selector"
        >
          <option value="all">所有用戶</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      {/* 核心統計卡片 */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">💪</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalWorkouts}</div>
            <div className="stat-label">總訓練次數</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚖️</div>
          <div className="stat-content">
            <div className="stat-value">{Math.round(stats.totalWeight)}kg</div>
            <div className="stat-label">總訓練重量</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏋️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalExercises}</div>
            <div className="stat-label">總動作數</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.streak}</div>
            <div className="stat-label">連續訓練天數</div>
          </div>
        </div>
      </div>

      {/* 進度圖表 */}
      <div className="stats-charts">
        <ProgressChart 
          data={workoutData}
          type="weight"
          title="重量進度"
          height="250px"
        />
        
        <ProgressChart 
          data={workoutData}
          type="workouts"
          title="訓練頻率"
          height="250px"
        />
        
        <ProgressChart 
          data={workoutData}
          type="exercises"
          title="動作數量"
          height="250px"
        />
      </div>

      {/* 額外統計信息 */}
      <div className="stats-extra">
        <div className="stats-insights">
          <h3>訓練洞察</h3>
          <div className="insight-item">
            <span className="insight-label">平均每次訓練重量：</span>
            <span className="insight-value">{Math.round(stats.avgWeightPerWorkout)}kg</span>
          </div>
          <div className="insight-item">
            <span className="insight-label">最活躍的日子：</span>
            <span className="insight-value">{stats.mostActiveDay}</span>
          </div>
          <div className="insight-item">
            <span className="insight-label">訓練密度：</span>
            <span className="insight-value">
              {stats.totalWorkouts > 0 ? (stats.totalExercises / stats.totalWorkouts).toFixed(1) : 0} 動作/次
            </span>
          </div>
        </div>

        {stats.streak > 0 && (
          <div className="achievement-banner">
            <div className="achievement-icon">🏆</div>
            <div className="achievement-content">
              <div className="achievement-title">堅持不懈！</div>
              <div className="achievement-desc">你已經連續訓練{stats.streak}天了！</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsDashboard;