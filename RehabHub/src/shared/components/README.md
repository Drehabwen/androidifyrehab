# 共享组件使用说明

本文档介绍了在DeepRehab视频评估系统中可用的共享组件。

## 1. AngleCalculator（关节角度计算组件）

用于计算人体关节角度的工具组件。

### 使用方法

```typescript
import { calculateAngle, type Keypoint, type AngleResult } from './AngleCalculator';

const point1: Keypoint = { x: 100, y: 100, name: 'shoulder' };
const point2: Keypoint = { x: 150, y: 150, name: 'elbow' };
const point3: Keypoint = { x: 200, y: 100, name: 'wrist' };

const result: AngleResult = calculateAngle(point1, point2, point3, 'elbow');
console.log(result.angle); // 输出计算的角度值
```

## 2. CameraCapture（摄像头捕获组件）

集成摄像头功能，支持拍照和权限管理。

### 使用方法

```typescript
import CameraCapture from './CameraCapture';

const handleCapture = (imageDataUrl: string) => {
  // 处理捕获的图像数据
  console.log('Image captured:', imageDataUrl);
};

const handleError = (error: string) => {
  // 处理错误
  console.error('Camera error:', error);
};

<CameraCapture onCapture={handleCapture} onError={handleError} />
```

## 3. FileUpload（文件上传组件）

支持拖拽和点击选择文件的上传组件。

### 使用方法

```typescript
import FileUpload from './FileUpload';

const handleFileSelect = (file: File) => {
  // 处理选中的文件
  console.log('Selected file:', file.name);
};

<FileUpload 
  onFileSelect={handleFileSelect} 
  accept="video/*" 
  maxSize={50 * 1024 * 1024} // 50MB
/>
```

## 4. ScoringSystem（评分系统组件）

根据角度和关键点数据计算康复动作评分。

### 使用方法

```typescript
import { calculateScore, type Measurement, type ScoreCriteria } from './ScoringSystem';

const measurements: Measurement[] = [
  { value: 90, type: 'angle', name: 'knee' },
  { value: 45, type: 'angle', name: 'hip' }
];

const criteria: ScoreCriteria[] = [
  { minAngle: 80, maxAngle: 100, weight: 5, name: 'knee' },
  { minAngle: 40, maxAngle: 60, weight: 3, name: 'hip' }
];

const result = calculateScore(measurements, criteria);
console.log(result.score); // 输出总得分
```

## 5. SkeletonVisualizer（骨骼可视化组件）

在图像上绘制骨骼连接图，可视化关键点数据。

### 使用方法

```typescript
import SkeletonVisualizer, { type Keypoint } from './SkeletonVisualizer';

const keypoints: Keypoint[] = [
  { x: 0.5, y: 0.3, name: 'nose', score: 0.9 },
  { x: 0.4, y: 0.4, name: 'left_eye', score: 0.8 },
  // 更多关键点...
];

<SkeletonVisualizer 
  keypoints={keypoints}
  imageUrl="path/to/image.jpg"
  width={640}
  height={480}
/>
```

## 注意事项

1. 所有组件都使用TypeScript编写，具有完整的类型定义
2. 组件遵循项目的设计规范和配色方案
3. 组件经过优化，避免不必要的重渲染
4. 所有组件都支持移动端使用