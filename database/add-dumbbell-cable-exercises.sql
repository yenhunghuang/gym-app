-- 添加啞鈴和繩索類運動動作
-- Dumbbell Exercises (啞鈴動作)

-- 啞鈴胸部動作
INSERT INTO exercises (name, category, description) VALUES 
('啞鈴平板臥推', '胸部', '使用啞鈴進行的胸部訓練，可以增加動作幅度和穩定性要求'),
('啞鈴上斜臥推', '胸部', '針對上胸的啞鈴訓練動作，角度約30-45度'),
('啞鈴下斜臥推', '胸部', '針對下胸的啞鈴訓練動作，可更好雕塑胸部線條'),
('啞鈴飛鳥', '胸部', '胸部孤立動作，專注於胸大肌的拉伸和收縮'),
('啞鈴上斜飛鳥', '胸部', '針對上胸的孤立動作，增加上胸厚度'),

-- 啞鈴背部動作
('啞鈴划船', '背部', '單臂或雙臂啞鈴划船，訓練背闊肌和菱形肌'),
('啞鈴俯身划船', '背部', '俯身姿勢進行的啞鈴划船，增強背部厚度'),
('啞鈴反向飛鳥', '背部', '訓練後三角肌和菱形肌的孤立動作'),
('啞鈴聳肩', '背部', '專門訓練斜方肌上束的動作'),
('啞鈴硬舉', '背部', '啞鈴版本的硬舉，訓練整個後鏈肌群'),

-- 啞鈴肩部動作
('啞鈴肩上推舉', '肩部', '坐姿或站姿啞鈴肩部推舉，全面發展三角肌'),
('啞鈴側平舉', '肩部', '訓練三角肌中束的經典孤立動作'),
('啞鈴前平舉', '肩部', '專門訓練三角肌前束的動作'),
('啞鈴後束飛鳥', '肩部', '訓練三角肌後束，改善肩部圓潤度'),
('啞鈴阿諾推舉', '肩部', '結合旋轉的肩部推舉動作，全面刺激三角肌'),

-- 啞鈴手臂動作
('啞鈴二頭彎舉', '手臂', '經典的二頭肌訓練動作'),
('啞鈴錘式彎舉', '手臂', '中性握法的彎舉，同時訓練二頭肌和前臂'),
('啞鈴集中彎舉', '手臂', '坐姿單臂彎舉，最大化二頭肌孤立'),
('啞鈴三頭臂屈伸', '手臂', '仰臥或坐姿進行的三頭肌訓練'),
('啞鈴頸後臂屈伸', '手臂', '單臂或雙臂的三頭肌深度拉伸動作'),

-- 啞鈴腿部動作
('啞鈴深蹲', '腿部', '手持啞鈴進行的深蹲動作'),
('啞鈴弓箭步', '腿部', '單腿訓練動作，提高平衡和協調性'),
('啞鈴保加利亞深蹲', '腿部', '後腳抬高的單腿深蹲變化'),
('啞鈴羅馬尼亞硬舉', '腿部', '主要訓練臀部和膕繩肌的動作'),
('啞鈴提踵', '腿部', '訓練小腿肌群的動作'),

-- 繩索動作 (Cable Exercises)

-- 繩索胸部動作
('繩索夾胸', '胸部', '使用繩索機進行的胸部孤立訓練'),
('繩索上斜夾胸', '胸部', '高位繩索夾胸，針對上胸訓練'),
('繩索下斜夾胸', '胸部', '低位繩索夾胸，針對下胸訓練'),
('繩索十字夾胸', '胸部', '交叉繩索夾胸，增加動作幅度'),

-- 繩索背部動作
('繩索下拉', '背部', '高位下拉動作，主要訓練背闊肌'),
('繩索坐姿划船', '背部', '水平拉動作，訓練中背部肌群'),
('繩索面拉', '背部', '繩索面部拉動，訓練後三角肌和菱形肌'),
('繩索直臂下拉', '背部', '孤立背闊肌的動作'),
('繩索Y字拉', '背部', 'Y字軌跡的拉動作，訓練下斜方肌'),

-- 繩索肩部動作
('繩索側平舉', '肩部', '使用繩索進行的側平舉動作'),
('繩索前平舉', '肩部', '繩索前平舉，持續張力訓練'),
('繩索後束飛鳥', '肩部', '繩索版本的後三角肌訓練'),
('繩索立正划船', '肩部', '窄握高拉動作，訓練三角肌和斜方肌'),

-- 繩索手臂動作
('繩索二頭彎舉', '手臂', '低位繩索二頭肌彎舉'),
('繩索錘式彎舉', '手臂', '使用繩索手柄的錘式彎舉'),
('繩索三頭下壓', '手臂', '經典的三頭肌繩索訓練動作'),
('繩索頸後臂屈伸', '手臂', '繩索版本的三頭肌拉伸動作'),
('繩索21響禮炮', '手臂', '結合部分動作和全程動作的二頭肌訓練'),

-- 繩索腿部動作
('繩索腿彎舉', '腿部', '俯臥或站立繩索腿彎舉'),
('繩索腿外展', '腿部', '側面繩索腿部外展動作'),
('繩索腿內收', '腿部', '繩索腿部內收動作'),
('繩索直腿硬舉', '腿部', '繩索版本的直腿硬舉'),

-- 繩索核心動作
('繩索卷腹', '核心', '高位繩索腹部卷腹動作'),
('繩索側彎', '核心', '繩索側腹訓練動作'),
('繩索木砍', '核心', '對角線繩索核心訓練動作'),
('繩索俄羅斯轉體', '核心', '坐姿繩索核心旋轉動作');