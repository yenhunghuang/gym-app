-- 將英文動作名稱更新為繁體中文
-- 更新原始的6個基礎動作名稱

UPDATE exercises SET name = '槓鈴臥推' WHERE id = 1 AND name = 'Bench Press';
UPDATE exercises SET name = '槓鈴深蹲' WHERE id = 2 AND name = 'Squat';
UPDATE exercises SET name = '槓鈴硬舉' WHERE id = 3 AND name = 'Deadlift';
UPDATE exercises SET name = '引體向上' WHERE id = 4 AND name = 'Pull-ups';
UPDATE exercises SET name = '伏地挺身' WHERE id = 5 AND name = 'Push-ups';
UPDATE exercises SET name = '槓鈴肩推' WHERE id = 6 AND name = 'Shoulder Press';

-- 同時更新描述為繁體中文
UPDATE exercises SET description = '使用槓鈴進行的胸部訓練動作，基礎複合動作' WHERE id = 1;
UPDATE exercises SET description = '使用槓鈴進行的下肢訓練，主要訓練股四頭肌和臀肌' WHERE id = 2;
UPDATE exercises SET description = '槓鈴硬舉，訓練後鏈肌群的全身性複合動作' WHERE id = 3;
UPDATE exercises SET description = '上肢拉動動作，主要訓練背闊肌和二頭肌' WHERE id = 4;
UPDATE exercises SET description = '自體重量胸部訓練動作，適合各種訓練水平' WHERE id = 5;
UPDATE exercises SET description = '槓鈴肩部上推動作，訓練三角肌和三頭肌' WHERE id = 6;

-- 檢查更新結果
SELECT '動作名稱更新完成後:' as message;
SELECT id, name, category, description FROM exercises WHERE id <= 6 ORDER BY id;