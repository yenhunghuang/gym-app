import React, { useState, useEffect } from 'react';

const ProgressChart = ({ data, type = 'weight', title = '進度圖表', height = '300px' }) => {
  const [chartData, setChartData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('30'); // 30天、90天、365天

  useEffect(() => {
    if (data && data.length > 0) {
      processChartData(data);
    }
  }, [data, selectedPeriod]);

  const processChartData = (rawData) => {
    const days = parseInt(selectedPeriod);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

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
          if (workout.exercises) {
            return sum + workout.exercises.reduce((exerciseSum, exercise) => {
              return exerciseSum + (exercise.weight * exercise.sets * exercise.reps || 0);
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
          return sum + (workout.exercises ? workout.exercises.length : 0);
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
    const step = Math.ceil(max / 5);
    const labels = [];
    for (let i = 0; i <= 5; i++) {
      labels.push(i * step);
    }
    return labels.reverse();
  };

  const formatValue = (value) => {
    if (type === 'weight') {
      return `${value.toFixed(0)}kg`;
    } else if (type === 'workouts') {
      return `${value}次`;
    } else if (type === 'exercises') {
      return `${value}個`;
    }
    return value.toString();
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
              const x = 5 + (index / (chartData.length - 1)) * 90;
              const y = 95 - (point.value / maxValue) * 90;
              
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="2"
                  fill={getColor()}
                  className="chart-point"
                  data-value={point.value}
                  data-date={point.label}
                />
              );
            })}
          </svg>

          {/* X軸標籤 */}
          <div className="chart-x-axis">
            {chartData.map((point, index) => {
              // 只顯示部分標籤以避免擁擠
              const shouldShow = index % Math.ceil(chartData.length / 5) === 0 || index === chartData.length - 1;
              return shouldShow ? (
                <div key={index} className="x-axis-label" style={{
                  left: `${5 + (index / (chartData.length - 1)) * 90}%`
                }}>
                  {point.label}
                </div>
              ) : null;
            })}
          </div>
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
            {formatValue(chartData.reduce((sum, p) => sum + p.value, 0) / chartData.length)}
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