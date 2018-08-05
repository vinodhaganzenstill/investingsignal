app.controller('VirtualController', function($scope, $timeout, Session) {
	$scope.training_tab = 1;
	$scope.order = {};
	$scope.myorders = [];
  $scope.report = [];
  $scope.openorder = [];
  $scope.orderlist = {};
  $scope.brokerage = 0;
  $scope.amount_used = 0;
  $scope.profitloss = 0;

  $scope.is_logged_in = Session.is_logged_in;

	if(!Session.is_logged_in){
		$scope.$parent.$parent.$parent.login = true;
		$scope.$parent.$parent.$parent.tab = 1;
    return;
	}

  $scope.user = Session.user;

  $scope.profit = function(ord, price){
      var profit;

      price = price === undefined ? $scope.$parent.current_price[ord.stock].stockPrice : price;

      if(ord.type == 'Sell')
        profit = ((ord.order_price.replace(/,/g, '') - price.replace(/,/g, '')) * ord.quantity).toFixed(2);
      else
        profit = ((price.replace(/,/g, '') - ord.order_price.replace(/,/g, '')) * ord.quantity).toFixed(2);


      return profit;
    };


	var orders = new Firebase('https://sharemarket-52975.firebaseio.com/Orders/'+$scope.user.id+'/');
	 orders.on('value', function(snapshot) {
      $scope.myorders = [];
      $scope.report = [];
      $scope.openorder = [];
      $scope.orderlist = {};
      $scope.brokerage = 0;
      $scope.amount_used = 0;
      $scope.profitloss = 0;
  		var results = snapshot.val();
  		angular.forEach(results, function(res,k){
        res.id = k;
        if(res.new === 1){
          $scope.amount_used += (res.order_price*res.quantity);
          $scope.openorder.push(res);
        }
        if(res.parent !== 0){
          $scope.profitloss += parseFloat($scope.profit(res, $scope.orderlist[res.parent].order_price));
          $scope.report.push(res);
        }
        $scope.brokerage += ((res.order_price*res.quantity) * (0.10/100));
  		 	$scope.myorders.push(res);
        $scope.orderlist[k] = res;
  		 });
  	});


   $scope.exit_order = function(ord){
    var et = new Firebase('https://sharemarket-52975.firebaseio.com/Orders/'+$scope.user.id+'/'+ord.id);
    ord.new = 0;
    et.update(ord);

    ord.order_price = $scope.$parent.current_price[ord.stock].stockPrice;
    ord.order_time = new Date().getTime();
    ord.type = ord.type === 'Buy' ? 'Sell' : 'Buy';
    ord.parent = ord.id;
    delete ord.id;
    orders.push(ord);
   }

  	/*orders.endAt().limitToLast(1).on('child_added', function(snapshot) {
		  var results = snapshot.val();
      if(results.new === 1){
        $scope.openorder.push(results);
      }
      if(results.parent === 0){
        $scope.report.push(results);
      }
      $scope.myorders.push(results);
  	});*/


  	$scope.new_order = function(){
      


  		$scope.order.order_time = new Date().getTime();
  		$scope.order.order_price = $scope.$parent.current_price[$scope.order.stock].stockPrice;
  		$scope.order.type = $scope.order.type ? 'Sell' : 'Buy';
      $scope.order.new = 1;
      $scope.order.parent = 0;

      $tt = (500000-amount_used-brokerage+profitloss).toFixed(2);
      if($tt > $scope.order.order_price*$scope.order.quantity){
    		orders.push($scope.order);
    		$scope.order = {};
      }
  	};

    

	$timeout(function(){
		$('#stockSelectName').chosen();
	}, 2000);
});