const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// 中间件
app.use(cors());
app.use(express.json());

// 配置文件上传
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 模拟姿态估计数据
const generateMockKeypoints = () => {
  const keypoints = [
    { name: 'nose', x: 320, y: 120, score: 0.9 },
    { name: 'left_eye', x: 300, y: 110, score: 0.85 },
    { name: 'right_eye', x: 340, y: 110, score: 0.85 },
    { name: 'left_ear', x: 280, y: 120, score: 0.8 },
    { name: 'right_ear', x: 360, y: 120, score: 0.8 },
    { name: 'left_shoulder', x: 250, y: 200, score: 0.85 },
    { name: 'right_shoulder', x: 390, y: 200, score: 0.85 },
    { name: 'left_elbow', x: 220, y: 280, score: 0.8 },
    { name: 'right_elbow', x: 420, y: 280, score: 0.8 },
    { name: 'left_wrist', x: 200, y: 350, score: 0.75 },
    { name: 'right_wrist', x: 440, y: 350, score: 0.75 },
    { name: 'left_hip', x: 270, y: 320, score: 0.85 },
    { name: 'right_hip', x: 370, y: 320, score: 0.85 },
    { name: 'left_knee', x: 260, y: 420, score: 0.8 },
    { name: 'right_knee', x: 380, y: 420, score: 0.8 },
    { name: 'left_ankle', x: 250, y: 500, score: 0.75 },
    { name: 'right_ankle', x: 390, y: 500, score: 0.75 }
  ];

  // 添加一些随机变化，使关键点看起来更自然
  return keypoints.map(kp => ({
    ...kp,
    x: kp.x + (Math.random() - 0.5) * 10,
    y: kp.y + (Math.random() - 0.5) * 10,
    score: Math.max(0.5, Math.min(1.0, kp.score + (Math.random() - 0.5) * 0.2))
  }));
};

// API路由
app.post('/analyze', upload.single('file'), (req, res) => {
  // 模拟处理延迟
  setTimeout(() => {
    const mockResponse = {
      score: Math.random() * 0.5 + 0.5, // 0.5-1.0之间的随机分数
      feedback: "动作完成良好，继续保持",
      reason: "关节活动度正常，动作稳定性良好",
      angles: {
        left_elbow: Math.floor(Math.random() * 30 + 150), // 150-180度
        right_elbow: Math.floor(Math.random() * 30 + 150),
        left_knee: Math.floor(Math.random() * 30 + 150),
        right_knee: Math.floor(Math.random() * 30 + 150),
        left_shoulder: Math.floor(Math.random() * 30 + 150),
        right_shoulder: Math.floor(Math.random() * 30 + 150)
      },
      processing_time: "0.5s",
      keypoints_detected: true,
      annotated_image: "",
      details: {},
      timestamp: new Date().toISOString(),
      keypoints: generateMockKeypoints()
    };

    res.json(mockResponse);
  }, 300); // 模拟300ms的处理延迟
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`模拟API服务器运行在 http://localhost:${PORT}`);
  console.log('健康检查端点: http://localhost:' + PORT + '/health');
  console.log('分析端点: http://localhost:' + PORT + '/analyze');
});

module.exports = app;