function initSidebar() {

  var snapper = new Snap({
    element: document.getElementById('content'),
    hyperextensible: false
  });

  var addEvent = function addEvent(element, eventName, func) {
    if (element) {
      if (element.addEventListener) {
        return element.addEventListener(eventName, func, false);
      } else if (element.attachEvent) {
        return element.attachEvent("on" + eventName, func);
      }
    }
  };

  addEvent(document.getElementById('open-left'), 'click', function(){
    if( snapper.state().state=="left" ){
      snapper.close('left');
      document.getElementById('blockui').style.display="none";
    } else {
      snapper.open('left');
      document.getElementById('blockui').style.display="block";
    }
  });

  var snapper2 = new Snap({
    element: document.getElementById('content'),
    hyperextensible: false
  });

  $('#open-right').click(function(){
    if( snapper2.state().state=="right" ){
      snapper2.close('right');
    } else {
      snapper2.open('right');
    }
  });

  /* Prevent Safari opening links when viewing as a Mobile App */
  (function (a, b, c) {
    if(c in b && b[c]) {
      var d, e = a.location,
          f = /^(a|html)$/i;
      a.addEventListener("click", function (a) {
        d = a.target;
        while(!f.test(d.nodeName)) d = d.parentNode;
        "href" in d && (d.href.indexOf("http") || ~d.href.indexOf(e.host)) && (a.preventDefault(), e.href = d.href)
      }, !1)
    }
  })(document, window.navigator, "standalone");

};

//initSidebar(); 