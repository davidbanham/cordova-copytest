/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var fs;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(ret) {
          fs = ret;
          app.createFile('first', function(err) {
            if (err) throw err;
            app.receivedEvent('firstfilecreated');
            app.createFile('second', function(err) {
              if (err) throw err;
              app.receivedEvent('secondfilecreated');
              app.copyFile('second', 'first', function(err) {
                console.log(err);
                if (err) document.getElementById('filescopied').appendChild(document.createTextNode("Error! code: "+err.code));
                if (err) throw err;
                app.receivedEvent('filescopied');
                document.getElementById('filedisplay').src = 'cdvfile://localhost/persistent/first';
              })
            })
          })
        });
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    createFile: function(name, callback) {
      var onGetFileSuccess = function(handle) {
        handle.createWriter(function(writer) {
          writer.onwriteend = function() {
            callback(null);
          };
          writer.onerror = function(e) {
            callback(e);
          };
          var blob = new Blob([name], {type: 'text/plain'});
          writer.write(blob);
        }, fail);
      };
      var fail = function(err) {
        return callback(err);
      };
      fs.root.getFile(name, {create: true, exclusive: false}, onGetFileSuccess, fail);
    },
    copyFile: function(from, to, callback) {
      var fail = function(err) {
        return callback(err);
      };
      fs.root.getFile(from, {}, function(handle) {
        handle.copyTo(fs.root, to, function(){callback()}, fail);
      }, fail);
    }
};
