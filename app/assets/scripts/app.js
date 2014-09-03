PubSub.subscribe('school.home', function () {
  var bindar = function () {
    $('#ultimosCursos .curso a').bind('mouseover', function(){
      var e = $(this),
        info = e.find('.info span'),
        infoem = info.find('em');
        detalhes = e.find('.detalhes');
      info.stop().animate({
        opacity: 0,
        marginTop: -60
      },100);
      infoem.stop().animate({
        marginTop: -70
      },200);
      detalhes.stop().animate({
        marginTop: -45
      },200);
    }).bind('mouseout', function(){
      var e = $(this),
        info = e.find('.info span'),
        infoem = info.find('em');
        detalhes = e.find('.detalhes');
      info.stop().animate({
        opacity: 0.9,
        marginTop: 0
      });
      infoem.stop().animate({
        marginTop: 10
      });
      detalhes.stop().animate({
        marginTop: 0
      });
    });
  }
  bindar();
});

var Util = {
  queryStringToObject: function (q) {
    q = q.replace('?', '');
    var query = q.split('&'), obj = {};
    for(var i = 0; i < query.length; i++) {
      var pair = query[i].split('=');
      obj[pair[0]] = pair[1];
    }
    return obj;
  }
};
