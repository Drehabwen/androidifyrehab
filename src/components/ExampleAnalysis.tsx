import { useState, useEffect } from 'react';

// 定义接口
export interface Score {
  value: number;
  maxValue: number;
  description: string;
  feedback?: string;
}

export interface Metric {
  id: string;
  name: string;
  score: Score;
  category: 'mobility' | 'stability' | 'general';
}

export interface Assessment {
  id: string;
  type: string;
  movementType: string;
  movementName: string;
  timestamp: string;
  metrics: Metric[];
  overallScore: Score;
  recommendations?: string[];
}

// 示例数据生成函数
const generateExampleFmsAssessment = (movementType: string, movementName: string): Assessment => {
  // 根据不同动作类型生成不同的指标数据
  const metricsMap: Record<string, Metric[]> = {
    'deep-squat': [
      { id: 'hip_mobility', name: '髋关节活动度', score: { value: 2, maxValue: 3, description: '良好' }, category: 'mobility' },
      { id: 'knee_stability', name: '膝关节稳定性', score: { value: 3, maxValue: 3, description: '优秀' }, category: 'stability' },
      { id: 'ankle_mobility', name: '踝关节活动度', score: { value: 2, maxValue: 3, description: '良好' }, category: 'mobility' },
      { id: 'core_control', name: '核心控制', score: { value: 2, maxValue: 3, description: '良好' }, category: 'stability' }
    ],
    'hurdle-step': [
      { id: 'single_leg_balance', name: '单腿平衡', score: { value: 2, maxValue: 3, description: '良好' }, category: 'stability' },
      { id: 'hip_flexion', name: '髋屈曲', score: { value: 3, maxValue: 3, description: '优秀' }, category: 'mobility' },
      { id: 'knee_control', name: '膝关节控制', score: { value: 2, maxValue: 3, description: '良好' }, category: 'stability' },
      { id: 'trunk_stability', name: '躯干稳定性', score: { value: 3, maxValue: 3, description: '优秀' }, category: 'stability' }
    ],
    'shoulder-mobility': [
      { id: 'glenohumeral_mobility', name: '盂肱关节活动度', score: { value: 3, maxValue: 3, description: '优秀' }, category: 'mobility' },
      { id: 'thoracic_extension', name: '胸椎伸展', score: { value: 2, maxValue: 3, description: '良好' }, category: 'mobility' },
      { id: 'scapular_stability', name: '肩胛骨稳定性', score: { value: 2, maxValue: 3, description: '良好' }, category: 'stability' },
      { id: 'shoulder_rotation', name: '肩部旋转', score: { value: 3, maxValue: 3, description: '优秀' }, category: 'mobility' }
    ]
  };

  const metrics = metricsMap[movementType] || [
    { id: 'general_score', name: '总体评分', score: { value: 2.5, maxValue: 3, description: '良好' }, category: 'general' }
  ];

  // 计算总分
  const totalValue = metrics.reduce((sum, m) => sum + m.score.value, 0);
  const averageScore = totalValue / metrics.length;
  
  let overallDescription = '';
  if (averageScore >= 2.5) {
    overallDescription = '优秀';
  } else if (averageScore >= 1.5) {
    overallDescription = '良好';
  } else {
    overallDescription = '需改进';
  }

  return {
    id: `example_${movementType}_${Date.now()}`,
    type: 'FMS',
    movementType,
    movementName,
    timestamp: new Date().toISOString(),
    metrics,
    overallScore: {
      value: Number(averageScore.toFixed(1)),
      maxValue: 3,
      description: overallDescription
    },
    recommendations: [
      '继续保持当前训练计划',
      '针对低分指标进行强化训练',
      '增加核心稳定性训练'
    ]
  };
};

// 评分条组件
const ScoreBar = ({ score, maxScore }: { score: number; maxScore: number }) => {
  const percentage = (score / maxScore) * 100;
  
  // 根据分数设置颜色
  let barColor = 'bg-primary';
  if (percentage < 50) {
    barColor = 'bg-status-danger';
  } else if (percentage < 80) {
    barColor = 'bg-status-warning';
  }
  
  // 动画效果
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
      <div 
        className={`h-full rounded-full ${barColor} shadow-md transition-all duration-1000 ease-out`}
        style={isVisible ? { width: `${percentage}%` } : { width: '0%' }}
      ></div>
    </div>
  );
};

// 简单的雷达图组件（使用SVG实现）
const SimpleRadarChart = ({ metrics }: { metrics: Metric[] }) => {
  const maxScore = 3;
  const centerX = 100;
  const centerY = 100;
  const radius = 80;
  const angleStep = (2 * Math.PI) / metrics.length;

  // 生成多边形顶点
  const polygonPoints = metrics.map((metric, index) => {
    const angle = index * angleStep - Math.PI / 2; // 从顶部开始
    const x = centerX + (metric.score.value / maxScore) * radius * Math.cos(angle);
    const y = centerY + (metric.score.value / maxScore) * radius * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  // 生成网格线
  const generateGridPoints = (level: number) => {
    const levelRadius = (level / maxScore) * radius;
    return metrics.map((_, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const x = centerX + levelRadius * Math.cos(angle);
      const y = centerY + levelRadius * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  };

  // 生成标签
  const labels = metrics.map((metric, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const labelRadius = radius + 25;
    const x = centerX + labelRadius * Math.cos(angle);
    const y = centerY + labelRadius * Math.sin(angle);
    
    // 根据角度确定文本锚点
    let textAnchor: 'start' | 'middle' | 'end' = 'middle';
    if (Math.abs(Math.cos(angle)) > 0.5) {
      textAnchor = Math.cos(angle) > 0 ? 'start' : 'end';
    }

    return (
      <g key={metric.id} className="animate-fadeIn">
        <text 
          x={x} 
          y={y}
          textAnchor={textAnchor}
          fontSize="12"
          fill="#2d3a2d"
          fontWeight="600"
          className="text-shadow"
        >
          {metric.name}
        </text>
      </g>
    );
  });

  // 将标签添加到SVG中
  {labels}

  return (
    <div className="flex justify-center my-8 bg-white rounded-lg p-4 shadow-inner">
      <svg width="220" height="220" viewBox="0 0 220 220">
        {/* 背景网格 */}
        {[1, 2, 3].map((level, i) => (
          <polygon
            key={`grid-${level}`}
            points={generateGridPoints(level)}
            fill="none"
            stroke={i === 2 ? "#a5e6c8" : "#e0f2e9"}
            strokeWidth={i === 2 ? 1.5 : 1}
            className={`animate-fadeIn delay-${i * 10}`}
          />
        ))}
        
        {/* 轴线 */}
        {metrics.map((_, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          return (
            <line
              key={`axis-${index}`}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke="#e0f2e9"
              strokeWidth="1"
              className={`animate-fadeIn delay-${15 + index * 5}`}
            />
          );
        })}
        
        {/* 数据多边形 */}
        <polygon
          points={polygonPoints}
          fill="rgba(143, 170, 143, 0.35)"
          stroke="#8faa8f"
          strokeWidth="2.5"
          className="animate-fadeIn delay-30"
        />
        
        {/* 数据点 */}
        {metrics.map((metric, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const x = centerX + (metric.score.value / maxScore) * radius * Math.cos(angle);
          const y = centerY + (metric.score.value / maxScore) * radius * Math.sin(angle);
          const delay = Math.floor((400 + index * 100) / 10);
          
          return (
            <circle
              key={metric.id}
              cx={x}
              cy={y}
              r="5"
              fill="#2d3a2d"
              stroke="white"
              strokeWidth="1.5"
              className={`animate-pulse delay-${delay}`}
            />
          );
        })}
        
        {/* 中心点 */}
        <circle cx={centerX} cy={centerY} r="3" fill="#2d3a2d" stroke="white" strokeWidth="1.5" className="animate-fadeIn delay-20" />
      </svg>
    </div>
  );
};

interface ExampleAnalysisProps {
  movementType?: string;
  movementName?: string;
}

const ExampleAnalysis: React.FC<ExampleAnalysisProps> = ({ 
  movementType = 'deep-squat', 
  movementName = '深蹲' 
}) => {
  const [assessment] = useState(() => 
    generateExampleFmsAssessment(movementType, movementName)
  );
  const [activeTab, setActiveTab] = useState<'metrics' | 'visualization'>('metrics');
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`bg-primary-white rounded-2xl shadow-card border border-border p-6 mb-6 transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-soft rounded-full">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-text-primary">{movementName} 分析结果</h3>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-soft text-text-primary">
            <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            示例数据
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-linear-to-br from-primary-soft to-primary-light rounded-xl p-4 shadow-soft transform transition-all hover:scale-[1.02] hover:shadow-hover">
            <div className="flex items-center mb-2">
              <svg className="w-4 h-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm font-medium text-text-primary">总体评分</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-text-primary">{assessment.overallScore.value}</span>
              <span className="text-gray-500 ml-1">/ {assessment.overallScore.maxValue}</span>
            </div>
            <div className="text-sm font-medium text-primary mt-1">{assessment.overallScore.description}</div>
          </div>
          
          <div className="bg-primary-white border border-border rounded-xl p-4 shadow-soft transform transition-all hover:scale-[1.02] hover:shadow-hover md:col-span-2">
            <div className="flex items-center mb-2">
              <svg className="w-4 h-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-sm font-medium text-text-primary">功能表现</span>
            </div>
            <ScoreBar score={assessment.overallScore.value} maxScore={assessment.overallScore.maxValue} />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">需要改进</span>
              <span className="text-xs text-gray-500">良好</span>
              <span className="text-xs text-gray-500">优秀</span>
            </div>
          </div>
        </div>

        {/* 标签页切换 */}
        <div className="flex space-x-2 border-b border-border mb-6" role="tablist">
          <button
            className={`py-3 px-6 font-medium text-sm rounded-t-lg transition-all duration-300 ease-in-out ${activeTab === 'metrics' ? 'border-b-2 border-primary text-primary bg-primary-soft' : 'text-text-secondary hover:text-primary hover:bg-primary-soft'}`}
            onClick={() => setActiveTab('metrics')}
            aria-selected={activeTab === 'metrics'}
            aria-controls="metrics-panel"
            role="tab"
          >
            详细指标
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm rounded-t-lg transition-all duration-300 ease-in-out ${activeTab === 'visualization' ? 'border-b-2 border-primary text-primary bg-primary-soft' : 'text-text-secondary hover:text-primary hover:bg-primary-soft'}`}
            onClick={() => setActiveTab('visualization')}
            aria-selected={activeTab === 'visualization'}
            aria-controls="visualization-panel"
            role="tab"
          >
            可视化分析
          </button>
        </div>

        {/* 详细指标内容 */}
        {activeTab === 'metrics' && (
          <div id="metrics-panel" className="space-y-4 animate-fadeIn" role="tabpanel" aria-labelledby="metrics-tab">
            {assessment.metrics.map((metric, index) => (
              <div 
                key={metric.id} 
                className={`border border-border rounded-xl p-4 shadow-soft transform transition-all hover:shadow-hover hover:border-primary/30 animate-fadeIn delay-${index * 10}`}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-2">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${metric.category === 'mobility' ? 'bg-blue-500' : 'bg-amber-500'}`}></div>
                    <div className="font-medium text-text-primary">{metric.name}</div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-text-primary">{metric.score.value}</span>
                    <span className="text-gray-500 ml-1">/ {metric.score.maxValue}</span>
                    <span className="ml-2 text-xs px-2 py-0.5 bg-primary-soft text-primary rounded-full">
                      {metric.score.description}
                    </span>
                  </div>
                </div>
                <ScoreBar score={metric.score.value} maxScore={metric.score.maxValue} />
                {metric.score.feedback && (
                  <div className="text-sm text-text-secondary mt-2 pl-4 border-l-2 border-border">
                    {metric.score.feedback}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 可视化内容 */}
        {activeTab === 'visualization' && (
          <div id="visualization-panel" className="space-y-6 animate-fadeIn" role="tabpanel" aria-labelledby="visualization-tab">
            <div className="text-center text-base font-medium text-text-primary mb-4">
              {movementName} 动作各项指标评分雷达图
            </div>
            <SimpleRadarChart metrics={assessment.metrics} />
            
            <div className="mt-8 bg-primary-soft rounded-xl p-5">
              <div className="flex items-center mb-4">
                <svg className="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h4 className="text-lg font-semibold text-text-primary">个性化训练建议</h4>
              </div>
              <ul className="space-y-3">
                {assessment.recommendations?.map((rec, index) => (
                  <li 
                      key={index} 
                      className={`flex items-start transform transition-all hover:translate-x-1 animate-fadeIn delay-${index * 15}`}
                    >
                    <div className="w-5 h-5 bg-primary rounded-full mt-0.5 mr-3 shrink-0 flex items-center justify-center text-white font-bold text-xs">
                      {index + 1}
                    </div>
                    <span className="text-text-primary">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              {/* 类别统计 */}
              <div className="bg-primary-white border border-border rounded-xl p-4 shadow-soft">
                <h5 className="text-sm font-medium text-text-primary mb-3">指标类别分布</h5>
                <div className="space-y-3">
                  {['mobility', 'stability'].map(category => {
                    const count = assessment.metrics.filter(m => m.category === category).length;
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${category === 'mobility' ? 'bg-blue-500' : 'bg-amber-500'}`}></div>
                          <span className="text-sm text-text-secondary">{category === 'mobility' ? '活动度' : '稳定性'}</span>
                        </div>
                        <span className="text-sm font-medium text-primary">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* 评分等级分布 */}
              <div className="bg-primary-white border border-border rounded-xl p-4 shadow-soft">
                <h5 className="text-sm font-medium text-text-primary mb-3">评分等级分布</h5>
                <div className="space-y-3">
                  {['优秀', '良好', '需改进'].map(level => {
                    const count = assessment.metrics.filter(m => m.score.description === level).length;
                    return (
                      <div key={level} className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">{level}</span>
                        <span className="text-sm font-medium text-primary">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-sm text-text-secondary italic text-center mt-6 p-3 bg-primary-gray rounded-lg">
        * 本数据为示例数据，实际评估结果将根据您的动作表现进行分析
      </div>
    </div>
  );
};

export default ExampleAnalysis;