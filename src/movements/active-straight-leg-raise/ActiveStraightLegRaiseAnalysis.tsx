import React from 'react';
import VideoAnalysis from '../../VideoAnalysis';
import * as Icons from '@radix-ui/react-icons';

const ActiveStraightLegRaiseAnalysis: React.FC = () => {
  return (
      <div className="space-y-6">
        <div className="bg-primary-white rounded-xl shadow-card border border-border p-6">
          <div className="flex items-center mb-4">
            <Icons.StretchVerticallyIcon className="w-6 h-6 text-primary mr-2" />
            <h2 className="text-xl font-bold text-text-primary">主动直腿抬高动作分析</h2>
          </div>
          <p className="text-text-secondary mb-6">
            主动直腿抬高是FMS基础动作模式之一，用于评估后侧链柔韧性和神经肌肉控制能力。
            请上传视频或使用摄像头录制您的主动直腿抬高测试动作。
          </p>
          
          <div className="bg-primary-soft rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-text-primary mb-2 flex items-center">
              <Icons.InfoCircledIcon className="w-4 h-4 mr-2" />
              动作要点
            </h3>
            <ul className="list-disc list-inside text-text-secondary text-sm space-y-1">
              <li>仰卧，双臂自然放于身体两侧</li>
              <li>一条腿保持伸直，缓慢抬高</li>
              <li>另一条腿保持贴地，膝盖伸直</li>
              <li>记录抬高腿的最大高度</li>
              <li>注意避免腰部离地或对侧腿屈曲</li>
            </ul>
          </div>
        </div>
        
        <VideoAnalysis 
          movementType="active-straight-leg-raise" 
          movementName="主动直腿抬高" 
        />
      </div>
    );
  };

export default ActiveStraightLegRaiseAnalysis;