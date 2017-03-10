/*
 * Copyright 2010 Nicholas C. Zakas. All rights reserved.
 * BSD Licensed.
 */
function CrossDomainStorage(origin, appendix){
    this.origin = origin;
    this.appendix = appendix;
    this._iframe = null;
    this._iframeReady = false;
    this._queue = [];
    this._requests = {};
    this._id = 0;
    this.init();
}

CrossDomainStorage.prototype = {

  //restore constructor
  constructor: CrossDomainStorage,

  //public interface methods

  init: function(){
    var that = this;
      if (!this._iframe){
          if (window.postMessage && window.JSON){
              this._iframe = document.createElement("iframe");
              this._iframe.style.cssText = "position:absolute;width:1px;height:1px;left:-9999px;";
              document.body.appendChild(this._iframe);

              if (window.addEventListener) {
                this._iframe.addEventListener("load", function () {
                  that._iframeLoaded();
                }, true);
                window.addEventListener("message", function(event) {
                  that._handleMessage(event);
                }, false);
              }
          } else {
              throw new Error("Unsupported browser.");
          }
      }

      this._iframe.src = this.origin + '/' + this.appendix;
      return this._iframe;

  },

  reConnect : function () {
    // this._iframeReady = false;
    this._iframe.src = this.origin + '/' + this.appendix;
  },

  requestValue: function(json, callback){
    var request = {
      id: ++this._id
    };
    var keys = Object.keys(json);
    for ( var i = 0; i < keys.length; i++) {
      request[keys[i]] = json[keys[i]];
    }
    var data = {
      request: request,
      callback: callback
    };

    if (this._iframeReady){
        this._sendRequest(data);
    } else {
        this._queue.push(data);
    }

    if (!this._iframe){
        this.init();
    }
  },

  //private methods
  _sendRequest: function(data){
    this._requests[data.request.id] = data;
    var that = this;
    setTimeout(function () {
      that._iframe.contentWindow.postMessage(JSON.stringify(data.request), '*');
    }, 2000);
  },

  _iframeLoaded: function(){
      this._iframeReady = true;
      if (this._queue.length){
        for (var i=0; i < this._queue.length; i++){
          this._sendRequest(this._queue[i]);
        }
        this._queue = [];
      }
  },

  _handleMessage: function(event){
    if (event.origin == this.origin){
      var data = JSON.parse(event.data);
      this._requests[data.request.id].callback(data.request, data.response);
      delete this._requests[data.request.id];
    }
  }

};
