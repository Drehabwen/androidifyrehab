import React from 'react';
import VideoAnalysis from '../../VideoAnalysis';
import * as Icons from '@radix-ui/react-icons';

const DeepSquatAnalysis: React.FC = () => {
  return (
      <div className="space-y-6">
        <div className="bg-primary-white rounded-xl shadow-card border border-border p-6">
          <div className="flex items-center mb-4">
            <Icons.DotFilledIcon className="w-6 h-6 text-primary mr-2" />
            <h2 className="text-xl font-bold text-text-primary">深蹲动作分析</h2>
          </div>
          <p className="text-text-secondary mb-6">
            深蹲是FMS基础动作模式之一，用于评估下肢力量、核心稳定性和关节活动度。
            请上传视频或使用摄像头录制您的深蹲动作。
          </p>
          
          <div className="bg-primary-soft rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-text-primary mb-2 flex items-center">
              <Icons.InfoCircledIcon className="w-4 h-4 mr-2" />
              动作要点
            </h3>
            <ul className="list-disc list-inside text-text-secondary text-sm space-y-1">
              <li>双脚与肩同宽站立，脚尖略微向外</li>
              <li>双手抱头或向前平举以保持平衡</li>
              <li>缓慢下蹲至大腿与地面平行</li>
              <li>保持背部挺直，膝盖与脚尖方向一致</li>
              <li>缓慢站起回到起始位置</li>
            </ul>
          </div>
        </div>
        
        <VideoAnalysis 
          movementType="deep-squat" 
          movementName="深蹲" 
        />
      </div>
    );
  };

export default DeepSquatAnalysis;