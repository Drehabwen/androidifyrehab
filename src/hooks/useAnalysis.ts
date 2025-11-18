import { useMutation } from '@tanstack/react-query';
import { analyzeVideo, type AnalysisRequest, type AnalysisResponse } from '../services/api';

/**
 * 自定义Hook，用于康复视频分析
 * 使用react-query的useMutation来处理异步分析请求
 */
export const useAnalysis = () => {
    // 使用useMutation创建分析mutation
  const mutation = useMutation<AnalysisResponse, Error, AnalysisRequest>({
    mutationFn: analyzeVideo,
    onError: (error) => {
      // 错误处理
      console.error('Analysis failed:', error);
    }
  });

  // 返回mutation结果
  return mutation;
};