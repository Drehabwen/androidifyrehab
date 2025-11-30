import React from 'react';
import VideoAnalysis from '../../VideoAnalysis';
import * as Icons from '@radix-ui/react-icons';

const TrunkStabilityPushupAnalysis: React.FC = () => {
  return (
      <div className="space-y-6">
        <div className="bg-primary-white rounded-xl shadow-card border border-border p-6">
          <div className="flex items-center mb-4">
            <Icons.CardStackIcon className="w-6 h-6 text-primary mr-2" />
            <h2 className="text-xl font-bold text-text-primary">躯干稳定俯卧撑动作分析</h2>
          </div>
          <p className="text-text-secondary mb-6">
            躯干稳定俯卧撑是FMS基础动作模式之一，用于评估上肢对称性、躯干稳定性和神经肌肉控制能力。
            请上传视频或使用摄像头录制您的躯干稳定俯卧撑测试动作。
          </p>
          
          <div className="bg-primary-soft rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-text-primary mb-2 flex items-center">
              <Icons.InfoCircledIcon className="w-4 h-4 mr-2" />
              动作要点
            </h3>
            <ul className="list-disc list-inside text-text-secondary text-sm space-y-1">
              <li>根据性别选择起始位置（男：手掌贴地；女：手掌贴大腿）</li>
              <li>保持身体呈一条直线</li>
              <li>缓慢下降至胸部接近地面</li>
              <li>控制性推起回到起始位置</li>
              <li>保持头部、躯干和下肢稳定，避免摆动</li>
            </ul>
          </div>
        </div>
        
        <VideoAnalysis 
          movementType="trunk-stability-pushup" 
          movementName="躯干稳定俯卧撑" 
        />
      </div>
    );
  };

export default TrunkStabilityPushupAnalysis;