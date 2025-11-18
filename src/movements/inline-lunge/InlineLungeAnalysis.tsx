import React from 'react';
import VideoAnalysis from '../../VideoAnalysis';
import * as Icons from '@radix-ui/react-icons';

const InlineLungeAnalysis: React.FC = () => {
  return (
      <div className="space-y-6">
        <div className="bg-primary-white rounded-xl shadow-card border border-border p-6">
          <div className="flex items-center mb-4">
            <Icons.BarChartIcon className="w-6 h-6 text-primary mr-2" />
            <h2 className="text-xl font-bold text-text-primary">直线弓步动作分析</h2>
          </div>
          <p className="text-text-secondary mb-6">
            直线弓步是FMS基础动作模式之一，用于评估髋、膝、踝关节稳定性及身体在矢状面上的控制能力。
            请上传视频或使用摄像头录制您的直线弓步动作。
          </p>
          
          <div className="bg-primary-soft rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-text-primary mb-2 flex items-center">
              <Icons.InfoCircledIcon className="w-4 h-4 mr-2" />
              动作要点
            </h3>
            <ul className="list-disc list-inside text-text-secondary text-sm space-y-1">
              <li>一脚在前，一脚在后，呈一条直线</li>
              <li>前脚脚跟对准后脚足弓</li>
              <li>缓慢下蹲，直到后膝接近地面</li>
              <li>保持躯干挺直，避免前倾或后仰</li>
              <li>控制性地回到起始位置</li>
            </ul>
          </div>
        </div>
        
        <VideoAnalysis 
          movementType="inline-lunge" 
          movementName="直线弓步" 
        />
      </div>
    );
  };

export default InlineLungeAnalysis;