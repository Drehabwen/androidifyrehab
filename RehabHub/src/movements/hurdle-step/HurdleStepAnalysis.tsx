import React from 'react';
import VideoAnalysis from '../../VideoAnalysis';
import * as Icons from '@radix-ui/react-icons';

const HurdleStepAnalysis: React.FC = () => {
  return (
      <div className="space-y-6">
        <div className="bg-primary-white rounded-xl shadow-card border border-border p-6">
          <div className="flex items-center mb-4">
            <Icons.DragHandleDots2Icon className="w-6 h-6 text-primary mr-2" />
            <h2 className="text-xl font-bold text-text-primary">跨栏步动作分析</h2>
          </div>
          <p className="text-text-secondary mb-6">
            跨栏步是FMS基础动作模式之一，用于评估单腿站立平衡能力、髋关节活动度和躯干稳定性。
            请上传视频或使用摄像头录制您的跨栏步动作。
          </p>
          
          <div className="bg-primary-soft rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-text-primary mb-2 flex items-center">
              <Icons.InfoCircledIcon className="w-4 h-4 mr-2" />
              动作要点
            </h3>
            <ul className="list-disc list-inside text-text-secondary text-sm space-y-1">
              <li>站立，一脚在前，另一脚在后</li>
              <li>抬起前脚，跨过想象中的栏杆</li>
              <li>保持后腿伸直，脚跟着地</li>
              <li>控制性地回到起始位置</li>
              <li>保持躯干稳定，避免旋转或倾斜</li>
            </ul>
          </div>
        </div>
        
        <VideoAnalysis 
          movementType="hurdle-step" 
          movementName="跨栏步" 
        />
      </div>
  );
};

export default HurdleStepAnalysis;