import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getWorkouts, createWorkout, deleteWorkout } from '../services/api';
import UserSelector from '../components/UserSelector';
import ExerciseList from '../components/ExerciseList';
import SwipeGestures, { SwipeToDelete } from '../components/SwipeGestures';
import { useIsMobile } from '../hooks/useDeviceDetection';

const WorkoutsPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('all');
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    user_id: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    exercises: []
  });
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [exerciseData, setExerciseData] = useState({
    sets: '',
    reps: '',
    weight: ''
  });

  const fetchWorkouts = useCallback(async () => {
    try {
      // 修正邏輯：當選擇「所有使用者」時傳送 null，其他情況傳送實際的 userId
      const userId = selectedUserId === 'all' || !selectedUserId ? null : selectedUserId;
      const data = await getWorkouts(userId);
      setWorkouts(data);
    } catch (err) {
      setError('Failed to fetch workouts');
    } finally {
      setLoading(false);
    }
  }, [selectedUserId]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  // 監聽FAB觸發的事件
  useEffect(() => {
    const handleOpenModal = () => {
      openCreateModal();
    };

    window.addEventListener('openWorkoutModal', handleOpenModal);
    return () => window.removeEventListener('openWorkoutModal', handleOpenModal);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createWorkout(formData);
      setShowModal(false);
      setFormData({
        user_id: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        exercises: []
      });
      fetchWorkouts();
      
      // 觸發訓練完成事件
      const workoutCreatedEvent = new CustomEvent('workoutCreated', {
        detail: { workoutData: formData }
      });
      window.dispatchEvent(workoutCreatedEvent);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save workout');
    }
  };

  const handleDelete = async (workoutId) => {
    if (window.confirm('確定要刪除此訓練紀錄嗎？')) {
      try {
        await deleteWorkout(workoutId);
        fetchWorkouts();
        showGestureFeedback('訓練記錄已刪除');
      } catch (err) {
        setError('Failed to delete workout');
      }
    }
  };

  // 下拉刷新功能
  const handlePullToRefresh = async () => {
    showGestureFeedback('刷新中...');
    await fetchWorkouts();
    showGestureFeedback('刷新完成');
  };

  // 顯示手勢反饋
  const showGestureFeedback = (message) => {
    const feedback = document.createElement('div');
    feedback.className = 'gesture-feedback';
    feedback.textContent = message;
    document.body.appendChild(feedback);

    setTimeout(() => {
      document.body.removeChild(feedback);
    }, 2000);
  };

  const addExerciseToWorkout = () => {
    if (selectedExerciseId && exerciseData.sets && exerciseData.reps) {
      const newExercise = {
        exercise_id: parseInt(selectedExerciseId),
        sets: parseInt(exerciseData.sets),
        reps: parseInt(exerciseData.reps),
        weight: exerciseData.weight ? parseFloat(exerciseData.weight) : null
      };
      
      setFormData({
        ...formData,
        exercises: [...formData.exercises, newExercise]
      });
      
      setSelectedExerciseId('');
      setExerciseData({ sets: '', reps: '', weight: '' });
    }
  };

  const removeExerciseFromWorkout = (index) => {
    setFormData({
      ...formData,
      exercises: formData.exercises.filter((_, i) => i !== index)
    });
  };

  const openCreateModal = () => {
    setFormData({
      user_id: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      exercises: []
    });
    setShowModal(true);
  };

  if (loading) return <div className="loading">Loading workouts...</div>;

  return (
    <SwipeGestures onPullToRefresh={handlePullToRefresh}>
      <div>
        <div className="flex-between">
          <h1 className="page-title">訓練紀錄</h1>
          <button className="btn" onClick={openCreateModal}>
            新增訓練紀錄
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="card">
          <UserSelector
            selectedUserId={selectedUserId}
            onUserSelect={setSelectedUserId}
            showAll={true}
          />
        </div>

        <div className="card">
          {workouts.length === 0 ? (
            <p>目前沒有訓練紀錄</p>
          ) : (
            <div className="grid">
              {workouts.map(workout => {
                const workoutContent = (
                  <div className="workout-item card">
                    <Link 
                      to={`/workouts/${workout.id}`} 
                      className="workout-item-clickable"
                    >
                      <div className="workout-content">
                        <div className="workout-date">{workout.date}</div>
                        <div className="workout-user">{workout.user_name}</div>
                        {workout.notes && <div className="workout-notes">{workout.notes}</div>}
                        <div className="workout-hint">點擊查看詳細動作 →</div>
                      </div>
                    </Link>
                    <div className="workout-actions desktop-only">
                      <button 
                        className="btn btn-danger"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(workout.id);
                        }}
                      >
                        刪除
                      </button>
                    </div>
                  </div>
                );

                // Conditionally wrap with SwipeToDelete on mobile
                return isMobile ? (
                  <SwipeToDelete
                    key={workout.id}
                    onDelete={() => handleDelete(workout.id)}
                    deleteText="刪除"
                    className="workout-item-with-gestures"
                  >
                    {workoutContent}
                  </SwipeToDelete>
                ) : (
                  <div key={workout.id}>
                    {workoutContent}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {showModal && (
          <div className="modal" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">新增訓練紀錄</h2>
                <button 
                  className="close-btn" 
                  onClick={() => setShowModal(false)}
                >
                ×
                </button>
              </div>
            
              <form onSubmit={handleSubmit}>
                <UserSelector
                  selectedUserId={formData.user_id}
                  onUserSelect={(userId) => setFormData({...formData, user_id: userId})}
                />
              
                <div className="form-group">
                  <label>訓練日期*:</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
              
                <div className="form-group">
                  <label>備註:</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>新增運動:</label>
                  <ExerciseList
                    selectedExerciseId={selectedExerciseId}
                    onExerciseSelect={setSelectedExerciseId}
                  />
                
                  <div className="form-row">
                    <div className="form-group">
                      <label>組數:</label>
                      <input
                        type="number"
                        value={exerciseData.sets}
                        onChange={(e) => setExerciseData({...exerciseData, sets: e.target.value})}
                        min="1"
                      />
                    </div>
                  
                    <div className="form-group">
                      <label>次數:</label>
                      <input
                        type="number"
                        value={exerciseData.reps}
                        onChange={(e) => setExerciseData({...exerciseData, reps: e.target.value})}
                        min="1"
                      />
                    </div>
                  
                    <div className="form-group">
                      <label>重量 (kg):</label>
                      <input
                        type="number"
                        step="0.5"
                        value={exerciseData.weight}
                        onChange={(e) => setExerciseData({...exerciseData, weight: e.target.value})}
                        min="0"
                      />
                    </div>
                  </div>
                
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={addExerciseToWorkout}
                  >
                  加入運動
                  </button>
                </div>

                {formData.exercises.length > 0 && (
                  <div className="form-group">
                    <label>已加入的運動:</label>
                    {formData.exercises.map((exercise, index) => (
                      <div key={index} className="flex-between exercise-item">
                        <span>
                        運動ID: {exercise.exercise_id} - 
                          {exercise.sets}組 x {exercise.reps}次
                          {exercise.weight && ` @ ${exercise.weight}kg`}
                        </span>
                        <button 
                          type="button"
                          className="btn btn-danger"
                          onClick={() => removeExerciseFromWorkout(index)}
                        >
                        移除
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              
                <div className="flex">
                  <button type="submit" className="btn">
                  建立訓練紀錄
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                  取消
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </SwipeGestures>
  );
};

export default WorkoutsPage;