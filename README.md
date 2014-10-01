This code replicates what I believe to be a bug in the [Cordova File API](https://github.com/apache/cordova-plugin-file)

I have tested this in the xcode simulator (multiple simulated devices) and on an iPad2

To run the replication, simply clone the repo and run `cordova build ios`. Then open the resulting xcodeproj in xcode and deploy to a device or simulator

According to the spec, when copying a file over an existing file, the exiting file should be overwritten.

[copyTo spec](http://dev.w3.org/2009/dap/file-system/file-dir-sys.html#widl-Entry-copyTo-void-DirectoryEntry-parent-DOMString-newName-EntryCallback-successCallback-ErrorCallback-errorCallback)

Instead, the plugin return an error of code 12, indicating 'PATH_EXISTS_ERR'
