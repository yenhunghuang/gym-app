import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkout, deleteWorkout } from '../services/api';

const WorkoutDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkoutDetail = async () => {
      try {
        const data = await getWorkout(id);
        setWorkout(data);
      } catch (err) {
        setError('無法載入訓練詳情');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutDetail();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('確定要刪除此訓練紀錄嗎？')) {
      try {
        await deleteWorkout(id);
        navigate('/workouts');
      } catch (err) {
        setError('刪除失敗');
      }
    }
  };

  const goBack = () => {
    navigate('/workouts');
  };

  if (loading) return <div className="loading">載入中...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!workout) return <div className="error">找不到訓練紀錄</div>;

  return (
    <div>
      <div className="flex-between">
        <button className="btn btn-secondary" onClick={goBack}>
          ← 返回訓練紀錄
        </button>
        <button className="btn btn-danger" onClick={handleDelete}>
          刪除訓練
        </button>
      </div>

      <div className="card">
        <h1 className="page-title">訓練詳情</h1>
        
        <div className="workout-header">
          <div className="workout-info">
            <h2>{workout.user_name} 的訓練</h2>
            <p className="workout-date">訓練日期: {new Date(workout.date).toLocaleDateString('zh-TW')}</p>
            {workout.notes && (
              <div className="workout-notes">
                <strong>備註:</strong> {workout.notes}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>訓練動作明細</h3>
        {workout.exercises && workout.exercises.length > 0 ? (
          <div className="exercises-list">
            {workout.exercises.map((exercise, index) => (
              <div key={exercise.id} className="exercise-item">
                <div className="exercise-header">
                  <span className="exercise-number">#{index + 1}</span>
                  <div className="exercise-info">
                    <h4 className="exercise-name">{exercise.exercise_name}</h4>
                    <span className="exercise-category">{exercise.category}</span>
                  </div>
                </div>
                
                <div className="exercise-details">
                  <div className="detail-item">
                    <span className="label">組數:</span>
                    <span className="value">{exercise.sets} 組</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">次數:</span>
                    <span className="value">{exercise.reps} 次</span>
                  </div>
                  {exercise.weight && (
                    <div className="detail-item">
                      <span className="label">重量:</span>
                      <span className="value">{exercise.weight} kg</span>
                    </div>
                  )}
                </div>
                
                <div className="exercise-summary">
                  <strong>
                    {exercise.sets} 組 × {exercise.reps} 次
                    {exercise.weight && ` @ ${exercise.weight} kg`}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-exercises">
            <p>此訓練沒有記錄任何動作</p>
          </div>
        )}
      </div>

      <div className="card">
        <h3>訓練統計</h3>
        <div className="workout-stats">
          <div className="stat-item">
            <span className="stat-label">總動作數</span>
            <span className="stat-value">{workout.exercises ? workout.exercises.length : 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">總組數</span>
            <span className="stat-value">
              {workout.exercises ? workout.exercises.reduce((total, ex) => total + (ex.sets || 0), 0) : 0}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">總次數</span>
            <span className="stat-value">
              {workout.exercises ? workout.exercises.reduce((total, ex) => total + (ex.sets * ex.reps || 0), 0) : 0}
            </span>
          </div>
          {workout.exercises && workout.exercises.some(ex => ex.weight) && (
            <div className="stat-item">
              <span className="stat-label">總重量</span>
              <span className="stat-value">
                {workout.exercises.reduce((total, ex) => total + (ex.weight * ex.sets * ex.reps || 0), 0).toFixed(1)} kg
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetailPage;