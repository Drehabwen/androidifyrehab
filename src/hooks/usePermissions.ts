import { useState } from 'react';

interface PermissionStatus {
  granted: boolean;
  canRequestAgain: boolean;
}

interface UsePermissionsReturn {
  checkPermission: (permission: string) => Promise<PermissionStatus>;
  requestPermission: (permission: string) => Promise<PermissionStatus>;
  openAppSettings: () => Promise<void>;
}

export const usePermissions = (): UsePermissionsReturn => {
  const [permissionStatus, setPermissionStatus] = useState<Record<string, PermissionStatus>>({});

  // 检查权限状态
  const checkPermission = async (permission: string): Promise<PermissionStatus> => {
    // 在Web环境中模拟权限检查
    const status = permissionStatus[permission] || { granted: false, canRequestAgain: true };
    return status;
  };

  // 请求权限
  const requestPermission = async (permission: string): Promise<PermissionStatus> => {
    // 在Web环境中模拟权限请求
    const status = { granted: true, canRequestAgain: true };
    setPermissionStatus(prev => ({ ...prev, [permission]: status }));
    return status;
  };

  // 打开应用设置页面
  const openAppSettings = async (): Promise<void> => {
    try {
      // 如果在Capacitor环境中，使用我们自定义的PermissionHelper插件打开设置页面
      if ((window as any).Capacitor) {
        const PermissionHelper = (await import('../plugins/PermissionHelper')).default;
        await PermissionHelper.openAppSettings();
      } else {
        // 在Web环境中提示用户
        alert('请在浏览器设置中手动授予摄像头权限');
      }
    } catch (error) {
      console.error('Failed to open app settings:', error);
      alert('无法自动打开设置页面，请手动在系统设置中授予摄像头权限');
    }
  };

  return {
    checkPermission,
    requestPermission,
    openAppSettings
  };
};