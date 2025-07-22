import React, { useState, useEffect, useCallback } from 'react';
import { getWorkouts, createWorkout, deleteWorkout } from '../services/api';
import UserSelector from '../components/UserSelector';
import ExerciseList from '../components/ExerciseList';

const WorkoutsPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
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
      const data = await getWorkouts(selectedUserId || null);
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
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save workout');
    }
  };

  const handleDelete = async (workoutId) => {
    if (window.confirm('確定要刪除此訓練紀錄嗎？')) {
      try {
        await deleteWorkout(workoutId);
        fetchWorkouts();
      } catch (err) {
        setError('Failed to delete workout');
      }
    }
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
            {workouts.map(workout => (
              <div key={workout.id} className="workout-item card">
                <div className="flex-between">
                  <div>
                    <div className="workout-date">{workout.date}</div>
                    <div className="workout-user">{workout.user_name}</div>
                    {workout.notes && <div className="workout-notes">{workout.notes}</div>}
                  </div>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(workout.id)}
                  >
                    刪除
                  </button>
                </div>
              </div>
            ))}
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
  );
};

export default WorkoutsPage;