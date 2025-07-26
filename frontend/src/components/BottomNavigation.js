import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '../hooks/useDeviceDetection';

const BottomNavigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  // Don't render on desktop
  if (!isMobile) {
    return null;
  }

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      path: '/',
      icon: '🏠',
      label: '首頁',
      activeIcon: '🏠'
    },
    {
      path: '/workouts',
      icon: '💪',
      label: '訓練',
      activeIcon: '💪'
    },
    {
      path: '/exercises',
      icon: '🏋️',
      label: '動作',
      activeIcon: '🏋️'
    },
    {
      path: '/users',
      icon: '👥',
      label: '用戶',
      activeIcon: '👥'
    }
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`bottom-nav-item ${isActive(item.path) ? 'active' : ''}`}
        >
          <span className="bottom-nav-icon">
            {isActive(item.path) ? item.activeIcon : item.icon}
          </span>
          <span className="bottom-nav-label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNavigation;