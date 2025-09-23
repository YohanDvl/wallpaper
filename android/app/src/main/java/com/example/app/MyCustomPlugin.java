package com.example.app;

import android.app.WallpaperManager;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;

import com.capacitorjs.plugins.toast.Toast;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

@CapacitorPlugin(name = "myCustomPlugin")
public class MyCustomPlugin extends Plugin {

  public static  final String CAPACITOR_SHARED_PREFERENCES_NAME = "CapacitorStorage";

  // Nuevo método: establece el wallpaper según target y URL pasada desde JS
  @PluginMethod()
  public void setWallpaper(PluginCall call) {
    String url = call.getString("url", null);
    String target = call.getString("target", "home"); // home | lock | both

    if (url == null || url.isEmpty()) {
      call.reject("URL vacía o nula");
      return;
    }

    new Thread(() -> {
      try {
        WallpaperManager wallpaperManager = WallpaperManager.getInstance(getContext());
        Bitmap bitmap = downloadImage(url);

        if (bitmap == null) {
          call.reject("No se pudo descargar la imagen");
          return;
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
          int flag = WallpaperManager.FLAG_SYSTEM; // home por defecto
          if ("lock".equals(target)) {
            flag = WallpaperManager.FLAG_LOCK;
          } else if ("both".equals(target)) {
            // Establecer ambos: primero home, luego lock
            wallpaperManager.setBitmap(bitmap, null, true, WallpaperManager.FLAG_SYSTEM);
            wallpaperManager.setBitmap(bitmap, null, true, WallpaperManager.FLAG_LOCK);
            JSObject result = new JSObject();
            result.put("success", true);
            call.resolve(result);
            return;
          }
          wallpaperManager.setBitmap(bitmap, null, true, flag);
        } else {
          // En APIs antiguas solo hay uno (home)
          wallpaperManager.setBitmap(bitmap);
        }

        JSObject result = new JSObject();
        result.put("success", true);
        call.resolve(result);
      } catch (IOException e) {
        e.printStackTrace();
        call.reject("Error: " + e.getMessage());
      }
    }).start();
  }

  // Método antiguo por compatibilidad: lee URL de Preferences
  @PluginMethod()
  public void execute(PluginCall call) {
    SharedPreferences sharedPreferences = getContext().getSharedPreferences(CAPACITOR_SHARED_PREFERENCES_NAME, Context.MODE_PRIVATE);
    String urlObject = sharedPreferences.getString("url", "");
    if (urlObject == null || urlObject.isEmpty()) {
      call.reject("URL no encontrada en Preferences");
      return;
    }
    // Por defecto aplica a pantalla principal
    call.set("url", urlObject);
    call.set("target", "home");
    setWallpaper(call);
  }

  private Bitmap downloadImage(String signedUrl){
    HttpURLConnection connection = null;

    try {
      URL url = new URL(signedUrl);
      connection = (HttpURLConnection) url.openConnection();
      connection.setDoInput(true);
      connection.connect();

      InputStream input = connection.getInputStream();
      return BitmapFactory.decodeStream(input);
    }catch (Exception e){
      e.printStackTrace();
      return null;
    } finally {
      if(connection !=null){
        connection.disconnect();
      }
    }
  }




}
