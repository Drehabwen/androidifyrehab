import React, { useEffect, useRef } from 'react';

// 关键点接口
interface Keypoint {
  x: number;
  y: number;
  name: string;
  score?: number; // 置信度
}

// 骨骼连接关系
interface SkeletonConnection {
  from: string;
  to: string;
  color?: string;
}

interface SkeletonVisualizerProps {
  keypoints: Keypoint[];
  imageUrl?: string;
  width?: number;
  height?: number;
  connections?: SkeletonConnection[];
}

// 默认骨骼连接关系（COCO数据集格式）
const DEFAULT_CONNECTIONS: SkeletonConnection[] = [
  // 脸部
  { from: 'nose', to: 'left_eye' },
  { from: 'left_eye', to: 'left_ear' },
  { from: 'nose', to: 'right_eye' },
  { from: 'right_eye', to: 'right_ear' },
  
  // 右臂
  { from: 'right_shoulder', to: 'right_elbow' },
  { from: 'right_elbow', to: 'right_wrist' },
  
  // 左臂
  { from: 'left_shoulder', to: 'left_elbow' },
  { from: 'left_elbow', to: 'left_wrist' },
  
  // 躯干
  { from: 'left_shoulder', to: 'right_shoulder' },
  { from: 'left_shoulder', to: 'left_hip' },
  { from: 'right_shoulder', to: 'right_hip' },
  { from: 'left_hip', to: 'right_hip' },
  
  // 右腿
  { from: 'right_hip', to: 'right_knee' },
  { from: 'right_knee', to: 'right_ankle' },
  
  // 左腿
  { from: 'left_hip', to: 'left_knee' },
  { from: 'left_knee', to: 'left_ankle' },
];

const SkeletonVisualizer: React.FC<SkeletonVisualizerProps> = ({ 
  keypoints, 
  imageUrl, 
  width = 400, 
  height = 300,
  connections = DEFAULT_CONNECTIONS
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制背景图像（如果有）
    if (imageUrl) {
      const background = new Image();
      background.onload = () => {
        // 保持图像比例
        const scale = Math.min(width / background.width, height / background.height);
        const x = (width - background.width * scale) / 2;
        const y = (height - background.height * scale) / 2;
        
        ctx.drawImage(background, x, y, background.width * scale, background.height * scale);
        drawSkeleton(ctx);
      };
      background.src = imageUrl;
    } else {
      drawSkeleton(ctx);
    }

    function drawSkeleton(ctx: CanvasRenderingContext2D) {
      // 绘制骨骼连接线
      connections.forEach(connection => {
        const fromPoint = keypoints.find(kp => kp.name === connection.from);
        const toPoint = keypoints.find(kp => kp.name === connection.to);
        
        if (fromPoint && toPoint && fromPoint.score && toPoint.score && 
            fromPoint.score > 0.3 && toPoint.score > 0.3) {
          // 根据置信度设置线条颜色
          const avgScore = (fromPoint.score + toPoint.score) / 2;
          let color = '#3498db'; // 默认蓝色
          
          if (avgScore < 0.5) {
            color = '#e74c3c'; // 红色表示置信度低
          } else if (avgScore < 0.7) {
            color = '#f39c12'; // 橙色表示置信度中等
          }
          
          ctx.beginPath();
          ctx.moveTo(fromPoint.x * width, fromPoint.y * height);
          ctx.lineTo(toPoint.x * width, toPoint.y * height);
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // 绘制关键点
      keypoints.forEach(keypoint => {
        if (keypoint.score && keypoint.score > 0.3) {
          const x = keypoint.x * width;
          const y = keypoint.y * height;
          
          // 根据置信度设置点的颜色和大小
          let color = '#3498db';
          let radius = 4;
          
          if (keypoint.score < 0.5) {
            color = '#e74c3c';
            radius = 3;
          } else if (keypoint.score < 0.7) {
            color = '#f39c12';
            radius = 3.5;
          }
          
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
          
          // 绘制关键点名称
          ctx.fillStyle = '#000000';
          ctx.font = '10px Arial';
          ctx.fillText(keypoint.name, x + 5, y - 5);
        }
      });
    }
  }, [keypoints, imageUrl, width, height, connections]);

  return (
    <div className="skeleton-visualizer">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-300 rounded-lg"
      />
      <div className="mt-2 text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
            <span>高置信度</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-1"></div>
            <span>中等置信度</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
            <span>低置信度</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonVisualizer;
export type { Keypoint, SkeletonConnection };