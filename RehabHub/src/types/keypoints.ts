// 关键点接口
export interface Keypoint {
  x: number;     // 相对于视频宽度的比例值 (0-1)
  y: number;     // 相对于视频高度的比例值 (0-1)
  name: string;  // 关键点名称
  score?: number; // 置信度
}

// 骨骼连接关系
export interface SkeletonConnection {
  from: string;
  to: string;
  color?: string;
}

// 默认骨骼连接关系（COCO数据集格式）
export const DEFAULT_CONNECTIONS: SkeletonConnection[] = [
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