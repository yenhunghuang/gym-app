import React, { useState, useEffect } from 'react';
import { getExercises, createExercise, updateExercise, deleteExercise } from '../services/api';

const ExercisesPage = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: '', description: '' });
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const data = await getExercises();
      setExercises(data);
    } catch (err) {
      setError('Failed to fetch exercises');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExercise) {
        await updateExercise(editingExercise.id, formData);
      } else {
        await createExercise(formData);
      }
      setShowModal(false);
      setEditingExercise(null);
      setFormData({ name: '', category: '', description: '' });
      fetchExercises();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save exercise');
    }
  };

  const handleEdit = (exercise) => {
    setEditingExercise(exercise);
    setFormData({ 
      name: exercise.name, 
      category: exercise.category || '', 
      description: exercise.description || '' 
    });
    setShowModal(true);
  };

  const handleDelete = async (exerciseId) => {
    if (window.confirm('確定要刪除此運動動作嗎？')) {
      try {
        await deleteExercise(exerciseId);
        fetchExercises();
      } catch (err) {
        setError('Failed to delete exercise');
      }
    }
  };

  const openCreateModal = () => {
    setEditingExercise(null);
    setFormData({ name: '', category: '', description: '' });
    setShowModal(true);
  };

  const categories = [...new Set(exercises.map(ex => ex.category).filter(Boolean))];
  const filteredExercises = selectedCategory 
    ? exercises.filter(ex => ex.category === selectedCategory)
    : exercises;

  if (loading) return <div className="loading">Loading exercises...</div>;

  return (
    <div>
      <div className="flex-between">
        <h1 className="page-title">運動動作管理</h1>
        <button className="btn" onClick={openCreateModal}>
          新增運動動作
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <div className="form-group">
          <label>篩選類別:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">所有類別</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        {filteredExercises.length === 0 ? (
          <p>目前沒有運動動作資料</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>運動名稱</th>
                <th>類別</th>
                <th>描述</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredExercises.map(exercise => (
                <tr key={exercise.id}>
                  <td>{exercise.name}</td>
                  <td>
                    {exercise.category && (
                      <span className="exercise-badge">{exercise.category}</span>
                    )}
                  </td>
                  <td>{exercise.description || '-'}</td>
                  <td>
                    <div className="flex">
                      <button 
                        className="btn btn-secondary"
                        onClick={() => handleEdit(exercise)}
                      >
                        編輯
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDelete(exercise.id)}
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingExercise ? '編輯運動動作' : '新增運動動作'}
              </h2>
              <button 
                className="close-btn" 
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>運動名稱*:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>類別:</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">請選擇類別</option>
                  <option value="Chest">胸部</option>
                  <option value="Back">背部</option>
                  <option value="Legs">腿部</option>
                  <option value="Shoulders">肩膀</option>
                  <option value="Arms">手臂</option>
                  <option value="Core">核心</option>
                  <option value="Cardio">有氧</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>描述:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                />
              </div>
              
              <div className="flex">
                <button type="submit" className="btn">
                  {editingExercise ? '更新' : '建立'}
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

export default ExercisesPage;