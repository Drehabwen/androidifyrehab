import React, { useState } from 'react';
import VideoAnalysis from './VideoAnalysis';
import ModuleEntryWrapper from './ModuleEntryWrapper';
import * as Icons from '@radix-ui/react-icons';

// 动态导入FMS动作模块
const DeepSquatAnalysis = React.lazy(() => import('./movements/deep-squat'));
const HurdleStepAnalysis = React.lazy(() => import('./movements/hurdle-step'));
const InlineLungeAnalysis = React.lazy(() => import('./movements/inline-lunge'));
const ShoulderMobilityAnalysis = React.lazy(() => import('./movements/shoulder-mobility'));
const ActiveStraightLegRaiseAnalysis = React.lazy(() => import('./movements/active-straight-leg-raise'));
const TrunkStabilityPushupAnalysis = React.lazy(() => import('./movements/trunk-stability-pushup'));
const RotaryStabilityAnalysis = React.lazy(() => import('./movements/rotary-stability'));

// 定义FMS动作类型
interface FmsMovement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

// FMS动作列表
const fmsMovements: FmsMovement[] = [
  {
    id: 'deep-squat',
    name: '深蹲',
    description: '评估下肢、核心稳定性和活动度',
    icon: <Icons.DotFilledIcon className="w-6 h-6" />
  },
  {
    id: 'hurdle-step',
    name: '跨栏步',
    description: '评估单腿站立平衡能力',
    icon: <Icons.DragHandleDots2Icon className="w-6 h-6" />
  },
  {
    id: 'inline-lunge',
    name: '直线弓步',
    description: '评估髋、膝、踝关节稳定性',
    icon: <Icons.BarChartIcon className="w-6 h-6" />
  },
  {
    id: 'shoulder-mobility',
    name: '肩部灵活性',
    description: '评估肩带活动范围',
    icon: <Icons.MixerHorizontalIcon className="w-6 h-6" />
  },
  {
    id: 'active-straight-leg-raise',
    name: '主动直腿抬高',
    description: '评估后侧链柔韧性',
    icon: <Icons.StretchVerticallyIcon className="w-6 h-6" />
  },
  {
    id: 'trunk-stability-pushup',
    name: '躯干稳定俯卧撑',
    description: '评估核心稳定性',
    icon: <Icons.CardStackIcon className="w-6 h-6" />
  },
  {
    id: 'rotary-stability',
    name: '旋转稳定性',
    description: '评估多平面核心控制能力',
    icon: <Icons.CircleIcon className="w-6 h-6" />
  }
];

// 动作评估系统组件
const MovementSelection = ({ onSelectMovement }: { onSelectMovement: (movement: FmsMovement) => void }) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-emerald-700 mb-2">功能性动作评估 (FMS)</h2>
        <p className="text-gray-600">请选择要分析的动作类型</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fmsMovements.map(movement => (
          <div 
            key={movement.id}
            onClick={() => onSelectMovement(movement)}
            className="bg-white rounded-xl shadow-md p-5 cursor-pointer hover:bg-emerald-50 transition-all hover:shadow-lg border-2 border-transparent hover:border-emerald-200"
          >
            <div className="flex items-center mb-3 text-emerald-600">
              {movement.icon}
              <h3 className="text-lg font-semibold ml-2">{movement.name}</h3>
            </div>
            <p className="text-gray-600 text-sm">{movement.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// 主应用组件
const App: React.FC = () => {
  const [selectedMovement, setSelectedMovement] = useState<FmsMovement | null>(null);
  const [activeModule, setActiveModule] = useState<string>('movement-selection');

  const handleMovementSelect = (movement: FmsMovement) => {
    setSelectedMovement(movement);
    setActiveModule(movement.id);
  };

  const handleBackToSelection = () => {
    setSelectedMovement(null);
    setActiveModule('movement-selection');
  };

  const renderModule = () => {
    if (activeModule === 'movement-selection') {
      return <MovementSelection onSelectMovement={handleMovementSelect} />;
    }

    // 根据选择的动作模块渲染对应组件
    switch (selectedMovement?.id) {
      case 'deep-squat':
        return (
          <React.Suspense fallback={<div>加载中...</div>}>
            <DeepSquatAnalysis />
          </React.Suspense>
        );
      case 'hurdle-step':
        return (
          <React.Suspense fallback={<div>加载中...</div>}>
            <HurdleStepAnalysis />
          </React.Suspense>
        );
      case 'inline-lunge':
        return (
          <React.Suspense fallback={<div>加载中...</div>}>
            <InlineLungeAnalysis />
          </React.Suspense>
        );
      case 'shoulder-mobility':
        return (
          <React.Suspense fallback={<div>加载中...</div>}>
            <ShoulderMobilityAnalysis />
          </React.Suspense>
        );
      case 'active-straight-leg-raise':
        return (
          <React.Suspense fallback={<div>加载中...</div>}>
            <ActiveStraightLegRaiseAnalysis />
          </React.Suspense>
        );
      case 'trunk-stability-pushup':
        return (
          <React.Suspense fallback={<div>加载中...</div>}>
            <TrunkStabilityPushupAnalysis />
          </React.Suspense>
        );
      case 'rotary-stability':
        return (
          <React.Suspense fallback={<div>加载中...</div>}>
            <RotaryStabilityAnalysis />
          </React.Suspense>
        );
      default:
        return (
          <div className="space-y-4">
            {selectedMovement && (
              <button 
                onClick={handleBackToSelection}
                className="flex items-center text-emerald-600 hover:text-emerald-800 transition-colors"
              >
                <Icons.ArrowLeftIcon className="w-4 h-4 mr-1" />
                返回动作选择
              </button>
            )}
            <VideoAnalysis movementType={selectedMovement?.id} movementName={selectedMovement?.name} />
          </div>
        );
    }
  };

  return (
    <ModuleEntryWrapper 
      title={selectedMovement ? `${selectedMovement.name}分析` : "康复动作分析平台"} 
      moduleId="main-dashboard"
    >
      {renderModule()}
    </ModuleEntryWrapper>
  );
};

export default App;