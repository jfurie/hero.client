package com.intelegate.cordova.plugin;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;

import android.app.Activity;
import android.content.Intent;

import android.content.SharedPreferences;
import android.content.Context;


public class LocalStoragePlugin extends CordovaPlugin {
	
    public static final String ACTION_ADD_KEY_VALUE_PAIR = "addKeyValuePair";
    public static final String ACTION_GET_KEY_VALUE_PAIR = "getKeyValuePair";

    public LocalStoragePlugin() {
    }
    
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
 
 	try {

 		Context context = this.cordova.getActivity().getApplicationContext();
 		SharedPreferences mPrefs = context.getSharedPreferences("myAppPrefs", Context.MODE_PRIVATE);

		if (ACTION_ADD_CALENDAR_ENTRY.equals(action)) { 

			JSONObject arg_object = args.getJSONObject(0);

			SharedPreferences.Editor editor = mPrefs.edit();

			String key = arg_object.getString("key");
			String val = arg_object.getString("value");

			editor.putString(key, val);
    		editor.commit();

			// Intent calIntent = new Intent(Intent.ACTION_ADD_KEY_VALUE_PAIR)
			//     .setType("vnd.android.cursor.item/event")
			//     .putExtra("beginTime", arg_object.getLong("startTimeMillis"))
			//     .putExtra("endTime", arg_object.getLong("endTimeMillis"))
			//     .putExtra("title", arg_object.getString("title"))
			//     .putExtra("description", arg_object.getString("description"))
			//     .putExtra("eventLocation", arg_object.getString("eventLocation"));

			//    this.cordova.getActivity().startActivity(calIntent);

			callbackContext.success();
			return true;
		}
		else if (ACTION_GET_KEY_VALUE_PAIR.equals(action)) { 

			String key = arg_object.getString("key");
			
			String returnValue = mPrefs.getString(key);

			if (returnValue!=null && returnValue!="") {
				callbackContext.success();
				return new PluginResult(PluginResult.Status.OK, returnValue);
			}

			callbackContext.error();
			return new PluginResult(PluginResult.Status.NO_RESULT, null);
			// JSONObject arg_object = args.getJSONObject(0);

			// SharedPreferences.Editor editor = mPrefs.edit();

			// editor.putBoolean('some value', true);
   //  		editor.commit();

			// Intent calIntent = new Intent(Intent.ACTION_ADD_KEY_VALUE_PAIR)
			//     .setType("vnd.android.cursor.item/event")
			//     .putExtra("beginTime", arg_object.getLong("startTimeMillis"))
			//     .putExtra("endTime", arg_object.getLong("endTimeMillis"))
			//     .putExtra("title", arg_object.getString("title"))
			//     .putExtra("description", arg_object.getString("description"))
			//     .putExtra("eventLocation", arg_object.getString("eventLocation"));

			//    this.cordova.getActivity().startActivity(calIntent);

				return new PluginResult(PluginResult.Status.OK, returnValue);


			
			return true;
		}
		callbackContext.error("Invalid action");
		return false;
		} catch(Exception e) {
		System.err.println("Exception: " + e.getMessage());
		callbackContext.error(e.getMessage());
		return false;
		} 

	}
	
}


