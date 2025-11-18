import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useCamera } from './hooks/useCamera.ts';
import { usePoseEstimation, type Keypoint } from './hooks/usePoseEstimation.ts';
import { usePermissions } from './hooks/usePermissions.ts';

interface CameraCaptureProps {
  onCapture: (image: string) => void;
  keypoints?: Keypoint[]; // 关键点数据
  onVideoFrame?: (videoElement: HTMLVideoElement) => void; // 视频帧回调
  showSkeleton?: boolean; // 是否显示骨骼点，默认true
  skeletonColor?: string; // 骨骼点颜色
  skeletonLineColor?: string; // 骨骼线条颜色
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ 
  onCapture, 
  keypoints = [], 
  onVideoFrame,
  showSkeleton = true,
  skeletonColor = '#FF0000',
  skeletonLineColor = '#00FFFF'
}) => {
  // 集成姿态估计hook
  const { 
    keypoints: estimatedKeypoints, 
    isProcessing, 
    isModelLoading, 
    processFrame,
    usingMockData 
  } = usePoseEstimation();
  
  // 权限管理hook
  const { openAppSettings } = usePermissions();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null); // 覆盖层canvas用于绘制骨骼点
  const frameCanvasRef = useRef<HTMLCanvasElement>(null); // 用于捕获视频帧的canvas
  const animationRef = useRef<number>(0);
  const lastProcessTimeRef = useRef<number>(0);
  // 性能优化相关引用
  const drawIntervalRef = useRef<number>(100); // 绘制间隔（毫秒）
  const lastDrawTimeRef = useRef<number>(0); // 上次绘制时间
  const frameCountRef = useRef<number>(0); // 帧数统计
  const lastFpsUpdateTimeRef = useRef<number>(0); // 上次FPS更新时间
  const avgFrameTimeRef = useRef<number>(0); // 平均帧时间
  const keypointsCacheRef = useRef<Keypoint[]>([]); // 关键点缓存
  
  // 视频尺寸状态，用于正确设置canvas大小
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });
  
  const { 
    videoRef, 
    status, 
    errorMessage, 
    requestPermission,
    reloadCamera 
  } = useCamera();
  
  // 合并外部传入的关键点和组件内部处理的关键点
  // 优先使用外部传入的关键点，如果没有则使用内部估计的关键点
  const combinedKeypoints = keypoints && keypoints.length > 0 ? 
    keypoints : estimatedKeypoints;
  
  // 更新视频尺寸
  useEffect(() => {
    if (videoRef.current && status === 'active') {
      const updateDimensions = () => {
        if (videoRef.current) {
          setVideoDimensions({
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight
          });
        }
      };
      
      // 初始更新
      updateDimensions();
      
      // 窗口大小改变时更新
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }
  }, [status]);
  
  // 根据视频尺寸设置canvas大小
  useEffect(() => {
    if (overlayCanvasRef.current && videoDimensions.width > 0 && videoDimensions.height > 0) {
      const canvas = overlayCanvasRef.current;
      canvas.width = videoDimensions.width;
      canvas.height = videoDimensions.height;
      
      // 设置CSS尺寸以确保canvas正确缩放
      const videoContainer = canvas.parentElement;
      if (videoContainer) {
        const containerRect = videoContainer.getBoundingClientRect();
        canvas.style.width = `${containerRect.width}px`;
        canvas.style.height = `${containerRect.height}px`;
      }
    }
  }, [videoDimensions]);
  
  // 调试: 记录接收到的关键点
  useEffect(() => {
    console.log('CameraCapture收到的关键点数量:', combinedKeypoints.length);
    if (combinedKeypoints.length > 0) {
      console.log('关键点示例:', combinedKeypoints.slice(0, 3));
    }
  }, [combinedKeypoints]);

  // 绘制关键点到覆盖层canvas
  const drawKeypoints = useCallback(() => {
    // 如果不显示骨骼点，直接返回
    if (!showSkeleton) {
      return;
    }
    
    // 控制绘制频率 - 动态调整绘制间隔以优化性能
    const now = Date.now();
    const elapsed = now - lastDrawTimeRef.current;
    
    // 根据设备性能动态调整绘制间隔
    if (elapsed < drawIntervalRef.current) {
      return;
    }
    
    // 性能监测 - 计算FPS和帧时间
    frameCountRef.current++;
    if (now - lastFpsUpdateTimeRef.current >= 1000) {
      const currentFps = frameCountRef.current;
      frameCountRef.current = 0;
      lastFpsUpdateTimeRef.current = now;
      
      // 动态调整绘制间隔以保持流畅
      if (currentFps < 20) {
        // FPS过低，降低绘制频率
        drawIntervalRef.current = Math.min(drawIntervalRef.current + 5, 200);
      } else if (currentFps > 30) {
        // FPS充足，可以提高绘制频率
        drawIntervalRef.current = Math.max(drawIntervalRef.current - 5, 30);
      }
      
      // 更新平均帧时间
      avgFrameTimeRef.current = elapsed;
    }
    
    lastDrawTimeRef.current = now;

    if (!overlayCanvasRef.current || status !== 'active') {
      return;
    }

    const canvas = overlayCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('无法获取Canvas上下文');
      return;
    }

    // 检查是否有新数据，没有则跳过绘制
    const hasNewKeypoints = combinedKeypoints.length > 0 && 
      (combinedKeypoints.length !== keypointsCacheRef.current.length ||
       JSON.stringify(combinedKeypoints) !== JSON.stringify(keypointsCacheRef.current));
    
    // 如果没有新数据且距离上次清除时间不长，则跳过清除步骤
    if (!hasNewKeypoints && canvas.width > 0 && canvas.height > 0) {
      // 仅在必要时清除，减少重绘开销
      // 注意：这里我们仍然进行绘制，但会跳过一些不必要的操作
    } else {
      // 清除之前的绘制
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // 更新缓存
      keypointsCacheRef.current = [...combinedKeypoints];
    }

    // 绘制关键点
    if (combinedKeypoints.length > 0 && canvas.width > 0 && canvas.height > 0) {
      // 创建关键点映射以快速查找
      const keypointMap = new Map(combinedKeypoints.map(kp => [kp.name, kp]));
      
      // 首先绘制骨架连接线
      try {
        // 定义关键点连接关系 - 支持不同命名约定
        const connections = [
          // 肩线
          ['left_shoulder', 'right_shoulder'],
          ['leftShoulder', 'rightShoulder'],
          // 手臂
          ['left_shoulder', 'left_elbow'],
          ['leftShoulder', 'leftElbow'],
          ['right_shoulder', 'right_elbow'],
          ['rightShoulder', 'rightElbow'],
          ['left_elbow', 'left_wrist'],
          ['leftElbow', 'leftWrist'],
          ['right_elbow', 'right_wrist'],
          ['rightElbow', 'rightWrist'],
          // 躯干
          ['left_shoulder', 'left_hip'],
          ['leftShoulder', 'leftHip'],
          ['right_shoulder', 'right_hip'],
          ['rightShoulder', 'rightHip'],
          ['left_hip', 'right_hip'],
          ['leftHip', 'rightHip'],
          // 腿部
          ['left_hip', 'left_knee'],
          ['leftHip', 'leftKnee'],
          ['right_hip', 'right_knee'],
          ['rightHip', 'rightKnee'],
          ['left_knee', 'left_ankle'],
          ['leftKnee', 'leftAnkle'],
          ['right_knee', 'right_ankle'],
          ['rightKnee', 'rightAnkle']
        ];
        
        ctx.strokeStyle = skeletonLineColor;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        connections.forEach(([startName, endName]) => {
          // 尝试两种命名约定
          const startPoint = keypointMap.get(startName) || keypointMap.get(startName.replace('_', ''));
          const endPoint = keypointMap.get(endName) || keypointMap.get(endName.replace('_', ''));
          
          if (startPoint && endPoint) {
            // 只有当两个点的置信度都足够高时才绘制连接线
            const minScore = 0.2;
            const startScore = startPoint.score !== undefined ? startPoint.score : 1;
            const endScore = endPoint.score !== undefined ? endPoint.score : 1;
            
            if (startScore >= minScore && endScore >= minScore) {
              const startX = Math.max(0, Math.min(1, startPoint.x)) * canvas.width;
              const startY = Math.max(0, Math.min(1, startPoint.y)) * canvas.height;
              const endX = Math.max(0, Math.min(1, endPoint.x)) * canvas.width;
              const endY = Math.max(0, Math.min(1, endPoint.y)) * canvas.height;
              
              // 根据置信度调整线条透明度
              const avgScore = (startScore + endScore) / 2;
              ctx.globalAlpha = avgScore;
              
              ctx.beginPath();
              ctx.moveTo(startX, startY);
              ctx.lineTo(endX, endY);
              ctx.stroke();
            }
          }
        });
        
        // 重置透明度
        ctx.globalAlpha = 1;
      } catch (error) {
        console.error('绘制骨架连接线时出错:', error);
      }
      
      // 然后绘制关键点（在线条上方）
      try {
        combinedKeypoints.forEach(point => {
          // 确保坐标在有效范围内
          const x = Math.max(0, Math.min(1, point.x)) * canvas.width;
          const y = Math.max(0, Math.min(1, point.y)) * canvas.height;
          const score = point.score !== undefined ? point.score : 1;
          
          // 根据置信度调整点的大小和透明度
          const baseSize = 5;
          const size = baseSize + (score * baseSize * 0.5);
          const opacity = score;
          
          // 设置透明度
          ctx.globalAlpha = opacity;
          
          // 绘制关键点外圈
          ctx.beginPath();
          ctx.arc(x, y, size + 2, 0, 2 * Math.PI);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
          
          // 绘制关键点
          ctx.beginPath();
          ctx.arc(x, y, size, 0, 2 * Math.PI);
          ctx.fillStyle = skeletonColor;
          ctx.fill();
          
          // 绘制置信度标签（仅在置信度较低时显示）
          if (point.score !== undefined && point.score < 0.8) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '10px Arial';
            ctx.fillText(`${Math.round(point.score * 100)}%`, x + 8, y - 8);
          }
        });
        
        // 重置透明度
        ctx.globalAlpha = 1;
      } catch (error) {
        console.error('绘制关键点时出错:', error);
        ctx.globalAlpha = 1; // 确保重置透明度
      }
    }
  }, [combinedKeypoints, status, showSkeleton, skeletonColor, skeletonLineColor]);

  // 实时处理视频帧
  const processVideoFrame = useCallback(() => {
    if (!videoRef.current || status !== 'active') {
      animationRef.current = requestAnimationFrame(processVideoFrame);
      return;
    }

    const video = videoRef.current;
    
    // 控制处理频率，每100ms处理一次以提高实时性
    const now = Date.now();
    if (now - lastProcessTimeRef.current > 100) {
      lastProcessTimeRef.current = now;
      
      // 调用onVideoFrame回调
      if (onVideoFrame) {
        console.log('调用onVideoFrame回调处理视频帧');
        onVideoFrame(video);
      }
      
      // 仅当没有外部关键点数据时，才在组件内部进行姿态估计
      if (!keypoints || keypoints.length === 0) {
        if (video && !isProcessing) {
          processFrame(video);
        }
      }
    }
    
    // 继续下一帧处理
    animationRef.current = requestAnimationFrame(processVideoFrame);
  }, [status, onVideoFrame, keypoints, isProcessing, processFrame]);

  // 启动/停止视频帧处理
  useEffect(() => {
    if (status === 'active') {
      console.log('摄像头激活，开始处理视频帧');
      animationRef.current = requestAnimationFrame(processVideoFrame);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [status, processVideoFrame]);
  
  // 调试信息 - 可以在开发环境中显示
  useEffect(() => {
    if (isModelLoading) {
      console.log('姿态检测模型正在加载...');
    } else if (usingMockData) {
      console.log('使用模拟姿态数据');
    }
  }, [isModelLoading, usingMockData]);

  // 添加连续绘制机制，使用requestAnimationFrame优化性能
  // 移除了基于关键点变化的绘制机制，避免与requestAnimationFrame冲突
  useEffect(() => {
    let animationFrameId: number;
    
    const animate = () => {
      if (status === 'active' && showSkeleton) {
        drawKeypoints();
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    
    if (status === 'active' && showSkeleton) {
      animationFrameId = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [status, showSkeleton, drawKeypoints]);
  
  // 创建动画帧引用
  const animationFrameIdRef = useRef<number | undefined>(undefined);
  
  // 监听窗口大小变化，调整canvas自适应
  useEffect(() => {
    const handleResize = (() => {
      let throttled = false;
      return () => {
        if (status === 'active' && overlayCanvasRef.current) {
          // 节流处理，避免频繁调整
          if (!throttled) {
            throttled = true;
            setTimeout(() => {
              if (videoRef.current) {
                const updateDimensions = () => {
                  if (videoRef.current) {
                    setVideoDimensions({
                      width: videoRef.current.videoWidth,
                      height: videoRef.current.videoHeight
                    });
                  }
                };
                updateDimensions();
              }
              throttled = false;
            }, 200);
          }
        }
      };
    })();
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [status]);
  
  // 组件卸载时清理资源
  useEffect(() => {
    return () => {
      // 清空缓存
      keypointsCacheRef.current = [];
      // 清除所有定时器和动画帧
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  // 连续绘制机制已在上一个effect中实现


  // 拍照功能
  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current || status !== 'active') {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // 设置canvas尺寸
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // 绘制图像
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      onCapture(imageDataUrl);
    }
  };

  // 手动请求权限
  const handleRequestPermission = async () => {
    await requestPermission();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* 摄像头预览区域 */}
      <div className="relative bg-black rounded-xl overflow-hidden mb-6 shadow-lg border border-gray-200 transition-all hover:shadow-xl aspect-[16/9] max-h-[480px]">
        {status === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-white text-center space-y-6">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400 mx-auto"></div>
                <div className="animate-ping absolute inset-0 rounded-full h-16 w-16 bg-blue-500 opacity-20 mx-auto"></div>
              </div>
              <h3 className="text-xl font-medium tracking-wide">正在启动摄像头...</h3>
              <p className="text-gray-300 max-w-xs mx-auto">请确保您的设备已授予摄像头访问权限</p>
            </div>
          </div>
        )}
        
        {(status === 'error' || status === 'not_supported') && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50">
            <div className="text-center p-8 rounded-xl bg-white shadow-lg max-w-md mx-4">
              <div className="text-red-500 text-5xl mb-5 animate-pulse">❌</div>
              <h3 className="text-xl font-bold text-red-700 mb-3">摄像头启动失败</h3>
              <p className="text-red-600 mb-5">{errorMessage}</p>
              <button 
                onClick={reloadCamera}
                className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-50 shadow-md"
              >
                🔄 重新加载
              </button>
            </div>
          </div>
        )}
        
        {status === 'permission_denied' && (
          <div className="absolute inset-0 flex items-center justify-center bg-yellow-50">
            <div className="text-center p-8 rounded-xl bg-white shadow-lg max-w-md mx-4">
              <div className="text-yellow-500 text-5xl mb-5 animate-bounce">⚠️</div>
              <h3 className="text-xl font-bold text-yellow-700 mb-3">摄像头权限被拒绝</h3>
              <p className="text-yellow-600 mb-6">{errorMessage}</p>
              <div className="flex flex-col gap-4 max-w-xs mx-auto">
                <button 
                  onClick={handleRequestPermission}
                  className="px-8 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:ring-opacity-50 shadow-md"
                >
                  🔒 请求权限
                </button>
                <button 
                  onClick={openAppSettings}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 shadow-md"
                >
                  ⚙️ 应用设置
                </button>
                <button 
                  onClick={reloadCamera}
                  className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50 shadow-md"
                >
                  🔄 重新加载
                </button>
              </div>
            </div>
          </div>
        )}
        
        <video
        ref={videoRef}
        className={status === 'active' ? 'w-full h-auto max-h-96 object-cover block' : 'w-full h-auto max-h-96 object-cover hidden'}
      />
        
        {/* 覆盖层Canvas用于绘制骨骼点 - 确保定位正确 */}
      {status === 'active' && showSkeleton && (
        <canvas
          ref={overlayCanvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
        />
      )}
      </div>

      {/* 拍照按钮 */}
      {status === 'active' && (
        <div className="text-center">
          <button
              onClick={takePhoto}
              className="px-10 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 shadow-md hover:shadow-lg min-w-[160px]"
            >
              <span className="flex items-center justify-center">
                📊 开始评估
              </span>
            </button>
        </div>
      )}

      {/* 隐藏的画布用于拍照 */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* 隐藏的画布用于视频帧捕获 */}
      <canvas ref={frameCanvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;