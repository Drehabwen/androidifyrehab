import React from 'react';
import VideoAnalysis from '../../VideoAnalysis';
import * as Icons from '@radix-ui/react-icons';

const RotaryStabilityAnalysis: React.FC = () => {
  return (
      <div className="space-y-6">
        <div className="bg-primary-white rounded-xl shadow-card border border-border p-6">
          <div className="flex items-center mb-4">
            <Icons.CircleIcon className="w-6 h-6 text-primary mr-2" />
            <h2 className="text-xl font-bold text-text-primary">旋转稳定性动作分析</h2>
          </div>
          <p className="text-text-secondary mb-6">
            旋转稳定性是FMS基础动作模式之一，用于评估多平面核心控制能力和上下肢协调性。
            请上传视频或使用摄像头录制您的旋转稳定性测试动作。
          </p>
          
          <div className="bg-primary-soft rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-text-primary mb-2 flex items-center">
              <Icons.InfoCircledIcon className="w-4 h-4 mr-2" />
              动作要点
            </h3>
            <ul className="list-disc list-inside text-text-secondary text-sm space-y-1">
              <li>起始位置为四肢着地，对侧手和脚抬起</li>
              <li>保持腰部稳定，避免塌陷或拱起</li>
              <li>缓慢伸展抬起的手臂和腿</li>
              <li>回到起始位置，保持控制</li>
              <li>重复动作，注意动作质量而非速度</li>
            </ul>
          </div>
        </div>
        
        <VideoAnalysis 
          movementType="rotary-stability" 
          movementName="旋转稳定性" 
        />
      </div>
    );
  };

export default RotaryStabilityAnalysis;