import React from 'react';

// 关键点接口定义
interface Keypoint {
  x: number;
  y: number;
  name: string;
}

// 角度计算结果接口
interface AngleResult {
  angle: number;
  joint: string;
  isValid: boolean;
}

/**
 * 计算三个关键点形成的角度
 * @param point1 第一个关键点
 * @param point2 第二个关键点（顶点）
 * @param point3 第三个关键点
 * @param jointName 关节名称
 * @returns AngleResult 角度计算结果
 */
const calculateAngle = (
  point1: Keypoint, 
  point2: Keypoint, 
  point3: Keypoint,
  jointName: string = ''
): AngleResult => {
  // 检查关键点是否有效
  const isValid = 
    point1.x !== 0 && point1.y !== 0 &&
    point2.x !== 0 && point2.y !== 0 &&
    point3.x !== 0 && point3.y !== 0;

  if (!isValid) {
    return {
      angle: 0,
      joint: jointName,
      isValid: false
    };
  }

  // 计算向量
  const vector1 = {
    x: point1.x - point2.x,
    y: point1.y - point2.y
  };
  
  const vector2 = {
    x: point3.x - point2.x,
    y: point3.y - point2.y
  };

  // 计算点积
  const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
  
  // 计算向量的模长
  const magnitude1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y);
  const magnitude2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);
  
  // 防止除零错误
  if (magnitude1 === 0 || magnitude2 === 0) {
    return {
      angle: 0,
      joint: jointName,
      isValid: false
    };
  }
  
  // 计算角度（弧度）
  const cosAngle = dotProduct / (magnitude1 * magnitude2);
  // 限制在[-1, 1]范围内以防止计算错误
  const clampedCos = Math.max(-1, Math.min(1, cosAngle));
  const angleRad = Math.acos(clampedCos);
  
  // 转换为角度
  const angleDeg = angleRad * (180 / Math.PI);
  
  return {
    angle: parseFloat(angleDeg.toFixed(2)),
    joint: jointName,
    isValid: true
  };
};

/**
 * 角度计算器组件
 */
const AngleCalculator: React.FC = () => {
  return (
    <div className="angle-calculator">
      <h3>Angle Calculator Component</h3>
      <p>用于计算人体关节角度的工具组件</p>
    </div>
  );
};

export default AngleCalculator;
export { calculateAngle };
export type { Keypoint, AngleResult };