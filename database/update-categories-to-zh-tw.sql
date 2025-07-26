-- 統一所有運動動作類別為繁體中文
-- 將英文類別更新為繁體中文

-- 更新英文類別為繁體中文
UPDATE exercises SET category = '胸部' WHERE category = 'Chest';
UPDATE exercises SET category = '背部' WHERE category = 'Back';
UPDATE exercises SET category = '腿部' WHERE category = 'Legs';
UPDATE exercises SET category = '肩部' WHERE category = 'Shoulders';
UPDATE exercises SET category = '手臂' WHERE category = 'Arms';
UPDATE exercises SET category = '核心' WHERE category = 'Core';
UPDATE exercises SET category = '有氧' WHERE category = 'Cardio';

-- 檢查更新結果
SELECT '更新完成後的類別分佈:' as message;
SELECT category, COUNT(*) as count FROM exercises GROUP BY category ORDER BY category;