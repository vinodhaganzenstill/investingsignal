app.controller('TodoListController', function($scope, $interval, Session) {

  	/*$("body").on("contextmenu",function(){
       return false;
    });*/

  	$scope.summary = {};

    summaryref.on('value', function(snapshot) {
         var results = snapshot.val();
         var new_resuts = {};
         angular.forEach(results, function(scre,k){
          new_resuts[k] = [];
          var kk2 = 0;
          angular.forEach(scre, function(i2,k2){
            if(kk2<5){
              new_resuts[k].push(angular.copy(i2));
            }
            kk2++;
          });
         });
         $scope.$apply(function(){
          $scope.summary = angular.copy(new_resuts);
         });
      });


  	current_price.on('value', function(snapshot) {
  		var results = snapshot.val();
  		$scope.$apply(function(){
	  		 angular.forEach(results, function(res,k){
	  		 	$scope.current_price = res;
	  		 });
	  	});
  	});

  	textchatref.once('value', function(snapshot) {
  		var results = snapshot.val();
  		$scope.$apply(function(){
	  		 angular.forEach(results, function(res,k){
	  		 	$scope.screener_result.push(res);
	  		 });
	  		 $scope.filter_results();
	  	});
  	});

  	textchatref.endAt().limitToLast(1).on('child_added', function(snapshot) {
  			var results = snapshot.val();
	  		$scope.$apply(function(){
	  			$scope.screener_result.push(results);
	  			$scope.filter_results();
	  		});
  	});

  	$scope.current_price = {};
  	$scope.screener_result = [];
  	$scope.fiter = {};
  	$scope.buy_result = [];
  	$scope.sell_result = [];

  	$scope.today = new Date(new Date().toDateString()).getTime();
  	$scope.initial = new Date('04-17-2018').getTime();
  	$scope.current_result = new Date(new Date().toDateString()).getTime();

    $scope.screener_result_active = [];

  	$scope.filter_results = function(){
  		$scope.buy_result = angular.copy($scope.screener_result.filter(function(a){
	  		return a.loadedTime > $scope.current_result && a.loadedTime < $scope.current_result+86400000 && a.fiveMins === 'Strong Buy' && a.fifteenMins === 'Strong Buy' && a.hourly === 'Strong Buy';
	  	}));
	  	$scope.buy_result_map = $scope.buy_result.map((aa) => aa.stockName);
	  	$scope.buy_result = $scope.buy_result.filter((v, i) => $scope.buy_result_map.indexOf(v.stockName) === i);
	  	$scope.sell_result = angular.copy($scope.screener_result.filter(function(a){
	  		return a.loadedTime > $scope.current_result && a.loadedTime < $scope.current_result+86400000 && a.fiveMins === 'Strong Sell' && a.fifteenMins === 'Strong Sell' && a.hourly === 'Strong Sell'; 
	  	}));
	  	$scope.sell_result_map = $scope.sell_result.map((aa) => aa.stockName);
	  	$scope.sell_result = $scope.sell_result.filter((v, i) => $scope.sell_result_map.indexOf(v.stockName) === i);

      $scope.screener_result_active = angular.copy($scope.screener_result.filter(function(a){
        return a.loadedTime > $scope.current_result && a.loadedTime < $scope.current_result+86400000;
      }));

	   };

  	$scope.change_date = function(n){
  		var nextDay = new Date($scope.current_result);
		  nextDay.setDate(nextDay.getDate()+n)
		  $scope.current_result = nextDay.getTime();
		  $scope.filter_results();
  	};

  	$scope.reset = function(){
  		$scope.current_result = new Date(new Date().toDateString()).getTime();
  		$scope.filter_results();
  	};

  	$scope.$watch('buy_result.length', function(n,o){

  	});

  	$scope.$watch('sell_result.length', function(n,o){

  	});

  	/*setInterval(function(){
  		$scope.devtools = /./;
		$scope.devtools.toString = function() {
		  this.opened = true;
		}
  		alert($scope.devtools.opened);
  	}, 2000);*/

  	$scope.tab = 1;
    $scope.login = false;
    $scope.register = false;

  	$scope.colors = {
  		Neutral: 'gray',
  		Sell: 'lightpink',
  		'Strong Sell': 'red',
  		Buy: 'lightgreen',
  		'Strong Buy': 'green'
  	};


  	$scope.candle = {
  		fiveMins: '5 Minutes',
  		fifteenMins: '15 Minutes',
  		hourly: 'Hourly',
  		daily: 'Daily'
  	};

    $scope.user = {};
    var user = new Firebase('https://sharemarket-52975.firebaseio.com/Users/');
    $scope.add_user = function(){
      $scope.user.created = new Date().getTime();
      user.push($scope.user);
      $scope.user = {};
      
      $scope.register = false;
      $scope.login = true;
    };


    $scope.loggedin = function(){
      user.once('value', function(snapshot) {
        var results = snapshot.val();
        angular.forEach(results, function(res,k){
          if(res.email == $scope.user.email && res.password == $scope.user.password){
            $scope.$apply(function(){
              res.id = k;
              Session.create(res, true);
              $scope.user = {};
              $scope.login = false;
              $scope.logged_user = Session.user;
              $scope.is_user_logged_in = Session.is_logged_in;
              $scope.tab = 4;
            });
          }
        });
      });
    };

    $scope.logged_user = Session.user;
    $scope.is_user_logged_in = Session.is_logged_in;

    $scope.logout = function(){
      Session.destroy();
      $scope.logged_user = Session.user;
      $scope.is_user_logged_in = Session.is_logged_in;
    };

    $scope.tour = function(){
      var tour = {
        data : [
          { element: '.index_trend label:first', tooltip: 'Nifty current trend, it contains four gradient respective 5mins, 15mins, 1hour and daily candle trend'},
          { element: '.nav-tabs .today_signal_tab', 'tooltip' : 'Live Buy and Sell Signals here' },
          { element: '.nav-tabs .summary_tab', 'tooltip' : 'Today Summary live update top gainers, losers, high volume, high price movement and upper bollinger bnd cross over stocks' },
          { element: '.nav-tabs .allsignals_tab', 'tooltip' : 'All Signals history available, we can do custom filter here' },
          { element: '.nav-tabs .virtual_training_tab', 'tooltip' : 'Virtual Trading platform, we can buy and sell stocks in live market price with virtual money' }
        ],
        controlsPosition : 'TR'
      }

      $scope.tour_data = $.aSimpleTour(tour);
    };
  });