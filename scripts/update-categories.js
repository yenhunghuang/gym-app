const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/gym.db');
const sqlPath = path.join(__dirname, '../database/update-categories-to-zh-tw.sql');

console.log('開始統一運動動作類別為繁體中文...'); // eslint-disable-line no-console

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

// 先顯示更新前的狀態
console.log('更新前的類別分佈:'); // eslint-disable-line no-console
db.all('SELECT category, COUNT(*) as count FROM exercises GROUP BY category ORDER BY category', (err, rows) => {
  if (err) {
    console.error('查詢錯誤:', err.message); // eslint-disable-line no-console
  } else {
    rows.forEach(row => {
      console.log(`${row.category}: ${row.count} 個動作`); // eslint-disable-line no-console
    });
    
    // 執行更新
    console.log('\n執行類別統一更新...'); // eslint-disable-line no-console
    
    // 分別執行每個更新語句
    const updateStatements = [
      "UPDATE exercises SET category = '胸部' WHERE category = 'Chest'",
      "UPDATE exercises SET category = '背部' WHERE category = 'Back'", 
      "UPDATE exercises SET category = '腿部' WHERE category = 'Legs'",
      "UPDATE exercises SET category = '肩部' WHERE category = 'Shoulders'",
      "UPDATE exercises SET category = '手臂' WHERE category = 'Arms'",
      "UPDATE exercises SET category = '核心' WHERE category = 'Core'",
      "UPDATE exercises SET category = '有氧' WHERE category = 'Cardio'"
    ];
    
    let completedUpdates = 0;
    
    updateStatements.forEach((statement, index) => {
      db.run(statement, (err) => {
        if (err) {
          console.error(`更新語句 ${index + 1} 執行錯誤:`, err.message); // eslint-disable-line no-console
        } else {
          console.log(`✓ 更新語句 ${index + 1} 執行成功`); // eslint-disable-line no-console
        }
        
        completedUpdates++;
        
        // 所有更新完成後顯示結果
        if (completedUpdates === updateStatements.length) {
          console.log('\n更新完成！新的類別分佈:'); // eslint-disable-line no-console
          db.all('SELECT category, COUNT(*) as count FROM exercises GROUP BY category ORDER BY category', (err, finalRows) => {
            if (err) {
              console.error('最終查詢錯誤:', err.message); // eslint-disable-line no-console
            } else {
              finalRows.forEach(row => {
                console.log(`${row.category}: ${row.count} 個動作`); // eslint-disable-line no-console
              });
              
              // 查詢總動作數
              db.get('SELECT COUNT(*) as total FROM exercises', (err, row) => {
                if (err) {
                  console.error('查詢總數錯誤:', err.message); // eslint-disable-line no-console
                } else {
                  console.log(`\n總共: ${row.total} 個運動動作`); // eslint-disable-line no-console
                  console.log('類別統一完成！所有動作類別已更新為繁體中文。'); // eslint-disable-line no-console
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
    });
  }
});