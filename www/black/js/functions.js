$(function(){
  'use strict';

  $('ul.tabs').tabs(); 
  $('.collapsible').collapsible();
  $('.modal-trigger').leanModal();
  $(function () {
    var count = 0;
    var wordsArray = ["Creative", "Innovative", "Clean", "Beautiful"];
    setInterval(function () {
      count++;
      $("#changeText").fadeOut(400, function () {
        $(this).text(wordsArray[count % wordsArray.length]).fadeIn(400);
      });
    }, 3000);
  });

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
      document.getElementById('blockui').style.display="none";
    } else {
      snapper2.open('right');
      document.getElementById('blockui').style.display="block";
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

  var duration_CONSTANT = 250;
  var options = {
    prefetch: true,
    cacheLength: 20,
    onStart: {
      duration: duration_CONSTANT,
      render: function ($container) {
        $container.addClass('is-exiting');
        smoothState.restartCSSAnimations();
        setTimeout(function () {
          if(initSidebar instanceof Function) {
            initSidebar();
          }
        },duration_CONSTANT*2);
      }
    },

    onReady: {
      duration: 0,
      render: function ($container, $newContent) {
        $container.removeClass('is-exiting');
        $container.html($newContent);
      }
    },

    onAfter: function($container, $newContent) {
      // Recall plugin here
      $('ul.tabs').tabs(); 
      $('.collapsible').collapsible();
      var model_div = '<div id="modal1" class="modal bottom-sheet features"> <div class="modal-content"> <div class="row"> <div class="col s3"> <a href="profile.html"> <i class="close-opacity mdi mdi-account"></i> <p>About</p> </a> </div> <div class="col s3"> <a href="portfolio.html"> <i class="mdi mdi-file-image-box"></i> <p>Photos</p> </a> </div> <div class="col s3"> <a href="blog.html"> <i class="mdi mdi-book-multiple-variant"></i> <p>Blog</p> </a> </div> <div class="col s3"> <a href="news.html"> <i class="mdi mdi-rss"></i> <p>News</p> </a> </div> </div> <div class="row"> <div class="col s3"> <a href="timeline.html"> <i class="mdi mdi-timelapse"></i> <p>Timeline</p> </a> </div> <div class="col s3"> <a href="messages.html"> <i class="mdi mdi-bell"></i> <p>Chat</p> </a> </div> <div class="col s3"> <a href="todo.html"> <i class="mdi mdi-checkbox-marked-outline"></i> <p>To Do</p> </a> </div> <div class="col s3"> <a href="login.html"> <i class="mdi mdi-account-plus"></i> <p>Account</p> </a> </div> </div> </div> </div>';
      $('body').prepend(model_div);
      $('.modal-trigger').leanModal();
      $(function() {
          var div = $('.box');
          var width = div.width();
          div.css('height', width);
      });
    }
    
  };
  
  var smoothState = $('#main').smoothState(options).data('smoothState');

});




      