import React, { useState, useEffect } from 'react';

const ProgressChart = ({ data, type = 'weight', title = '進度圖表', height = '300px' }) => {
  const [chartData, setChartData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('30'); // 30天、90天、365天
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, data: null });

  useEffect(() => {
    if (data && data.length > 0) {
      processChartData(data);
    } else {
      setChartData([]);
    }
  }, [data, selectedPeriod, type]);

  const processChartData = (rawData) => {
    const days = parseInt(selectedPeriod);
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999); // 設置為一天的結束
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0); // 設置為一天的開始

    // 過濾並處理數據
    const filteredData = rawData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });

    // 按日期分組並計算每日數據
    const groupedByDate = filteredData.reduce((acc, item) => {
      const dateKey = item.date;
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(item);
      return acc;
    }, {});

    // 生成圖表數據點
    const chartPoints = [];
    for (let i = 0; i < days; i++) {
      const currentDate = new Date();
      currentDate.setDate(endDate.getDate() - (days - 1 - i));
      const dateKey = currentDate.toISOString().split('T')[0];
      
      const dayData = groupedByDate[dateKey] || [];
      let value = 0;

      if (type === 'weight') {
        // 計算當日總重量
        value = dayData.reduce((sum, workout) => {
          if (workout.exercises && Array.isArray(workout.exercises)) {
            return sum + workout.exercises.reduce((exerciseSum, exercise) => {
              const weight = parseFloat(exercise.weight) || 0;
              const sets = parseInt(exercise.sets) || 0;
              const reps = parseInt(exercise.reps) || 0;
              return exerciseSum + (weight * sets * reps);
            }, 0);
          }
          return sum;
        }, 0);
      } else if (type === 'workouts') {
        // 計算當日訓練次數
        value = dayData.length;
      } else if (type === 'exercises') {
        // 計算當日動作總數
        value = dayData.reduce((sum, workout) => {
          return sum + (workout.exercises && Array.isArray(workout.exercises) ? workout.exercises.length : 0);
        }, 0);
      }

      chartPoints.push({
        date: dateKey,
        value: value,
        label: formatDateLabel(currentDate),
        workouts: dayData.length
      });
    }

    setChartData(chartPoints);
  };

  const formatDateLabel = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  };

  const getMaxValue = () => {
    return Math.max(...chartData.map(point => point.value), 1);
  };

  const getYAxisLabels = () => {
    const max = getMaxValue();
    if (max === 0) return [0];
    
    let step;
    if (max <= 10) {
      step = Math.ceil(max / 5);
    } else if (max <= 100) {
      step = Math.ceil(max / 10) * 2;
    } else {
      step = Math.ceil(max / 100) * 20;
    }
    
    const labels = [];
    for (let i = 0; i <= 5; i++) {
      labels.push(i * step);
    }
    return labels.reverse();
  };

  const formatValue = (value, showUnit = true) => {
    const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
    if (type === 'weight') {
      return showUnit ? `${numValue.toFixed(0)}kg` : numValue.toFixed(0);
    } else if (type === 'workouts') {
      return showUnit ? `${numValue}次` : numValue.toString();
    } else if (type === 'exercises') {
      return showUnit ? `${numValue}個` : numValue.toString();
    }
    return numValue.toString();
  };

  const getColor = () => {
    switch (type) {
    case 'weight': return '#007bff';
    case 'workouts': return '#28a745';
    case 'exercises': return '#ffc107';
    default: return '#007bff';
    }
  };

  // 生成SVG路徑
  const generatePath = () => {
    if (chartData.length === 0) return '';

    const maxValue = getMaxValue();
    const width = 100; // 百分比寬度
    const height = 100; // 百分比高度
    const padding = 5;

    let path = '';
    
    chartData.forEach((point, index) => {
      const x = padding + (index / (chartData.length - 1)) * (width - 2 * padding);
      const y = height - padding - (point.value / maxValue) * (height - 2 * padding);
      
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });

    return path;
  };

  // 生成面積填充路徑
  const generateAreaPath = () => {
    const linePath = generatePath();
    if (!linePath) return '';

    const width = 100;
    const height = 100;
    const padding = 5;
    
    const firstX = padding;
    const lastX = padding + ((chartData.length - 1) / (chartData.length - 1)) * (width - 2 * padding);
    const bottomY = height - padding;

    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  if (!data || data.length === 0) {
    return (
      <div className="progress-chart">
        <div className="chart-header">
          <h3>{title}</h3>
        </div>
        <div className="chart-no-data">
          <p>暫無數據</p>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-chart">
      <div className="chart-header">
        <h3>{title}</h3>
        <div className="chart-period-selector">
          <button 
            className={`period-btn ${selectedPeriod === '7' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('7')}
          >
            7天
          </button>
          <button 
            className={`period-btn ${selectedPeriod === '30' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('30')}
          >
            30天
          </button>
          <button 
            className={`period-btn ${selectedPeriod === '90' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('90')}
          >
            90天
          </button>
        </div>
      </div>

      <div className="chart-container" style={{ height }}>
        <div className="chart-y-axis">
          {getYAxisLabels().map((label, index) => (
            <div key={index} className="y-axis-label">
              {formatValue(label)}
            </div>
          ))}
        </div>

        <div className="chart-content">
          <svg viewBox="0 0 100 100" className="chart-svg">
            {/* 網格線 */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e9ecef" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" opacity="0.3"/>

            {/* 面積填充 */}
            <path
              d={generateAreaPath()}
              fill={getColor()}
              fillOpacity="0.1"
            />

            {/* 線條 */}
            <path
              d={generatePath()}
              fill="none"
              stroke={getColor()}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* 數據點 */}
            {chartData.map((point, index) => {
              const maxValue = getMaxValue();
              const x = 5 + (index / Math.max(chartData.length - 1, 1)) * 90;
              const y = maxValue > 0 ? 95 - (point.value / maxValue) * 90 : 95;
              
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r={hoveredPoint === index ? '4' : '3'}
                  fill={getColor()}
                  className="chart-point"
                  data-value={point.value}
                  data-date={point.label}
                  onMouseEnter={(e) => {
                    setHoveredPoint(index);
                    const rect = e.target.closest('svg').getBoundingClientRect();
                    setTooltip({
                      show: true,
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top - 10,
                      data: point
                    });
                  }}
                  onMouseLeave={() => {
                    setHoveredPoint(null);
                    setTooltip({ show: false, x: 0, y: 0, data: null });
                  }}
                  style={{ cursor: 'pointer' }}
                />
              );
            })}
          </svg>

          {/* X軸標籤 */}
          <div className="chart-x-axis">
            {chartData.map((point, index) => {
              // 根據時間範圍調整標籤顯示
              let shouldShow = false;
              const totalPoints = chartData.length;
              
              if (selectedPeriod === '7') {
                shouldShow = true; // 7天顯示所有標籤
              } else if (selectedPeriod === '30') {
                shouldShow = index % Math.ceil(totalPoints / 6) === 0 || index === totalPoints - 1;
              } else {
                shouldShow = index % Math.ceil(totalPoints / 5) === 0 || index === totalPoints - 1;
              }
              
              return shouldShow ? (
                <div key={index} className="x-axis-label" style={{
                  left: `${5 + (index / Math.max(chartData.length - 1, 1)) * 90}%`
                }}>
                  {point.label}
                </div>
              ) : null;
            })}
          </div>
          
          {/* 工具提示 */}
          {tooltip.show && tooltip.data && (
            <div 
              className="chart-tooltip"
              style={{
                position: 'absolute',
                left: tooltip.x,
                top: tooltip.y,
                transform: 'translateX(-50%)',
                background: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '0.875rem',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                zIndex: 1000
              }}
            >
              <div>{tooltip.data.label}</div>
              <div style={{ fontWeight: 'bold' }}>
                {formatValue(tooltip.data.value)}
              </div>
              {tooltip.data.workouts > 0 && (
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                  {tooltip.data.workouts}次訓練
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 統計摘要 */}
      <div className="chart-summary">
        <div className="summary-item">
          <span className="summary-label">最高值</span>
          <span className="summary-value">{formatValue(Math.max(...chartData.map(p => p.value)))}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">平均值</span>
          <span className="summary-value">
            {chartData.length > 0 ? formatValue(chartData.reduce((sum, p) => sum + p.value, 0) / chartData.length) : formatValue(0)}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">訓練天數</span>
          <span className="summary-value">{chartData.filter(p => p.workouts > 0).length}天</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;