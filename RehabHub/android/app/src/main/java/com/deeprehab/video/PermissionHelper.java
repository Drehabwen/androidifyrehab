package com.deeprehab.video;

import android.content.Intent;
import android.net.Uri;
import android.provider.Settings;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

@CapacitorPlugin(name = "PermissionHelper")
public class PermissionHelper extends Plugin {

    private static final String TAG = "PermissionHelper";

    @PluginMethod
    public void openAppSettings(PluginCall call) {
        try {
            Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            Uri uri = Uri.fromParts("package", getContext().getPackageName(), null);
            intent.setData(uri);
            getActivity().startActivity(intent);
            call.resolve();
        } catch (Exception ex) {
            Log.e(TAG, "Error opening app settings", ex);
            call.reject("Failed to open app settings: " + ex.getMessage());
        }
    }
}