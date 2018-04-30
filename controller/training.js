app.controller('VirtualController', function($scope, $timeout) {
	$scope.training_tab = 1;
	$scope.order = {};
	$scope.myorders = [];

	var orders = new Firebase('https://sharemarket-52975.firebaseio.com/Orders/');
	orders.once('value', function(snapshot) {
  		var results = snapshot.val();
  		angular.forEach(results, function(res,k){
  		 	$scope.myorders.push(res);
  		 });
  	});

  	orders.endAt().limitToLast(1).on('child_added', function(snapshot) {
		var results = snapshot.val();
  		$scope.myorders.push(results);
  	});


  	$scope.new_order = function(){
  		$scope.order.order_time = new Date().getTime();
  		$scope.order.order_price = $scope.$parent.current_price[$scope.order.stock].stockPrice;
  		$scope.order.type = $scope.order.type ? 'Sell' : 'Buy';
  		orders.push($scope.order);
  		$scope.order = {};
  	};

	$timeout(function(){
		$('#stockSelectName').chosen();
	}, 2000);
});