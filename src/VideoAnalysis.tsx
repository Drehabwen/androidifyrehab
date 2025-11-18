import React, { useState, useCallback } from 'react';
import FileDropzone from './FileDropzone.tsx';
import CameraCapture from './CameraCapture.tsx';
import LoadingSpinner from './LoadingSpinner.tsx';
import { useAnalysis } from './hooks/useAnalysis.ts';
import { type AnalysisResponse } from './services/api';
import ExampleAnalysis from './components/ExampleAnalysis';
import { usePoseEstimation } from './hooks/usePoseEstimation.ts'; // 导入姿态估计Hook

interface VideoAnalysisProps {
  movementType?: string;
  movementName?: string;
}

const VideoAnalysis: React.FC<VideoAnalysisProps> = ({ movementType = 'general', movementName = '通用' }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload');
  const { mutate: analyzeVideo } = useAnalysis(); // 使用useAnalysis hook
  
  // 添加姿态估计相关的状态
  const { 
    keypoints: poseKeypoints, 
    isProcessing: isPoseProcessing, 
    movementEvaluation, 
    processFrame,
    isModelLoading
  } = usePoseEstimation();

  // 处理视频帧
  const processVideoFrame = useCallback((videoElement: HTMLVideoElement) => {
    if (videoElement && !isPoseProcessing) {
      // 调用姿态估计处理帧，传递movementType参数
      processFrame(videoElement, movementType);
    }
  }, [isPoseProcessing, processFrame, movementType]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
    setAnalysisResult(null);
  };

  const handleCapture = (image: string) => {
    // 将base64图像转换为File对象
    const convertBase64ToFile = (base64String: string, filename: string): File => {
      const arr = base64String.split(',');
      const mimeMatch = arr[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      
      return new File([u8arr], filename, { type: mime });
    };
    
    // 转换并设置为选中的文件
    const fileName = `capture_${Date.now()}.jpg`;
    const file = convertBase64ToFile(image, fileName);
    setSelectedFile(file);
    setError(null);
    setAnalysisResult(null);
    
    // 自动开始分析
    handleAnalyze();
  };

  // 保存结果到本地存储
  const saveResultToLocal = (result: AnalysisResponse) => {
    try {
      // 获取现有分析历史
      const historyKey = 'analysis_history';
      const existingHistory = localStorage.getItem(historyKey);
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      
      // 添加新结果，包含时间戳
      const newResult = {
        ...result,
        id: `analysis_${Date.now()}`,
        timestamp: new Date().toISOString()
      };
      
      // 添加到历史记录开头
      history.unshift(newResult);
      
      // 限制历史记录数量（保留最近10条）
      const limitedHistory = history.slice(0, 10);
      
      // 保存回本地存储
      localStorage.setItem(historyKey, JSON.stringify(limitedHistory));
    } catch (error) {
      console.error('保存分析结果到本地存储失败:', error);
    }
  };

  // 分析视频
  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError(null);
    
    try {
      // 使用useAnalysis hook进行分析
      analyzeVideo(
        { video: selectedFile },
        {
          onSuccess: (result) => {
            setAnalysisResult(result);
            // 保存到本地存储
            saveResultToLocal(result);
          },
          onError: (error) => {
            setError(
              error instanceof Error ? error.message : '视频分析失败，请重试'
            );
            console.error('Video analysis error:', error);
          },
          onSettled: () => {
            setIsAnalyzing(false);
          }
        }
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : '视频分析失败，请重试'
      );
      console.error('Video analysis error:', error);
      setIsAnalyzing(false);
    }
  };

  // 格式化文件大小函数
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="max-w-5xl mx-auto p-4 min-h-[70vh] flex flex-col">
      <div className="text-center mb-6">
        <h1 className="text-[clamp(1.5rem,4vw,2.5rem)] font-bold text-emerald-700 mb-3">
          {movementName} 动作分析
        </h1>
        <div className="flex items-center justify-center text-emerald-600 text-sm md:text-base">
          <div className="w-4 h-4 bg-gray-500 rounded-full mr-1" />
          <span>使用 {movementName} 分析模型</span>
        </div>
      </div>
      
      <div className="mb-6 grow">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-emerald-100">
          <div className="flex border-b border-emerald-100 mb-4" role="tablist">
            <button
              className={`py-3 px-4 font-medium text-sm sm:text-base flex-1 text-center ${activeTab === 'upload' ? 'border-b-2 border-emerald-500 text-emerald-600 font-semibold' : 'text-gray-500'}`}
              onClick={() => setActiveTab('upload')}
              role="tab"
              aria-selected={activeTab === 'upload'}
              aria-controls={activeTab === 'upload' ? 'upload-tabpanel' : undefined}
            >
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-linear-to-br from-gray-500 to-gray-600 rounded-full mr-2 inline" />
              上传视频
            </button>
            <button
              className={`py-3 px-4 font-medium text-sm sm:text-base flex-1 text-center ${activeTab === 'camera' ? 'border-b-2 border-emerald-500 text-emerald-600 font-semibold' : 'text-gray-500'}`}
              onClick={() => setActiveTab('camera')}
              role="tab"
              aria-selected={activeTab === 'camera'}
              aria-controls={activeTab === 'camera' ? 'camera-tabpanel' : undefined}
            >
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-linear-to-br from-gray-500 to-gray-600 rounded-full mr-2 inline" />
              拍摄视频
            </button>
          </div>
          
          <div className="mt-4">
            {activeTab === 'upload' ? (
              <FileDropzone onFileSelect={handleFileSelect} />
            ) : (
              // CameraCapture组件现在会处理实时姿态估计
              <CameraCapture 
                onCapture={handleCapture} 
                keypoints={poseKeypoints}
                onVideoFrame={processVideoFrame}
                showSkeleton={true}
              />
            )}
          </div>
        </div>
      </div>

      {selectedFile && !isAnalyzing && (
        <div className="mb-8 p-5 bg-white rounded-xl shadow-md border border-emerald-100 transition-all hover:shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                🎥
              </div>
              <div>
                <div className="flex items-center text-emerald-700 mb-1">
                  <span className="text-sm font-medium">已选择文件</span>
                </div>
                <p className="text-gray-800 text-sm sm:text-base font-medium truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type}
                </p>
              </div>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="mt-2 w-full sm:w-auto px-6 py-3 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 disabled:opacity-50 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-300 focus:ring-opacity-50 shadow-sm hover:shadow"
            >
              <span className="flex items-center justify-center">
                🔄 重新分析
              </span>
            </button>
          </div>
        </div>
      )}

      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center my-12 py-8">
          <LoadingSpinner size="large" message={`正在分析 ${movementName} 动作...`} />
        </div>
      )}

      {error && (
        <div className="mb-8 p-6 bg-red-50 border border-red-200 text-red-700 rounded-xl shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0 text-red-500">
              ❌
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">分析失败</h4>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {isPoseProcessing && (
        <div className="flex flex-col items-center justify-center my-12 py-8">
          <LoadingSpinner size="large" message="正在进行姿态估计..." />
        </div>
      )}

      {isModelLoading && (
        <div className="flex flex-col items-center justify-center my-12 py-8">
          <LoadingSpinner size="large" message="正在加载姿态估计模型..." />
        </div>
      )}

      {movementEvaluation && activeTab === 'camera' && (
        <div className="mt-8 p-6 bg-white rounded-xl shadow-md border border-emerald-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              ✅
            </div>
            <h3 className="text-lg font-semibold text-emerald-700">姿态评估结果</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">综合评分</span>
              <span className="text-2xl font-bold text-emerald-600">{movementEvaluation.score}/100</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-700 font-medium mb-2">评估反馈</p>
              <p className="text-gray-600">{movementEvaluation.feedback}</p>
            </div>
            {movementEvaluation.angles && Object.keys(movementEvaluation.angles).length > 0 && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-700 font-medium mb-2">关节角度</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(movementEvaluation.angles).map(([joint, angle]) => (
                    <div key={joint} className="flex justify-between">
                      <span className="text-gray-600">{joint}:</span>
                      <span className="font-medium">{angle}°</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {analysisResult && (
        <div className="mt-8">
          <ExampleAnalysis 
            movementType={movementType}
            movementName={movementName}
          />
          <ExampleAnalysis movementType={movementType} />
        </div>
      )}
    </div>
  );
};

export default VideoAnalysis;