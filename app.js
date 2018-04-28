var textchatref = new Firebase('https://sharemarket-52975.firebaseio.com/Buy-Sell-Signals/');
var current_price = new Firebase('https://sharemarket-52975.firebaseio.com/Current-Price/');
var summary = {};
summary.high_volume = new Firebase('https://sharemarket-52975.firebaseio.com/High volume stocks/');
summary.high_price_movement = new Firebase('https://sharemarket-52975.firebaseio.com/High Price Movement in last 5 minutes/');
summary.top_losers = new Firebase('https://sharemarket-52975.firebaseio.com/Most Percentage Lose/');
summary.top_gainers = new Firebase('https://sharemarket-52975.firebaseio.com/Most Percentage Changes of the day/');
summary.upper_bolliger_crossover = new Firebase('https://sharemarket-52975.firebaseio.com/Upper Bollinger band crossover(15 mts)/');

angular.module('todoApp', [])
	.filter('startFrom', function() {
	    return function(input, start) {
	    	if(input === undefined) {
	    		return [];
	    	} else {
	    		start = +start; //parse to int
	        	return input.slice(start);
	    	}
	    }
	})
  .controller('TodoListController', function($scope, $interval) {

  	/*$("body").on("contextmenu",function(){
       return false;
    });*/

  	$scope.summary = {};
    $scope.summary.high_volume = [];
    $scope.summary.high_price_movement = [];
    $scope.summary.top_losers = [];
    $scope.summary.top_gainers = [];
    $scope.summary.upper_bolliger_crossover = [];

    $scope.summary_label = {
    	top_gainers: 'Top Gainer',
    	top_losers: 'Top Loser',
    	high_volume: 'High Volume',
    	high_price_movement: 'High Price Movement (Last 15mts)',
    	upper_bolliger_crossover: 'Cross Over Upper Bollinger (Last 15mts)'
    };
    
    angular.forEach(summary, function(v,k){
    	v.on('value', function(snapshot) {
    		$scope.summary[k] = [];
	  		var results = snapshot.val();
	  		$scope.$apply(function(){
		  		 angular.forEach(results, function(res,k1){
		  		 	if($scope.summary[k].length < 5){
						$scope.summary[k].push(res);
		  		 	}
		  		 });
		  	});
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
  	$scope.initial = new Date('04-26-2018').getTime();
  	$scope.current_result = new Date(new Date().toDateString()).getTime();

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

  	$scope.tab = 2;

  	$scope.colors = {
  		Neutral: 'gray',
  		Sell: 'lightpink',
  		'Strong Sell': 'red',
  		Buy: 'lightgreen',
  		'Strong Buy': 'green'
  	}
  });