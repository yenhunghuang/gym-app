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
  const [searchTerm, setSearchTerm] = useState('');

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

  const categories = [...new Set(exercises.map(ex => ex.category).filter(Boolean))].sort();
  const filteredExercises = exercises.filter(exercise => {
    const matchesCategory = !selectedCategory || exercise.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exercise.description && exercise.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

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

      {/* 統計卡片 */}
      <div className="stats">
        <div className="stat-card">
          <h3>{exercises.length}</h3>
          <p>總運動動作</p>
        </div>
        <div className="stat-card">
          <h3>{categories.length}</h3>
          <p>運動類別</p>
        </div>
        <div className="stat-card">
          <h3>{filteredExercises.length}</h3>
          <p>篩選結果</p>
        </div>
      </div>

      {/* 搜索和篩選 */}
      <div className="card">
        <div className="form-row">
          <div className="form-group">
            <label>搜索動作:</label>
            <input
              type="text"
              placeholder="輸入動作名稱或描述..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>篩選類別:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">所有類別</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category} ({exercises.filter(ex => ex.category === category).length})
                </option>
              ))}
            </select>
          </div>
        </div>
        {(searchTerm || selectedCategory) && (
          <div className="flex">
            <button 
              className="btn btn-secondary"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
            >
              清除篩選
            </button>
          </div>
        )}
      </div>

      <div className="card">
        {filteredExercises.length === 0 ? (
          <div className="empty-state">
            <p>
              {searchTerm || selectedCategory 
                ? '沒有符合條件的運動動作' 
                : '目前沒有運動動作資料'
              }
            </p>
            {!searchTerm && !selectedCategory && (
              <button className="btn" onClick={openCreateModal}>
                新增第一個運動動作
              </button>
            )}
          </div>
        ) : (
          <div className="exercises-grid">
            {filteredExercises.map(exercise => {
              const getExerciseType = (name) => {
                if (name.includes('啞鈴')) return 'dumbbell';
                if (name.includes('繩索')) return 'cable';
                if (name.includes('槓鈴')) return 'barbell';
                return 'bodyweight';
              };

              const getTypeIcon = (type) => {
                switch(type) {
                case 'dumbbell': return '🏋️';
                case 'cable': return '🔗';
                case 'barbell': return '💪';
                default: return '🤸';
                }
              };

              const exerciseType = getExerciseType(exercise.name);

              return (
                <div key={exercise.id} className="exercise-card">
                  <div className="exercise-header">
                    <div className="exercise-title">
                      <span className="exercise-icon">{getTypeIcon(exerciseType)}</span>
                      <h3>{exercise.name}</h3>
                    </div>
                    {exercise.category && (
                      <span className={`exercise-badge badge-${exercise.category}`}>
                        {exercise.category}
                      </span>
                    )}
                  </div>
                  
                  {exercise.description && (
                    <div className="exercise-description">
                      <p>{exercise.description}</p>
                    </div>
                  )}
                  
                  <div className="exercise-actions">
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleEdit(exercise)}
                    >
                      編輯
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(exercise.id)}
                    >
                      刪除
                    </button>
                  </div>
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
                  <option value="胸部">胸部</option>
                  <option value="背部">背部</option>
                  <option value="腿部">腿部</option>
                  <option value="肩部">肩部</option>
                  <option value="手臂">手臂</option>
                  <option value="核心">核心</option>
                  <option value="有氧">有氧</option>
                  <option value="全身">全身</option>
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