const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/gym.db');
const sqlPath = path.join(__dirname, '../database/add-dumbbell-cable-exercises.sql');

console.log('開始添加啞鈴和繩索運動動作...'); // eslint-disable-line no-console

// 檢查資料庫文件是否存在
if (!fs.existsSync(dbPath)) {
  console.error('資料庫文件不存在:', dbPath); // eslint-disable-line no-console
  process.exit(1);
}

// 檢查 SQL 文件是否存在
if (!fs.existsSync(sqlPath)) {
  console.error('SQL 文件不存在:', sqlPath); // eslint-disable-line no-console
  process.exit(1);
}

// 讀取 SQL 文件內容
const sql = fs.readFileSync(sqlPath, 'utf8');

// 連接資料庫並執行 SQL
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('無法連接資料庫:', err.message); // eslint-disable-line no-console
    process.exit(1);
  } else {
    console.log('成功連接到資料庫'); // eslint-disable-line no-console
  }
});

// 執行 SQL 指令
db.exec(sql, (err) => {
  if (err) {
    console.error('執行 SQL 時發生錯誤:', err.message); // eslint-disable-line no-console
  } else {
    console.log('成功添加啞鈴和繩索運動動作！'); // eslint-disable-line no-console
    
    // 查詢並顯示添加的動作數量
    db.all('SELECT category, COUNT(*) as count FROM exercises GROUP BY category ORDER BY category', (err, rows) => {
      if (err) {
        console.error('查詢錯誤:', err.message); // eslint-disable-line no-console
      } else {
        console.log('\n各類別動作統計:'); // eslint-disable-line no-console
        rows.forEach(row => {
          console.log(`${row.category}: ${row.count} 個動作`); // eslint-disable-line no-console
        });
        
        // 查詢總動作數
        db.get('SELECT COUNT(*) as total FROM exercises', (err, row) => {
          if (err) {
            console.error('查詢總數錯誤:', err.message); // eslint-disable-line no-console
          } else {
            console.log(`\n總共: ${row.total} 個運動動作`); // eslint-disable-line no-console
          }
          
          // 關閉資料庫連接
          db.close((err) => {
            if (err) {
              console.error('關閉資料庫錯誤:', err.message); // eslint-disable-line no-console
            } else {
              console.log('資料庫連接已關閉'); // eslint-disable-line no-console
            }
          });
        });
      }
    });
  }
});