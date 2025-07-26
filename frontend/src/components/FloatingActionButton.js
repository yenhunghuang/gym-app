import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '../hooks/useDeviceDetection';

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  // 只在特定頁面和移動設備顯示FAB
  const shouldShowFAB = ['/workouts', '/', '/users', '/exercises'].includes(location.pathname) && isMobile;

  if (!shouldShowFAB) return null;

  const quickActions = [
    {
      icon: '💪',
      label: '快速訓練',
      action: () => {
        navigate('/workouts');
        // 觸發WorkoutsPage的新增模態框
        const event = new CustomEvent('openWorkoutModal');
        window.dispatchEvent(event);
        setIsOpen(false);
      }
    },
    {
      icon: '👥',
      label: '新增用戶',
      action: () => {
        navigate('/users');
        // 觸發UsersPage的新增模態框
        const event = new CustomEvent('openUserModal');
        window.dispatchEvent(event);
        setIsOpen(false);
      }
    },
    {
      icon: '🏋️',
      label: '新增動作',
      action: () => {
        navigate('/exercises');
        // 觸發ExercisesPage的新增模態框
        const event = new CustomEvent('openExerciseModal');
        window.dispatchEvent(event);
        setIsOpen(false);
      }
    }
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fab-backdrop" 
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Quick Actions */}
      {isOpen && (
        <div className="fab-actions">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="fab-action-item"
              onClick={action.action}
              style={{ 
                animationDelay: `${index * 50}ms` 
              }}
            >
              <span className="fab-action-icon">{action.icon}</span>
              <span className="fab-action-label">{action.label}</span>
            </button>
          ))}
        </div>
      )}
      
      {/* Main FAB */}
      <button
        className={`fab ${isOpen ? 'fab-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? '關閉快速操作' : '開啟快速操作'}
      >
        <span className="fab-icon">
          {isOpen ? '✕' : '+'}
        </span>
      </button>
    </>
  );
};

export default FloatingActionButton;