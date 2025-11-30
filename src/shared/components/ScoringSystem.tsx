import React from 'react';

// 评分标准接口
interface ScoreCriteria {
  minAngle?: number;
  maxAngle?: number;
  minValue?: number;
  maxValue?: number;
  weight: number;
  name: string;
  description?: string;
}

// 测量数据接口
interface Measurement {
  value: number;
  type: 'angle' | 'distance' | 'other';
  name: string;
}

// 评分结果接口
interface ScoringResult {
  score: number;
  maxScore: number;
  feedback: string;
  details: Record<string, {
    score: number;
    maxScore: number;
    feedback: string;
    rawValue: number;
  }>;
  overallFeedback: string;
}

/**
 * 根据测量数据和评分标准计算得分
 * @param measurements 测量数据数组
 * @param criteria 评分标准数组
 * @returns ScoringResult 评分结果
 */
const calculateScore = (
  measurements: Measurement[],
  criteria: ScoreCriteria[]
): ScoringResult => {
  // 初始化结果
  const result: ScoringResult = {
    score: 0,
    maxScore: 0,
    feedback: '',
    details: {},
    overallFeedback: ''
  };

  // 为每个评分标准计算得分
  criteria.forEach(criterion => {
    const measurement = measurements.find(m => m.name === criterion.name);
    
    if (!measurement) {
      result.details[criterion.name] = {
        score: 0,
        maxScore: criterion.weight,
        feedback: '未找到相关测量数据',
        rawValue: 0
      };
      return;
    }

    let score = 0;
    let feedback = '';

    // 根据测量类型和标准计算得分
    if (measurement.type === 'angle') {
      const angle = measurement.value;
      
      if (criterion.minAngle !== undefined && criterion.maxAngle !== undefined) {
        // 在理想范围内得满分
        if (angle >= criterion.minAngle && angle <= criterion.maxAngle) {
          score = criterion.weight;
          feedback = '角度在理想范围内';
        } else {
          // 根据偏离程度计算得分
          const minDeviation = Math.abs(angle - criterion.minAngle);
          const maxDeviation = Math.abs(angle - criterion.maxAngle);
          const deviation = Math.min(minDeviation, maxDeviation);
          
          // 简单的线性扣分
          const maxAllowedDeviation = 30; // 最大允许偏差30度
          const deduction = Math.min(1, deviation / maxAllowedDeviation);
          score = criterion.weight * (1 - deduction);
          
          if (angle < criterion.minAngle) {
            feedback = `角度偏低 ${deviation.toFixed(1)} 度`;
          } else {
            feedback = `角度偏高 ${deviation.toFixed(1)} 度`;
          }
        }
      } else if (criterion.minAngle !== undefined) {
        // 只有最小值要求
        if (angle >= criterion.minAngle) {
          score = criterion.weight;
          feedback = '角度达到最低要求';
        } else {
          const deviation = criterion.minAngle - angle;
          const maxAllowedDeviation = 30;
          const deduction = Math.min(1, deviation / maxAllowedDeviation);
          score = criterion.weight * (1 - deduction);
          feedback = `角度偏低 ${deviation.toFixed(1)} 度`;
        }
      } else if (criterion.maxAngle !== undefined) {
        // 只有最大值要求
        if (angle <= criterion.maxAngle) {
          score = criterion.weight;
          feedback = '角度在允许范围内';
        } else {
          const deviation = angle - criterion.maxAngle;
          const maxAllowedDeviation = 30;
          const deduction = Math.min(1, deviation / maxAllowedDeviation);
          score = criterion.weight * (1 - deduction);
          feedback = `角度偏高 ${deviation.toFixed(1)} 度`;
        }
      }
    } else {
      // 其他类型的测量
      const value = measurement.value;
      
      if (criterion.minValue !== undefined && criterion.maxValue !== undefined) {
        if (value >= criterion.minValue && value <= criterion.maxValue) {
          score = criterion.weight;
          feedback = '数值在理想范围内';
        } else {
          const minDeviation = Math.abs(value - criterion.minValue);
          const maxDeviation = Math.abs(value - criterion.maxValue);
          const deviation = Math.min(minDeviation, maxDeviation);
          
          const range = criterion.maxValue - criterion.minValue;
          const maxAllowedDeviation = range * 0.5; // 最大允许50%偏差
          const deduction = Math.min(1, deviation / maxAllowedDeviation);
          score = criterion.weight * (1 - deduction);
          
          if (value < criterion.minValue) {
            feedback = `数值偏低 ${deviation.toFixed(1)}`;
          } else {
            feedback = `数值偏高 ${deviation.toFixed(1)}`;
          }
        }
      }
    }

    // 保存详细结果
    result.details[criterion.name] = {
      score: parseFloat(score.toFixed(2)),
      maxScore: criterion.weight,
      feedback,
      rawValue: measurement.value
    };

    // 累加总分
    result.score += score;
    result.maxScore += criterion.weight;
  });

  // 计算总分百分比
  const percentage = result.maxScore > 0 ? (result.score / result.maxScore) * 100 : 0;
  
  // 生成总体反馈
  if (percentage >= 90) {
    result.overallFeedback = '表现优秀';
  } else if (percentage >= 75) {
    result.overallFeedback = '表现良好';
  } else if (percentage >= 60) {
    result.overallFeedback = '表现一般';
  } else {
    result.overallFeedback = '需要改进';
  }

  // 生成反馈信息
  result.feedback = `总得分: ${result.score.toFixed(1)}/${result.maxScore.toFixed(1)} (${percentage.toFixed(1)}%) - ${result.overallFeedback}`;

  return result;
};

/**
 * 评分系统组件
 */
const ScoringSystem: React.FC = () => {
  return (
    <div className="scoring-system">
      <h3>Scoring System Component</h3>
      <p>用于计算康复动作评分的系统组件</p>
    </div>
  );
};

export default ScoringSystem;
export { calculateScore };
export type { ScoreCriteria, Measurement, ScoringResult };