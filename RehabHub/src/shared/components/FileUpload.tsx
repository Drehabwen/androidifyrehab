import React, { useCallback, useState } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect, 
  accept = 'video/*', 
  maxSize = 100 * 1024 * 1024 // 默认100MB
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    // 检查文件大小
    if (file.size > maxSize) {
      setError(`文件大小不能超过 ${maxSize / (1024 * 1024)} MB`);
      return false;
    }

    // 检查文件类型
    if (accept !== '*') {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileType = file.type;
      const fileName = file.name.toLowerCase();
      
      const isAccepted = acceptedTypes.some(type => {
        // 处理通配符类型如 'video/*'
        if (type.endsWith('/*')) {
          const prefix = type.slice(0, -1); // 移除 '*'
          return fileType.startsWith(prefix);
        }
        // 处理具体MIME类型
        if (type.includes('/')) {
          return fileType === type;
        }
        // 处理文件扩展名
        if (type.startsWith('.')) {
          return fileName.endsWith(type);
        }
        return false;
      });

      if (!isAccepted) {
        setError(`不支持的文件类型。请上传 ${accept} 类型的文件`);
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      onFileSelect(file);
    }
  };

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      handleFile(file);
      event.dataTransfer.clearData();
    }
  }, [onFileSelect]);

  const onDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  }, []);

  const onDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      handleFile(file);
    }
  };

  const handleClickUpload = () => {
    // 清除之前的错误
    setError(null);
  };

  return (
    <div className="file-upload-component">
      <div 
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
          isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : error 
              ? 'border-red-500 bg-red-50' 
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        }`}
        onDrop={onDrop}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
      >
        <input 
          type="file" 
          className="hidden" 
          id="file-upload-input"
          accept={accept}
          onChange={onFileInputChange}
        />
        
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg 
            className="w-8 h-8 mb-4 text-gray-500" 
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 20 16"
          >
            <path 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          
          {isDragActive ? (
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">释放文件以上传</span>
            </p>
          ) : (
            <>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">点击上传</span> 或拖拽文件到此处
              </p>
              <p className="text-xs text-gray-500">
                {accept === 'video/*' ? 'MP4, AVI, MOV' : '支持的文件类型'} (最大 {maxSize / (1024 * 1024)} MB)
              </p>
            </>
          )}
          
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
        
        <label 
          htmlFor="file-upload-input"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          onClick={handleClickUpload}
        >
          选择文件
        </label>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>支持移动端上传视频文件进行分析</p>
      </div>
    </div>
  );
};

export default FileUpload;