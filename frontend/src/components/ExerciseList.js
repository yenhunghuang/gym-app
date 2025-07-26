import React, { useState, useEffect } from 'react';
import { getExercises } from '../services/api';

const ExerciseList = ({ selectedExerciseId, onExerciseSelect }) => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const categories = [...new Set(exercises.map(ex => ex.category).filter(Boolean))].sort();
  const filteredExercises = selectedCategory 
    ? exercises.filter(ex => ex.category === selectedCategory)
    : exercises;

  if (loading) return <div className="loading">Loading exercises...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
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
      
      <div className="form-group">
        <label>選擇運動:</label>
        <select
          value={selectedExerciseId || ''}
          onChange={(e) => onExerciseSelect(e.target.value)}
        >
          <option value="">請選擇運動</option>
          {filteredExercises.map(exercise => (
            <option key={exercise.id} value={exercise.id}>
              {exercise.name} {exercise.category && `(${exercise.category})`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ExerciseList;