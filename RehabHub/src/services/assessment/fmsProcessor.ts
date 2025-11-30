import { Assessment, FmsAssessment, AssessmentProcessor, Metric, Score } from '../../types/assessment';

// FMS评估处理器实现
export class FmsProcessor implements AssessmentProcessor {
  async process(data: any): Promise<FmsAssessment> {
    // 解析API返回的数据并转换为FMS评估格式
    const metrics = this.extractMetrics(data);
    const overallScore = this.calculateOverallScore(metrics);
    const mobilityScore = this.calculateMobilityScore(metrics);
    const stabilityScore = this.calculateStabilityScore(metrics);
    const asymmetryDetected = this.checkAsymmetry(data);
    
    const assessment: FmsAssessment = {
      id: `fms_${Date.now()}`,
      type: 'FMS',
      movementType: data.movementType || 'unknown',
      movementName: data.movementName || 'Unknown Movement',
      timestamp: new Date().toISOString(),
      metrics,
      overallScore,
      mobilityScore,
      stabilityScore,
      asymmetryDetected,
      compensationPatterns: data.compensationPatterns || [],
      recommendations: this.generateRecommendations(metrics, asymmetryDetected),
      notes: data.notes || ''
    };
    
    return assessment;
  }

  getRecommendedExercises(assessment: Assessment): string[] {
    // 根据评估结果生成推荐的训练动作
    const recommendations: string[] = [];
    
    // 低分指标特殊处理
    const lowScoreMetrics = assessment.metrics.filter(m => m.score.value < 2);
    
    lowScoreMetrics.forEach(metric => {
      switch(metric.id) {
        case 'hip_mobility':
          recommendations.push('髋关节屈曲活动度训练');
          recommendations.push('髋屈肌伸展');
          break;
        case 'knee_stability':
          recommendations.push('单腿站立平衡训练');
          recommendations.push('膝关节稳定性强化');
          break;
        case 'core_activation':
          recommendations.push('核心稳定性训练');
          recommendations.push('腹横肌激活练习');
          break;
        default:
          recommendations.push(`${metric.name} 相关功能训练`);
      }
    });
    
    // 去重并限制数量
    return [...new Set(recommendations)].slice(0, 5);
  }

  generateReport(assessment: Assessment): string {
    // 生成评估报告文本
    const fmsAssessment = assessment as FmsAssessment;
    
    let report = `功能性动作评估报告\n`;
    report += `评估日期: ${new Date(assessment.timestamp).toLocaleDateString()}\n`;
    report += `动作类型: ${assessment.movementName}\n`;
    report += `总分: ${assessment.overallScore.value}/${assessment.overallScore.maxValue}\n\n`;
    
    report += `评估指标:\n`;
    assessment.metrics.forEach(metric => {
      report += `- ${metric.name}: ${metric.score.value}/${metric.score.maxValue} ${metric.score.description || ''}\n`;
    });
    
    report += `\n主要发现:\n`;
    if (fmsAssessment.asymmetryDetected) {
      report += `- 检测到肢体不对称性，建议加强薄弱侧训练\n`;
    }
    
    if (fmsAssessment.compensationPatterns && fmsAssessment.compensationPatterns.length > 0) {
      report += `- 发现以下代偿模式: ${fmsAssessment.compensationPatterns.join(', ')}\n`;
    }
    
    report += `\n训练建议:\n`;
    if (assessment.recommendations && assessment.recommendations.length > 0) {
      assessment.recommendations.forEach((rec, index) => {
        report += `${index + 1}. ${rec}\n`;
      });
    } else {
      report += `- 保持当前训练计划，定期复查\n`;
    }
    
    return report;
  }

  private extractMetrics(data: any): Metric[] {
    // 从原始数据中提取评估指标
    const metricsMap: Record<string, Metric> = {
      'hip_mobility': {
        id: 'hip_mobility',
        name: '髋关节活动度',
        score: this.createScore(data.hipMobilityScore || 0, 3),
        category: 'mobility'
      },
      'knee_stability': {
        id: 'knee_stability',
        name: '膝关节稳定性',
        score: this.createScore(data.kneeStabilityScore || 0, 3),
        category: 'stability'
      },
      'shoulder_mobility': {
        id: 'shoulder_mobility',
        name: '肩关节活动度',
        score: this.createScore(data.shoulderMobilityScore || 0, 3),
        category: 'mobility'
      },
      'core_activation': {
        id: 'core_activation',
        name: '核心激活',
        score: this.createScore(data.coreActivationScore || 0, 3),
        category: 'stability'
      },
      'postural_alignment': {
        id: 'postural_alignment',
        name: '姿势对齐',
        score: this.createScore(data.posturalAlignmentScore || 0, 3),
        category: 'stability'
      }
    };
    
    // 添加数据中可能存在的额外指标
    if (data.additionalMetrics) {
      Object.entries(data.additionalMetrics).forEach(([key, value]) => {
        if (!metricsMap[key] && typeof value === 'object' && value !== null) {
          const typedValue = value as { name?: string; score?: number; maxScore?: number; category?: string; details?: any };
          metricsMap[key] = {
            id: key,
            name: typedValue.name || key.replace(/_/g, ' '),
            score: this.createScore(typedValue.score || 0, typedValue.maxScore || 3),
            category: typedValue.category || 'general',
            ...(typedValue.details && { details: typedValue.details })
          };
        }
      });
    }
    
    return Object.values(metricsMap);
  }

  private createScore(value: number, maxValue: number): Score {
    // 创建评分对象并添加描述
    let description = '';
    let feedback = '';
    
    const percentage = (value / maxValue) * 100;
    
    if (percentage >= 80) {
      description = '优秀';
      feedback = '功能表现良好，继续保持';
    } else if (percentage >= 60) {
      description = '良好';
      feedback = '功能表现良好，但有提升空间';
    } else if (percentage >= 40) {
      description = '一般';
      feedback = '功能表现一般，需要针对性训练';
    } else {
      description = '需改进';
      feedback = '功能表现较差，建议加强相关训练';
    }
    
    return {
      value,
      maxValue,
      description,
      feedback
    };
  }

  private calculateOverallScore(metrics: Metric[]): Score {
    // 计算总体评分
    const totalValue = metrics.reduce((sum, metric) => sum + metric.score.value, 0);
    const totalMaxValue = metrics.reduce((sum, metric) => sum + metric.score.maxValue, 0);
    return this.createScore(totalValue, totalMaxValue);
  }

  private calculateMobilityScore(metrics: Metric[]): Score {
    // 计算灵活性评分
    const mobilityMetrics = metrics.filter(m => m.category === 'mobility');
    const totalValue = mobilityMetrics.reduce((sum, metric) => sum + metric.score.value, 0);
    const totalMaxValue = mobilityMetrics.reduce((sum, metric) => sum + metric.score.maxValue, 0);
    return this.createScore(totalValue, totalMaxValue);
  }

  private calculateStabilityScore(metrics: Metric[]): Score {
    // 计算稳定性评分
    const stabilityMetrics = metrics.filter(m => m.category === 'stability');
    const totalValue = stabilityMetrics.reduce((sum, metric) => sum + metric.score.value, 0);
    const totalMaxValue = stabilityMetrics.reduce((sum, metric) => sum + metric.score.maxValue, 0);
    return this.createScore(totalValue, totalMaxValue);
  }

  private checkAsymmetry(data: any): boolean {
    // 检查是否存在不对称性
    if (data.leftSideScores && data.rightSideScores) {
      // 比较左右侧评分差异
      for (const key in data.leftSideScores) {
        if (Math.abs(data.leftSideScores[key] - (data.rightSideScores[key] || 0)) >= 1) {
          return true;
        }
      }
    }
    return false;
  }

  private generateRecommendations(metrics: Metric[], asymmetryDetected: boolean): string[] {
    const recommendations: string[] = [];
    
    // 根据评分生成建议
    const lowScoreMetrics = metrics.filter(m => m.score.value < 2);
    
    if (lowScoreMetrics.length > 0) {
      recommendations.push(`加强以下薄弱环节的训练: ${lowScoreMetrics.map(m => m.name).join(', ')}`);
    }
    
    if (asymmetryDetected) {
      recommendations.push('针对肢体不对称进行平衡训练');
    }
    
    // 增加基于不同类别的建议
    const mobilityMetrics = metrics.filter(m => m.category === 'mobility' && m.score.value < 3);
    const stabilityMetrics = metrics.filter(m => m.category === 'stability' && m.score.value < 3);
    
    if (mobilityMetrics.length > 0) {
      recommendations.push('增加关节活动度训练');
    }
    
    if (stabilityMetrics.length > 0) {
      recommendations.push('加强核心和稳定性训练');
    }
    
    // 如果所有指标都很好
    if (metrics.every(m => m.score.value >= 2)) {
      recommendations.push('继续保持当前训练计划');
      recommendations.push('考虑增加训练难度和多样性');
    }
    
    return recommendations.slice(0, 5); // 最多返回5条建议
  }
}