(function(window) {
  'use strict';
  var AuthDNA = {
    _ctx: null,
    getContext: function() {
      if (this._ctx) return this._ctx;
      var n = window.navigator || {};
      var s = window.screen || {};
      this._ctx = {
        user_agent: n.userAgent || '',
        screen_resolution: s.width + 'x' + s.height,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
        language: n.language || '',
        platform: n.platform || '',
        color_depth: s.colorDepth || 0,
        cookie_enabled: n.cookieEnabled || false,
        hardware_concurrency: n.hardwareConcurrency || 0,
        device_memory: n.deviceMemory || 0,
        touch_support: ('ontouchstart' in window) || (n.maxTouchPoints > 0),
        canvas_hash: this._canvas(),
        webgl_renderer: this._webgl(),
      };
      return this._ctx;
    },
    _canvas: function() {
      try {
        var c = document.createElement('canvas'); c.width=200; c.height=50;
        var x = c.getContext('2d');
        x.textBaseline='top'; x.font='14px Arial';
        x.fillStyle='#f60'; x.fillRect(125,1,62,20);
        x.fillStyle='#069'; x.fillText('AuthDNA',2,15);
        var d = c.toDataURL(), h = 0;
        for(var i=0;i<d.length;i++){h=((h<<5)-h)+d.charCodeAt(i);h=h&h;}
        return Math.abs(h).toString(16);
      } catch(e) { return ''; }
    },
    _webgl: function() {
      try {
        var c = document.createElement('canvas');
        var g = c.getContext('webgl') || c.getContext('experimental-webgl');
        if(!g) return '';
        var d = g.getExtension('WEBGL_debug_renderer_info');
        return d ? g.getParameter(d.UNMASKED_RENDERER_WEBGL) || '' : '';
      } catch(e) { return ''; }
    }
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){AuthDNA.getContext();});
  else AuthDNA.getContext();
  window.AuthDNA = AuthDNA;
})(window);