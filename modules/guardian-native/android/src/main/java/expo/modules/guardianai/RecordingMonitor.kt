package expo.modules.guardianai

import android.content.Context
import android.provider.MediaStore
import android.provider.Settings
import java.util.concurrent.TimeUnit

object RecordingMonitor {
  data class Recording(val uri:String,val name:String,val modified:Long)

  fun newestAccessibleRecording(context: Context, afterMs: Long): Recording? {
    val collection = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI
    val projection = arrayOf(MediaStore.Audio.Media._ID, MediaStore.Audio.Media.DISPLAY_NAME,
      MediaStore.Audio.Media.DATE_MODIFIED, MediaStore.Audio.Media.MIME_TYPE)
    val selection = "${MediaStore.Audio.Media.DATE_MODIFIED} >= ?"
    val args = arrayOf(TimeUnit.MILLISECONDS.toSeconds(afterMs).toString())
    context.contentResolver.query(collection, projection, selection, args,
      "${MediaStore.Audio.Media.DATE_MODIFIED} DESC")?.use { c ->
      if(c.moveToFirst()){
        val id=c.getLong(0); val name=c.getString(1) ?: "recording"
        val modified=c.getLong(2)*1000
        return Recording("${collection}/$id",name,modified)
      }
    }
    return null
  }
}