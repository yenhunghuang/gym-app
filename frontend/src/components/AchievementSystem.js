import React, { useState, useEffect } from 'react';
import { getWorkouts } from '../services/api';

const AchievementSystem = () => {
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [showNewAchievement, setShowNewAchievement] = useState(null);
  const [userStats, setUserStats] = useState({});

  // 定義成就系統
  const achievementDefinitions = [
    {
      id: 'first_workout',
      title: '初出茅廬',
      description: '完成第一次訓練',
      icon: '🌟',
      condition: (stats) => stats.totalWorkouts >= 1,
      points: 10
    },
    {
      id: 'workout_streak_3',
      title: '三日連勝',
      description: '連續訓練3天',
      icon: '🔥',
      condition: (stats) => stats.currentStreak >= 3,
      points: 25
    },
    {
      id: 'workout_streak_7',
      title: '週行者',
      description: '連續訓練7天',
      icon: '⚡',
      condition: (stats) => stats.currentStreak >= 7,
      points: 50
    },
    {
      id: 'workout_streak_30',
      title: '月度戰神',
      description: '連續訓練30天',
      icon: '👑',
      condition: (stats) => stats.currentStreak >= 30,
      points: 200
    },
    {
      id: 'total_workouts_10',
      title: '十全十美',
      description: '累計完成10次訓練',
      icon: '💪',
      condition: (stats) => stats.totalWorkouts >= 10,
      points: 30
    },
    {
      id: 'total_workouts_50',
      title: '半百壯士',
      description: '累計完成50次訓練',
      icon: '🏆',
      condition: (stats) => stats.totalWorkouts >= 50,
      points: 100
    },
    {
      id: 'total_workouts_100',
      title: '百戰勇士',
      description: '累計完成100次訓練',
      icon: '🎖️',
      condition: (stats) => stats.totalWorkouts >= 100,
      points: 300
    },
    {
      id: 'heavy_lifter',
      title: '舉重好手',
      description: '單次訓練總重量超過1000kg',
      icon: '🏋️',
      condition: (stats) => stats.maxWorkoutWeight >= 1000,
      points: 75
    },
    {
      id: 'weight_master',
      title: '重量大師',
      description: '累計訓練重量超過10000kg',
      icon: '⚖️',
      condition: (stats) => stats.totalWeight >= 10000,
      points: 150
    },
    {
      id: 'early_bird',
      title: '早起鳥兒',
      description: '在早上6點前完成5次訓練',
      icon: '🌅',
      condition: (stats) => stats.earlyWorkouts >= 5,
      points: 40
    },
    {
      id: 'night_owl',
      title: '夜貓子',
      description: '在晚上10點後完成5次訓練',
      icon: '🦉',
      condition: (stats) => stats.lateWorkouts >= 5,
      points: 40
    },
    {
      id: 'variety_seeker',
      title: '多樣探索者',
      description: '使用超過20種不同的運動',
      icon: '🎯',
      condition: (stats) => stats.uniqueExercises >= 20,
      points: 60
    },
    {
      id: 'weekend_warrior',
      title: '週末戰士',
      description: '在週末完成10次訓練',
      icon: '🗡️',
      condition: (stats) => stats.weekendWorkouts >= 10,
      points: 35
    }
  ];

  useEffect(() => {
    // 載入已解鎖的成就
    const saved = localStorage.getItem('unlockedAchievements');
    if (saved) {
      setUnlockedAchievements(JSON.parse(saved));
    }

    // 載入用戶統計數據
    loadUserStats();

    // 監聽訓練完成事件
    const handleWorkoutCreated = () => {
      setTimeout(() => {
        loadUserStats();
      }, 1000); // 延遲以確保數據已更新
    };

    window.addEventListener('workoutCreated', handleWorkoutCreated);
    return () => window.removeEventListener('workoutCreated', handleWorkoutCreated);
  }, []);

  useEffect(() => {
    if (Object.keys(userStats).length > 0) {
      checkForNewAchievements();
    }
  }, [userStats]);

  const loadUserStats = async () => {
    try {
      const workouts = await getWorkouts();
      const stats = calculateUserStats(workouts);
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const calculateUserStats = (workouts) => {
    if (!workouts || workouts.length === 0) {
      return {
        totalWorkouts: 0,
        currentStreak: 0,
        totalWeight: 0,
        maxWorkoutWeight: 0,
        uniqueExercises: 0,
        earlyWorkouts: 0,
        lateWorkouts: 0,
        weekendWorkouts: 0
      };
    }

    // 計算總訓練次數
    const totalWorkouts = workouts.length;

    // 計算當前連續天數
    const sortedDates = workouts
      .map(w => new Date(w.date))
      .sort((a, b) => b - a);

    let currentStreak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedDates.length; i++) {
      const workoutDate = new Date(sortedDates[i]);
      workoutDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate - workoutDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === currentStreak || (currentStreak === 0 && diffDays <= 1)) {
        currentStreak = diffDays + 1;
        currentDate = new Date(workoutDate);
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    // 計算重量相關統計
    let totalWeight = 0;
    let maxWorkoutWeight = 0;
    const uniqueExerciseIds = new Set();
    let earlyWorkouts = 0;
    let lateWorkouts = 0;
    let weekendWorkouts = 0;

    workouts.forEach(workout => {
      let workoutWeight = 0;
      
      if (workout.exercises) {
        workout.exercises.forEach(exercise => {
          const weight = (exercise.weight || 0) * (exercise.sets || 0) * (exercise.reps || 0);
          workoutWeight += weight;
          uniqueExerciseIds.add(exercise.exercise_id || exercise.id);
        });
      }

      totalWeight += workoutWeight;
      maxWorkoutWeight = Math.max(maxWorkoutWeight, workoutWeight);

      // 檢查訓練時間
      const workoutDate = new Date(workout.date);
      const hour = workoutDate.getHours();
      const dayOfWeek = workoutDate.getDay();

      if (hour < 6) earlyWorkouts++;
      if (hour >= 22) lateWorkouts++;
      if (dayOfWeek === 0 || dayOfWeek === 6) weekendWorkouts++;
    });

    return {
      totalWorkouts,
      currentStreak: Math.max(0, currentStreak - 1),
      totalWeight,
      maxWorkoutWeight,
      uniqueExercises: uniqueExerciseIds.size,
      earlyWorkouts,
      lateWorkouts,
      weekendWorkouts
    };
  };

  const checkForNewAchievements = () => {
    const newlyUnlocked = [];

    achievementDefinitions.forEach(achievement => {
      const isAlreadyUnlocked = unlockedAchievements.some(
        unlocked => unlocked.id === achievement.id
      );

      if (!isAlreadyUnlocked && achievement.condition(userStats)) {
        newlyUnlocked.push({
          ...achievement,
          unlockedAt: new Date().toISOString()
        });
      }
    });

    if (newlyUnlocked.length > 0) {
      const updatedUnlocked = [...unlockedAchievements, ...newlyUnlocked];
      setUnlockedAchievements(updatedUnlocked);
      localStorage.setItem('unlockedAchievements', JSON.stringify(updatedUnlocked));

      // 顯示新成就通知
      newlyUnlocked.forEach((achievement, index) => {
        setTimeout(() => {
          setShowNewAchievement(achievement);
          setTimeout(() => setShowNewAchievement(null), 4000);
        }, index * 1000);
      });
    }
  };

  const getTotalPoints = () => {
    return unlockedAchievements.reduce((total, achievement) => total + achievement.points, 0);
  };

  const getProgressPercentage = () => {
    return Math.round((unlockedAchievements.length / achievementDefinitions.length) * 100);
  };

  const getAchievementProgress = (achievement) => {
    if (unlockedAchievements.some(unlocked => unlocked.id === achievement.id)) {
      return 100;
    }

    // 為某些成就計算進度百分比
    switch (achievement.id) {
    case 'workout_streak_3':
      return Math.min((userStats.currentStreak / 3) * 100, 100);
    case 'workout_streak_7':
      return Math.min((userStats.currentStreak / 7) * 100, 100);
    case 'workout_streak_30':
      return Math.min((userStats.currentStreak / 30) * 100, 100);
    case 'total_workouts_10':
      return Math.min((userStats.totalWorkouts / 10) * 100, 100);
    case 'total_workouts_50':
      return Math.min((userStats.totalWorkouts / 50) * 100, 100);
    case 'total_workouts_100':
      return Math.min((userStats.totalWorkouts / 100) * 100, 100);
    case 'heavy_lifter':
      return Math.min((userStats.maxWorkoutWeight / 1000) * 100, 100);
    case 'weight_master':
      return Math.min((userStats.totalWeight / 10000) * 100, 100);
    default:
      return 0;
    }
  };

  return (
    <>
      {/* 新成就通知 */}
      {showNewAchievement && (
        <div className="achievement-notification">
          <div className="achievement-notification-content">
            <div className="achievement-notification-icon">
              {showNewAchievement.icon}
            </div>
            <div className="achievement-notification-text">
              <div className="achievement-notification-title">
                🎉 新成就解鎖！
              </div>
              <div className="achievement-notification-name">
                {showNewAchievement.title}
              </div>
              <div className="achievement-notification-desc">
                {showNewAchievement.description}
              </div>
              <div className="achievement-notification-points">
                +{showNewAchievement.points} 點
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 成就系統面板 */}
      <div className="achievement-system">
        <div className="achievement-header">
          <h3>成就系統</h3>
          <div className="achievement-summary">
            <div className="achievement-points">
              <span className="points-icon">⭐</span>
              <span className="points-value">{getTotalPoints()}</span>
              <span className="points-label">點數</span>
            </div>
            <div className="achievement-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              <span className="progress-text">
                {unlockedAchievements.length}/{achievementDefinitions.length} 
                ({getProgressPercentage()}%)
              </span>
            </div>
          </div>
        </div>

        <div className="achievements-grid">
          {achievementDefinitions.map(achievement => {
            const isUnlocked = unlockedAchievements.some(
              unlocked => unlocked.id === achievement.id
            );
            const progress = getAchievementProgress(achievement);

            return (
              <div 
                key={achievement.id} 
                className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="achievement-icon">
                  {isUnlocked ? achievement.icon : '🔒'}
                </div>
                <div className="achievement-content">
                  <div className="achievement-title">
                    {achievement.title}
                  </div>
                  <div className="achievement-description">
                    {achievement.description}
                  </div>
                  <div className="achievement-points-badge">
                    {achievement.points} 點
                  </div>
                  {!isUnlocked && progress > 0 && (
                    <div className="achievement-progress-bar">
                      <div 
                        className="achievement-progress-fill"
                        style={{ width: `${progress}%` }}
                      ></div>
                      <span className="achievement-progress-text">
                        {Math.round(progress)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AchievementSystem;