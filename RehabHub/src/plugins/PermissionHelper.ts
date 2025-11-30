import { registerPlugin } from '@capacitor/core';

export interface PermissionHelperPlugin {
  openAppSettings(): Promise<void>;
}

const PermissionHelper = registerPlugin<PermissionHelperPlugin>('PermissionHelper');

export default PermissionHelper;