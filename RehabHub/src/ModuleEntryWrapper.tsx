import React from 'react';
import * as Icons from '@radix-ui/react-icons';

interface ModuleEntryWrapperProps {
  title: string;
  moduleId: string;
  children: React.ReactNode;
}

/**
 * 模块入口包装器
 * 为独立运行的模块提供统一的页面框架、标题和返回按钮
 */
const ModuleEntryWrapper: React.FC<ModuleEntryWrapperProps> = ({ title, moduleId, children }) => {
  // 返回主平台的函数
  const handleBackToHome = () => {
    // 如果在独立模式下，返回主平台
    window.location.href = '/';
  };

  // 获取模块图标的函数
  const getModuleIcon = () => {
    const iconMap: Record<string, React.ReactNode> = {
      'video-analysis': <Icons.VideoIcon className="w-6 h-6" />,
      'results-history': <Icons.ClockIcon className="w-6 h-6" />,
      'settings': <Icons.SliderIcon className="w-6 h-6" />,
    };
    return iconMap[moduleId] || <Icons.BoxIcon className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-primary-gray">
      <header className="bg-primary-white shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button className="flex items-center"
              onClick={handleBackToHome}
            >
              <Icons.HomeIcon className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-2xl font-bold text-text-primary">DeepRehab - {title}</h1>
            </button>
            <div className="flex items-center bg-primary/10 rounded-full px-3 py-1">
              {getModuleIcon()}
              <span className="ml-2 text-sm font-medium text-primary">独立模块模式</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-primary-white mt-auto border-t border-border py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            <div className="flex space-x-4 mb-4">
              <button
                onClick={handleBackToHome}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/30"
              >
                <Icons.ArrowLeftIcon className="mr-2 h-4 w-4" />
                返回主平台
              </button>
            </div>
            <p className="text-text-secondary text-sm">
              © {new Date().getFullYear()} DeepRehab - 专业康复分析平台
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModuleEntryWrapper;