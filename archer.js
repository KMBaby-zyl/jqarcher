// archer
// Originall author: @KMBaby-zyl
// date: 2014-10-19
// Licensed under the MIT license
// 移动滚屏插件，快速创建大翻页
// 再测试下
;(function($,window,document,undefined){

  // utils to check translate3d
  function has3d() {
    var el = document.createElement('p'),
        has3d,
        transforms = {
            'webkitTransform':'-webkit-transform',
            'OTransform':'-o-transform',
            'msTransform':'-ms-transform',
            'MozTransform':'-moz-transform',
            'transform':'transform'
        };
    document.body.insertBefore(el, null);

    for (var t in transforms) {
        if (el.style[t] !== undefined) {
            el.style[t] = "translate3d(1px,1px,1px)";
            has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
        }
    }

    document.body.removeChild(el);

    return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
  }

  var pluginName = "archer",
      defaults = {
      };

  function archer(element, options){
    this.element = element;
    this.options = $.extend({},defaults,options);

    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }



  archer.prototype.init = function(){

      var touchsurface = this.element[0];
      var touchmove, touched, startX, startY, lastTouch, moved;
      var translate3d = has3d(),
          orientation = 'vertical',
          pages = this.element.children().children().length - 1;
          cur = 0,
          windowHeight = $(window).height();

      this.element.children().children().height(windowHeight);

      touchsurface.scrollTo2 = function (x, y) {
        orientation === 'vertical' ? (y = y ? (y + 'px') : 0, x = 0) : (x = x ? (x + 'px') : 0, y = 0);
        $(touchsurface).css('-webkit-transform', 'translate' + (translate3d ? '3d' : '') + '(' + x + ',' + y + (translate3d ? ',0' : '') + ')');
        touchsurface.style['webkitTransition'] = '';
      };

      touchsurface.scrollTo = function (x, y) {
        orientation === 'vertical' ? (y = y ? (y + 'px') : 0, x = 0) : (x = x ? (x + 'px') : 0, y = 0);
        $(touchsurface).css('-webkit-transform', 'translate' + (translate3d ? '3d' : '') + '(' + x + ',' + y + (translate3d ? ',0' : '') + ')');
        touchsurface.style['webkitTransition'] = '-webkit-transform ease-out 0.3s';
      };

      touchsurface.swipe = function (swipedir){
         windowHeight = $(window).height();

        if(swipedir == "up"){
          cur++;
          touchsurface.scrollTo(0,-(cur)*windowHeight);
        }else if(swipedir == "down"){
          cur--;
          touchsurface.scrollTo(0,-(cur)*windowHeight);
        }
      }

      touchsurface.back = function(){
        windowHeight = $(window).height();
        touchsurface.scrollTo(0, -windowHeight * cur);
      }
      touchsurface.addEventListener('touchstart', function(e){
        var t;
        if (t = e.touches) { t = t[0]; } else { t = e; }
        touchmove = moved = 0;
        touched = 1;
        startX = t.pageX;
        startY = t.pageY;
        lastTouch = t;
      }, false);

      touchsurface.addEventListener('touchmove', function(e){
        if(touched){
          var t, v, x, y,left,top;
          moved = 1;
          if (t = e.touches) { t = t[0]; } else { t = e; }
          left = touchsurface.left = t.pageX - startX;
          top = touchsurface.top = t.pageY - startY;

          touchsurface.scrollTo2(left ,top - (cur*windowHeight));

          lastTouch = t;
          e.preventDefault();
        }
      },false);

      touchsurface.addEventListener('touchCancel',function(e) {

      },false);

      touchsurface.addEventListener('touchend', function(e){
        var t, x, y, v;
        if (touched && moved) {
          if (t = e.touches) { t = t[0]; } else { t = e; }
          t = lastTouch;
          x = t.pageX - startX; y = t.pageY - startY;
          v = orientation === 'vertical' ? y : x;
          if (v > 20) {
            if(cur == 0){ touchsurface.scrollTo(0,0); return;}
            touchsurface.swipe('down');
          }else if (v < -20) {
            if(cur == pages){ touchsurface.scrollTo(0,-pages*windowHeight); return;}
            touchsurface.swipe('up');
          }else {
            touchsurface.back();
          }
          touchmove = 1;
        }
        touched = 0; moved = 0;
        if (touchmove)
          e.preventDefault();

      }, false);

  }

  $.fn.archer = function(options){
    return new archer(this,options)
  }

})(jQuery, window, document);
