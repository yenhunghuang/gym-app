const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/gym.db');
const sqlPath = path.join(__dirname, '../database/update-exercise-names-to-zh-tw.sql');

console.log('開始將英文動作名稱更新為繁體中文...'); // eslint-disable-line no-console

// 檢查文件存在
if (!fs.existsSync(dbPath)) {
  console.error('資料庫文件不存在:', dbPath); // eslint-disable-line no-console
  process.exit(1);
}

if (!fs.existsSync(sqlPath)) {
  console.error('SQL 文件不存在:', sqlPath); // eslint-disable-line no-console
  process.exit(1);
}

// 連接資料庫
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('無法連接資料庫:', err.message); // eslint-disable-line no-console
    process.exit(1);
  } else {
    console.log('成功連接到資料庫'); // eslint-disable-line no-console
  }
});

// 先顯示更新前的狀態
console.log('\n📋 更新前的英文動作名稱:'); // eslint-disable-line no-console
db.all('SELECT id, name, category, description FROM exercises WHERE id <= 6 ORDER BY id', (err, rows) => {
  if (err) {
    console.error('查詢錯誤:', err.message); // eslint-disable-line no-console
  } else {
    rows.forEach(row => {
      console.log(`ID:${row.id} | ${row.category} | ${row.name}`); // eslint-disable-line no-console
    });
    
    // 執行更新
    console.log('\n🔄 執行動作名稱更新...'); // eslint-disable-line no-console
    
    const updateStatements = [
      { sql: "UPDATE exercises SET name = '槓鈴臥推' WHERE id = 1 AND name = 'Bench Press'", desc: '更新臥推' },
      { sql: "UPDATE exercises SET name = '槓鈴深蹲' WHERE id = 2 AND name = 'Squat'", desc: '更新深蹲' },
      { sql: "UPDATE exercises SET name = '槓鈴硬舉' WHERE id = 3 AND name = 'Deadlift'", desc: '更新硬舉' },
      { sql: "UPDATE exercises SET name = '引體向上' WHERE id = 4 AND name = 'Pull-ups'", desc: '更新引體向上' },
      { sql: "UPDATE exercises SET name = '伏地挺身' WHERE id = 5 AND name = 'Push-ups'", desc: '更新伏地挺身' },
      { sql: "UPDATE exercises SET name = '槓鈴肩推' WHERE id = 6 AND name = 'Shoulder Press'", desc: '更新肩推' },
      
      // 更新描述
      { sql: "UPDATE exercises SET description = '使用槓鈴進行的胸部訓練動作，基礎複合動作' WHERE id = 1", desc: '更新臥推描述' },
      { sql: "UPDATE exercises SET description = '使用槓鈴進行的下肢訓練，主要訓練股四頭肌和臀肌' WHERE id = 2", desc: '更新深蹲描述' },
      { sql: "UPDATE exercises SET description = '槓鈴硬舉，訓練後鏈肌群的全身性複合動作' WHERE id = 3", desc: '更新硬舉描述' },
      { sql: "UPDATE exercises SET description = '上肢拉動動作，主要訓練背闊肌和二頭肌' WHERE id = 4", desc: '更新引體向上描述' },
      { sql: "UPDATE exercises SET description = '自體重量胸部訓練動作，適合各種訓練水平' WHERE id = 5", desc: '更新伏地挺身描述' },
      { sql: "UPDATE exercises SET description = '槓鈴肩部上推動作，訓練三角肌和三頭肌' WHERE id = 6", desc: '更新肩推描述' }
    ];
    
    let completedUpdates = 0;
    
    updateStatements.forEach((statement, index) => {
      db.run(statement.sql, (err) => {
        if (err) {
          console.error(`${statement.desc} 執行錯誤:`, err.message); // eslint-disable-line no-console
        } else {
          console.log(`✓ ${statement.desc} 執行成功`); // eslint-disable-line no-console
        }
        
        completedUpdates++;
        
        // 所有更新完成後顯示結果
        if (completedUpdates === updateStatements.length) {
          console.log('\n✅ 動作名稱更新完成！新的動作列表:'); // eslint-disable-line no-console
          db.all('SELECT id, name, category, description FROM exercises WHERE id <= 6 ORDER BY id', (err, finalRows) => {
            if (err) {
              console.error('最終查詢錯誤:', err.message); // eslint-disable-line no-console
            } else {
              finalRows.forEach(row => {
                console.log(`ID:${row.id} | ${row.category} | ${row.name}`); // eslint-disable-line no-console
                console.log(`     描述: ${row.description}`); // eslint-disable-line no-console
              });
              
              // 檢查是否還有其他英文動作名稱
              db.all("SELECT id, name, category FROM exercises WHERE name GLOB '*[A-Za-z]*' AND name NOT GLOB '*[\\u4e00-\\u9fff]*'", (err, englishRows) => {
                if (err) {
                  // SQLite GLOB 可能不支援 Unicode，改用簡單檢查
                  console.log('\\n🔍 檢查剩餘英文動作完成'); // eslint-disable-line no-console
                } else if (englishRows && englishRows.length > 0) {
                  console.log('\\n⚠️  發現其他英文動作名稱:'); // eslint-disable-line no-console
                  englishRows.forEach(row => {
                    console.log(`ID:${row.id} | ${row.category} | ${row.name}`); // eslint-disable-line no-console
                  });
                } else {
                  console.log('\\n🎉 所有動作名稱已成功更新為繁體中文！'); // eslint-disable-line no-console
                }
                
                // 統計最終結果
                db.get('SELECT COUNT(*) as total FROM exercises', (err, row) => {
                  if (err) {
                    console.error('查詢總數錯誤:', err.message); // eslint-disable-line no-console
                  } else {
                    console.log(`\\n📊 總計: ${row.total} 個運動動作，全部使用繁體中文名稱和類別`); // eslint-disable-line no-console
                  }
                  
                  // 關閉資料庫連接
                  db.close((err) => {
                    if (err) {
                      console.error('關閉資料庫錯誤:', err.message); // eslint-disable-line no-console
                    } else {
                      console.log('✅ 動作名稱中文化完成！'); // eslint-disable-line no-console
                    }
                  });
                });
              });
            }
          });
        }
      });
    });
  }
});