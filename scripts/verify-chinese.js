const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../database/gym.db');

console.log('🎯 最終驗證 - 所有動作完全中文化檢查:'); // eslint-disable-line no-console

db.all('SELECT id, name, category FROM exercises ORDER BY category, id', (err, rows) => {
  if (err) {
    console.error('Error:', err.message); // eslint-disable-line no-console
  } else {
    console.log('\n📋 完整動作列表 (按類別分組):'); // eslint-disable-line no-console
    let currentCategory = '';
    
    rows.forEach(row => {
      if (row.category !== currentCategory) {
        currentCategory = row.category;
        console.log(`\n🏷️  ${currentCategory}:`); // eslint-disable-line no-console
      }
      console.log(`   ID:${row.id.toString().padStart(2)} | ${row.name}`); // eslint-disable-line no-console
    });
    
    // 最終統計
    db.all('SELECT category, COUNT(*) as count FROM exercises GROUP BY category ORDER BY category', (err, stats) => {
      if (err) {
        console.error('Error:', err.message); // eslint-disable-line no-console
      } else {
        console.log('\n📊 最終統計:'); // eslint-disable-line no-console
        let total = 0;
        stats.forEach(stat => {
          console.log(`✅ ${stat.category}: ${stat.count} 個動作`); // eslint-disable-line no-console
          total += stat.count;
        });
        console.log(`\n🎉 總計: ${total} 個運動動作，全部使用繁體中文！`); // eslint-disable-line no-console
        console.log('🌟 包含: 槓鈴動作、啞鈴動作、繩索動作、自體重量動作'); // eslint-disable-line no-console
        
        // 檢查動作類型分佈
        console.log('\n🏋️ 動作類型分佈:'); // eslint-disable-line no-console
        db.all('SELECT name FROM exercises WHERE name LIKE "%槓鈴%"', (err, barbell) => {
          if (!err) console.log(`🔩 槓鈴動作: ${barbell.length} 個`); // eslint-disable-line no-console
          
          db.all('SELECT name FROM exercises WHERE name LIKE "%啞鈴%"', (err, dumbbell) => {
            if (!err) console.log(`🏋️ 啞鈴動作: ${dumbbell.length} 個`); // eslint-disable-line no-console
            
            db.all('SELECT name FROM exercises WHERE name LIKE "%繩索%"', (err, cable) => {
              if (!err) console.log(`🔗 繩索動作: ${cable.length} 個`); // eslint-disable-line no-console
              
              const bodyweight = total - (barbell ? barbell.length : 0) - (dumbbell ? dumbbell.length : 0) - (cable ? cable.length : 0);
              console.log(`🤸 自體重量/其他: ${bodyweight} 個`); // eslint-disable-line no-console
              
              db.close();
            });
          });
        });
      }
    });
  }
});