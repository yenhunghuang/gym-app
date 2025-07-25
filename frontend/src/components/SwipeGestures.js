import React, { useEffect, useRef } from 'react';

const SwipeGestures = ({ onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onPullToRefresh, children, className = '' }) => {
  const elementRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const touchMoveRef = useRef({ x: 0, y: 0 });
  const isPullingRef = useRef(false);
  const pullIndicatorRef = useRef(null);

  const SWIPE_THRESHOLD = 50; // 滑動距離閾值
  const SWIPE_TIME_THRESHOLD = 300; // 滑動時間閾值（毫秒）
  const PULL_THRESHOLD = 80; // 下拉刷新閾值

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let isScrollAtTop = true;

    // 檢查是否滾動到頂部
    const checkScrollPosition = () => {
      isScrollAtTop = element.scrollTop <= 0;
    };

    // 觸摸開始
    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };
      
      checkScrollPosition();
      
      // 如果在頂部且有下拉刷新功能，準備顯示指示器
      if (isScrollAtTop && onPullToRefresh) {
        isPullingRef.current = true;
      }
    };

    // 觸摸移動
    const handleTouchMove = (e) => {
      if (!touchStartRef.current) return;

      const touch = e.touches[0];
      touchMoveRef.current = {
        x: touch.clientX,
        y: touch.clientY
      };

      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;

      // 下拉刷新邏輯
      if (isPullingRef.current && isScrollAtTop && deltaY > 0 && Math.abs(deltaX) < 50) {
        e.preventDefault();
        
        // 更新下拉指示器
        if (pullIndicatorRef.current) {
          const pullDistance = Math.min(deltaY, PULL_THRESHOLD * 1.5);
          const opacity = Math.min(pullDistance / PULL_THRESHOLD, 1);
          const rotation = (pullDistance / PULL_THRESHOLD) * 180;
          
          pullIndicatorRef.current.style.transform = `translateY(${pullDistance}px) rotate(${rotation}deg)`;
          pullIndicatorRef.current.style.opacity = opacity;
          
          if (pullDistance >= PULL_THRESHOLD) {
            pullIndicatorRef.current.classList.add('ready');
          } else {
            pullIndicatorRef.current.classList.remove('ready');
          }
        }
      }
    };

    // 觸摸結束
    const handleTouchEnd = () => {
      if (!touchStartRef.current || !touchMoveRef.current) {
        resetPullIndicator();
        return;
      }

      const deltaX = touchMoveRef.current.x - touchStartRef.current.x;
      const deltaY = touchMoveRef.current.y - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // 檢查下拉刷新
      if (isPullingRef.current && deltaY >= PULL_THRESHOLD && Math.abs(deltaX) < 50) {
        if (onPullToRefresh) {
          onPullToRefresh();
          showRefreshFeedback();
        }
        resetPullIndicator();
        return;
      }

      // 檢查滑動手勢
      if (distance >= SWIPE_THRESHOLD && deltaTime <= SWIPE_TIME_THRESHOLD) {
        const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
        
        if (isHorizontal) {
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight();
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft();
          }
        } else {
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown();
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp();
          }
        }
      }

      resetPullIndicator();
    };

    // 重置下拉指示器
    const resetPullIndicator = () => {
      isPullingRef.current = false;
      if (pullIndicatorRef.current) {
        pullIndicatorRef.current.style.transform = 'translateY(-100%) rotate(0deg)';
        pullIndicatorRef.current.style.opacity = '0';
        pullIndicatorRef.current.classList.remove('ready');
      }
    };

    // 顯示刷新反饋
    const showRefreshFeedback = () => {
      if (pullIndicatorRef.current) {
        pullIndicatorRef.current.innerHTML = '🔄';
        pullIndicatorRef.current.style.animation = 'spin 1s linear infinite';
        
        setTimeout(() => {
          if (pullIndicatorRef.current) {
            pullIndicatorRef.current.innerHTML = '↓';
            pullIndicatorRef.current.style.animation = 'none';
          }
        }, 1000);
      }
    };

    // 滾動事件監聽
    element.addEventListener('scroll', checkScrollPosition);
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);

    // 清理函數
    return () => {
      element.removeEventListener('scroll', checkScrollPosition);
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onPullToRefresh]);

  return (
    <div 
      ref={elementRef}
      className={`swipe-container ${className}`}
      style={{ position: 'relative', overflow: 'auto', height: '100%' }}
    >
      {/* 下拉刷新指示器 */}
      {onPullToRefresh && (
        <div 
          ref={pullIndicatorRef}
          className="pull-indicator"
          style={{
            position: 'absolute',
            top: '-40px',
            left: '50%',
            transform: 'translateX(-50%) translateY(-100%)',
            width: '40px',
            height: '40px',
            background: '#007bff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px',
            opacity: 0,
            transition: 'background-color 0.3s ease',
            zIndex: 1000
          }}
        >
          ↓
        </div>
      )}
      
      {children}
    </div>
  );
};

// 高階組件：為列表項添加滑動刪除功能
export const SwipeToDelete = ({ onDelete, children, deleteText = '刪除', className = '' }) => {
  const itemRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const currentTranslateRef = useRef(0);
  const deleteActionRef = useRef(null);

  const SWIPE_DELETE_THRESHOLD = 80;

  useEffect(() => {
    const element = itemRef.current;
    if (!element) return;

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY
      };
    };

    const handleTouchMove = (e) => {
      if (!touchStartRef.current) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;

      // 只處理水平滑動
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        e.preventDefault();
        
        // 只允許向左滑動
        if (deltaX < 0) {
          const translateX = Math.max(deltaX, -120);
          currentTranslateRef.current = translateX;
          
          element.style.transform = `translateX(${translateX}px)`;
          
          // 顯示刪除按鈕
          if (deleteActionRef.current) {
            const opacity = Math.min(Math.abs(translateX) / SWIPE_DELETE_THRESHOLD, 1);
            deleteActionRef.current.style.opacity = opacity;
            
            if (Math.abs(translateX) >= SWIPE_DELETE_THRESHOLD) {
              deleteActionRef.current.classList.add('ready');
            } else {
              deleteActionRef.current.classList.remove('ready');
            }
          }
        }
      }
    };

    const handleTouchEnd = () => {
      const translateX = currentTranslateRef.current;
      
      if (Math.abs(translateX) >= SWIPE_DELETE_THRESHOLD) {
        // 觸發刪除
        if (onDelete) {
          onDelete();
        }
      }
      
      // 重置位置
      element.style.transform = 'translateX(0)';
      currentTranslateRef.current = 0;
      
      if (deleteActionRef.current) {
        deleteActionRef.current.style.opacity = '0';
        deleteActionRef.current.classList.remove('ready');
      }
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onDelete]);

  return (
    <div className={`swipe-delete-container ${className}`} style={{ position: 'relative', overflow: 'hidden' }}>
      <div 
        ref={itemRef}
        className="swipe-delete-item"
        style={{ 
          position: 'relative',
          transition: 'transform 0.3s ease',
          background: 'white',
          zIndex: 2
        }}
      >
        {children}
      </div>
      
      {/* 刪除按鈕 */}
      <div 
        ref={deleteActionRef}
        className="delete-action"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '120px',
          background: '#dc3545',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          opacity: 0,
          zIndex: 1,
          transition: 'background-color 0.3s ease'
        }}
      >
        🗑️ {deleteText}
      </div>
    </div>
  );
};

export default SwipeGestures;