import { useState, useEffect, useRef } from 'react';

type CameraStatus = 'loading' | 'active' | 'error' | 'not_supported' | 'permission_denied';

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  status: CameraStatus;
  errorMessage: string | null;
  requestPermission: () => Promise<void>;
  reloadCamera: () => void;
}

export const useCamera = (): UseCameraReturn => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<CameraStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const requestPermission = async () => {
    try {
      setStatus('loading');
      setErrorMessage(null);
      stopStream();

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setStatus('not_supported');
        setErrorMessage('您的浏览器不支持摄像头功能');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }, 
        audio: false 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setStatus('active');
        };
      }
    } catch (error) {
      console.error('摄像头权限请求失败:', error);
      
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        setStatus('permission_denied');
        setErrorMessage('需要摄像头权限才能使用此功能');
      } else {
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : '无法访问摄像头');
      }
    }
  };

  const reloadCamera = () => {
    requestPermission();
  };

  useEffect(() => {
    requestPermission();
    
    return () => {
      stopStream();
    };
  }, []);

  return {
    videoRef,
    status,
    errorMessage,
    requestPermission,
    reloadCamera
  };
};