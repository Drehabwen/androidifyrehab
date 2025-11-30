import { useState, useRef, useEffect, useCallback } from 'react';

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  status: 'loading' | 'active' | 'error' | 'permission_denied' | 'not_supported';
  errorMessage: string;
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
  reloadCamera: () => void;
}

export const useCamera = (): UseCameraReturn => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<'loading' | 'active' | 'error' | 'permission_denied' | 'not_supported'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  // 清理摄像头流
  const cleanupStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // 请求摄像头权限
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      // 检查浏览器支持
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setStatus('not_supported');
        setErrorMessage('您的浏览器不支持摄像头功能');
        return false;
      }

      // 获取摄像头权限
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      streamRef.current = stream;
      setHasPermission(true);
      return true;
    } catch (error: any) {
      console.error('摄像头权限请求失败:', error);
      setHasPermission(false);
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setStatus('permission_denied');
        setErrorMessage('请允许摄像头权限。您可以在浏览器设置中修改权限。');
      } else if (error.name === 'NotFoundError') {
        setStatus('error');
        setErrorMessage('未找到摄像头设备。请确保摄像头已连接并正常工作。');
      } else if (error.name === 'NotReadableError') {
        setStatus('error');
        setErrorMessage('摄像头被占用。请关闭可能正在使用摄像头的其他应用程序。');
      } else {
        setStatus('error');
        setErrorMessage(`摄像头访问失败: ${error.message || '未知错误'}`);
      }
      return false;
    }
  }, []);

  // 初始化摄像头
  const initCamera = useCallback(async () => {
    setStatus('loading');
    setErrorMessage('');

    try {
      const granted = await requestPermission();
      
      if (granted && videoRef.current && streamRef.current) {
        // 设置视频源
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.autoplay = true;
        videoRef.current.playsInline = true;
        videoRef.current.muted = true;
        
        // 等待视频加载
        videoRef.current.onloadeddata = () => {
          setStatus('active');
        };
      }
    } catch (error: any) {
      console.error('摄像头初始化失败:', error);
      setStatus('error');
      setErrorMessage(`初始化失败: ${error.message || '未知错误'}`);
    }
  }, [requestPermission]);

  // 重新加载摄像头
  const reloadCamera = useCallback(() => {
    cleanupStream();
    initCamera();
  }, [cleanupStream, initCamera]);

  // 组件挂载时初始化
  useEffect(() => {
    initCamera();

    // 清理函数
    return cleanupStream;
  }, [initCamera, cleanupStream]);

  return {
    videoRef,
    status,
    errorMessage,
    hasPermission,
    requestPermission,
    reloadCamera
  };
};