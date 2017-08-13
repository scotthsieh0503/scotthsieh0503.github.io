(function() {
  var app = angular.module('MySite', ['ngRoute']);

  app.controller('NavigationController', function($scope, $location){
    
    this.isPage = function(page){
          var active = (page === $location.path());
          return active; 
        }
    });
    
  app.controller('ProjectsController', function($scope){
      $scope.projects = projects;
      
      this.viewProject = function(project)
      {
        if(project.type == 'web')
        {
          $('<iframe/>').appendTo('.modal-body');
          var iframe = $('#project-view-modal').find('iframe');
          $(iframe).attr('src',project.url)
                   .attr('frameborder',0)
                   .css('margin', 'auto')
                   .css('display', 'block')
                   .css('width', '100%')
                   .css('overflow', 'hidden')
                   .height(500);
        }
        else if (project.type == 'gallery')
        {
          var gallery =
          '<div id="carousel-example-generic" class="carousel slide" data-ride="carousel">' +
            '<ol class="carousel-indicators">' +
             '<li data-target="#carousel-example-generic" data-slide-to="0" class="active" ></li>';
             for(var i=1; i < project.images.length; i++)
             {
               gallery = gallery +  '<li data-target="#carousel-example-generic" data-slide-to="' + i +'"></li>';
              }

            gallery = gallery + 
           '</ol>' +
           '<div class="carousel-inner" role="listbox">' +
           '<div class="item active">' +
               '<img src="'+ project.images[0] +'">' +
               '<div class="carousel-caption">' +
               '</div>' +
             '</div>'
           
           for(var i=1; i < project.images.length; i++)
           {
             gallery = gallery + '<div class="item">' +
               '<img src="'+ project.images[i] +'">' +
               '<div class="carousel-caption">' +
               '</div>' +
             '</div>'
           }
              
            gallery = gallery + 
           '</div>' +
           '<a class="left carousel-control" data-target="#carousel-example-generic" role="button" data-slide="prev">' +
             '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>' +
             '<span class="sr-only">Previous</span>' +
           '</a>' +
           '<a class="right carousel-control" data-target="#carousel-example-generic" role="button" data-slide="next">' +
             '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>' +
             '<span class="sr-only">Next</span>' +
           '</a>' +
          '</div>';
          
         $('.modal-body').html(gallery);
        }
        
        setTimeout(function(){$('#project-view-modal').modal('show')}, 100);
      };
      
      this.initial = function(project)
      {
          var words = project.name.split(" ");
          var initial = '';
          for (var i = 0; i < words.length ; i++) {
            initial = initial + words[i].charAt(0);
          }
          return initial;
      };
    });
  
  app.controller('AboutController', function($scope){  
    });
  
  

  app.config(function($routeProvider) {
  $routeProvider
   .when('/', {
    templateUrl: 'pages/home.html',    
    })
   .when('/projects', {
    templateUrl: 'pages/projects.html',
    controller: 'ProjectsController',
    controllerAs: 'projectCtrl'
  })
  .when('/about', {
    templateUrl: 'pages/about.html',
    controller: 'AboutController',
    controllerAs: 'aboutCtrl'
  })
  .otherwise({ redirectTo: '/' });
  });
  
  var projects = [
    {
      'name':'Maxeme Auto',
      'date': new Date(2014, 11, 1,0, 0, 0, 0),
      'description': 'Enteripise grade web application for inventory tracking, appointment scheduling, invoicing and accoutning for auto mechanic shops.',
      'icon' : 'projects/maxeme_auto/thumbnail.png',
      'type': 'gallery',
      'images': ['projects/maxeme_auto/2.png','projects/maxeme_auto/4.png','projects/maxeme_auto/5.png', 'projects/maxeme_auto/6.png'],
      'url' : null,
      'technologies' : ['php','symfony2','jquery', 'bootstrap', 'mysql', 'aws']
    },
    {
      'name':'Heart Breaker',
      'date': new Date(2013, 7, 15,0, 0, 0, 0),
      'description': 'Quick game of breakout to test if you are a heart breaker.',
      'type': 'web',
      'url': 'projects/heart_breaker/heart_breaker.html',
      'icon' : 'projects/heart_breaker/heart_breaker.png',
      'technologies' : ['html5', 'canvas', 'javascript', 'css3']
    },
    {
      'name':'Stick A Story',
      'date': new Date(2014, 11, 1,0, 0, 0, 0),
      'description': 'A social game where you take ridiculous picture, edit them with stickers and share them with your friends.',
      'icon' : 'projects/stick_a_story/thumbnail.png',
      'type': 'gallery',
      'images' : ['projects/stick_a_story/filter.png', 'projects/stick_a_story/scenario.png', 'projects/stick_a_story/decorate.png'],
      'url' : null,
      'technologies' : ['ios', 'objective-c', 'nosql', 'aws', 'api']
    },
    {
      'name':'Snow effect',
      'date': new Date(2013, 11, 1,0, 0, 0, 0),
      'description': 'Animated snow fall effect with wind movement.',
      'icon' : 'projects/snow/snow.png',
      'type': 'web',
      'url' : 'projects/snow/snow.html',
      'technologies' : ['html5', 'canvas', 'javascript', 'css3']
    },
    {
      'name':'Halloween',
      'date': new Date(2014, 11, 1,0, 0, 0, 0),
      'description': 'Realtime rain effect for an extra spooky halloween theme.',
      'icon' : 'projects/rain_drops/thumbnail.png',
      'type': 'web',
      'url' : 'projects/rain_drops/rain_drops.html',
      'technologies' : ['html5', 'canvas', 'javascript', 'css3', 'photoshop', 'rainjs']
    },
    {
      'name':'Starry night',
      'date': new Date(2012, 11, 1,0, 0, 0, 0),
      'description': 'An interactive experiment where you can connect many stars and decorate the sky with your own constellations.',
      'icon' : 'projects/starry_night/thumbnail.png',
      'type': 'web',
      'url' : 'projects/starry_night/starry_night.html',
      'technologies' : ['html5', 'canvas', 'javascript', 'css3']
    },
    {
      'name':'Canada Day',
      'date': new Date(2014, 11, 1,0, 0, 0, 0),
      'description': 'Animated fireworks effect to celebrate Canada day.',
      'icon' : 'projects/fireworks/thumbnail.png',
      'type': 'web',
      'url' : 'projects/fireworks/fireworks.html',
      'technologies' : ['html5', 'canvas', 'javascript', 'css3', 'illustrator']
    }
    ];
  
  
      
    $(document).on('hidden.bs.modal', function () {
        $(this).find('.modal-body').empty();
    })
    
})();