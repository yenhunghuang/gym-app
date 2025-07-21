import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav>
      <div className="flex-between">
        <Link to="/" className="logo">
          GymApp
        </Link>
        <ul className="nav">
          <li>
            <Link to="/" className={isActive('/')}>
              首頁
            </Link>
          </li>
          <li>
            <Link to="/users" className={isActive('/users')}>
              使用者管理
            </Link>
          </li>
          <li>
            <Link to="/exercises" className={isActive('/exercises')}>
              運動動作
            </Link>
          </li>
          <li>
            <Link to="/workouts" className={isActive('/workouts')}>
              訓練紀錄
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;