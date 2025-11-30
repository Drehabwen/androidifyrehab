import React from 'react';
import VideoAnalysis from '../../VideoAnalysis';
import * as Icons from '@radix-ui/react-icons';

const ShoulderMobilityAnalysis: React.FC = () => {
  return (
      <div className="space-y-6">
        <div className="bg-primary-white rounded-xl shadow-card border border-border p-6">
          <div className="flex items-center mb-4">
            <Icons.MixerHorizontalIcon className="w-6 h-6 text-primary mr-2" />
            <h2 className="text-xl font-bold text-text-primary">肩部灵活性动作分析</h2>
          </div>
          <p className="text-text-secondary mb-6">
            肩部灵活性是FMS基础动作模式之一，用于评估肩带活动范围和胸椎灵活性。
            请上传视频或使用摄像头录制您的肩部灵活性测试动作。
          </p>
          
          <div className="bg-primary-soft rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-text-primary mb-2 flex items-center">
              <Icons.InfoCircledIcon className="w-4 h-4 mr-2" />
              动作要点
            </h3>
            <ul className="list-disc list-inside text-text-secondary text-sm space-y-1">
              <li>站立，双脚与肩同宽</li>
              <li>一手在上，一手在下，尽力相互靠近</li>
              <li>上方手向后伸展，下方手向前伸展</li>
              <li>保持躯干稳定，避免过度伸展腰部</li>
              <li>记录双手之间的距离</li>
            </ul>
          </div>
        </div>
        
        <VideoAnalysis 
          movementType="shoulder-mobility" 
          movementName="肩部灵活性" 
        />
      </div>
    );
  };

export default ShoulderMobilityAnalysis;