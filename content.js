var textchatref = new Firebase('https://sharemarket-52975.firebaseio.com/Buy-Sell-Signals/');
function check_stock(){
	var investingDomainStockDataList =[];
	var stockName;
	$('.technicalSummaryTbl > tbody > tr ').each(function(index, data) {
		var cellsLength = $(this).find('td').length;
		var cellData = $(this).find('td:eq(0)').text();
		var investingDomainStockData = {};
		var dateTime = new Date();
		if (cellsLength === 6) {
			var rowData =$(this).find('td:eq(0)').text().trim(); 
			stockName = rowData.trim().replace(/\s/g, "~");
		} else if (cellsLength === 5 && cellData === 'Summary:') {
			var companyName = stockName.substr(0,stockName.lastIndexOf('~')).replace(new RegExp("~", 'g')," ").trim();
			investingDomainStockData['stockName'] = companyName;
			investingDomainStockData['stockPrice'] = stockName.substr(stockName.lastIndexOf('~')+1, stockName.length);
			investingDomainStockData['fiveMins'] = $(this).find('td:eq(1)').text();
			investingDomainStockData['fifteenMins'] = $(this).find('td:eq(2)').text();
			investingDomainStockData['hourly'] = $(this).find('td:eq(3)').text();
			investingDomainStockData['daily'] = $(this).find('td:eq(4)').text();
			investingDomainStockData['loadedTime'] = dateTime.getTime();
			investingDomainStockData['stockId'] = companyName +"~"+ $(this).find('td:eq(1)').text();
			investingDomainStockDataList.push(investingDomainStockData);
		}
	});

	investingDomainStockListExist = JSON.parse(localStorage.getItem('investingDomainStockList'));

	investingDomainStockListExist = !!investingDomainStockListExist ? investingDomainStockListExist : [];

	angular.forEach(investingDomainStockDataList,function(data,value){
		  isAvailable = investingDomainStockListExist.filter(function(a){return a.stockName === data.stockName;});
		  if(isAvailable.length === 0 || (isAvailable.length && isAvailable[isAvailable.length - 1].fiveMins != data.fiveMins)) {
		  	  investingDomainStockListExist.push(data);
		  	  textchatref.push(data);
		  }
	});

	localStorage.setItem('investingDomainStockList', JSON.stringify(investingDomainStockListExist));
}

var href = window.location.href;
if(href.indexOf('signal') !== -1){
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

	  	textchatref.once('value', function(snapshot) {
	  		var results = snapshot.val();
	  		$scope.$apply(function(){
		  		 angular.forEach(results, function(res,k){
		  		 	$scope.screener_result.push(res);
		  		 });
		  	});
	  	});

	  	textchatref.endAt().limit(1).on('child_added', function(snapshot) {
	  		var results = snapshot.val();
		  		$scope.$apply(function(){
		  			$scope.screener_result.push(results);
		  		});
	  	});

	  	$scope.screener_result = [];
	  	$scope.fiter = {};

	  });

	  var $injector = angular.injector(['ng', 'todoApp']);

	  setTimeout(function(){
	  	$injector.invoke(function($rootScope, $compile) { 
		    $template = `<div class="InvestingCustomization" ng-app="todoApp" ng-controller="TodoListController">
		    		<input ng-model="filter.stockName">
		    		<br>
		    		5Mins Candle 
		    		<input type="radio" name="fiveMins" ng-model="filter.fiveMins" value=""> Reset
		    		<input type="radio" name="fiveMins" ng-model="filter.fiveMins" value="Sell"> Sell
		    		<input type="radio" name="fiveMins" ng-model="filter.fiveMins" value="Strong Sell"> Strong Sell
		    		<input type="radio" name="fiveMins" ng-model="filter.fiveMins" value="Buy">Buy
		    		<input type="radio" name="fiveMins" ng-model="filter.fiveMins" value="Strong Buy">Strong Buy
		    		<br>
		    		15Mins Candle 
		    		<input type="radio" name="fifteenMins" ng-model="filter.fifteenMins" value=""> Reset
		    		<input type="radio" name="fifteenMins" ng-model="filter.fifteenMins" value="Sell"> Sell
		    		<input type="radio" name="fifteenMins" ng-model="filter.fifteenMins" value="Strong Sell"> Strong Sell
		    		<input type="radio" name="fifteenMins" ng-model="filter.fifteenMins" value="Buy">Buy
		    		<input type="radio" name="fifteenMins" ng-model="filter.fifteenMins" value="Strong Buy">Strong Buy
		    		<br>
		    		1Hour Candle 
		    		<input type="radio" name="hourly" ng-model="filter.hourly" value=""> Reset
		    		<input type="radio" name="hourly" ng-model="filter.hourly" value="Sell"> Sell
		    		<input type="radio" name="hourly" ng-model="filter.hourly" value="Strong Sell"> Strong Sell
		    		<input type="radio" name="hourly" ng-model="filter.hourly" value="Buy">Buy
		    		<input type="radio" name="hourly" ng-model="filter.hourly" value="Strong Buy">Strong Buy
		    		<br>
		    		Day Candle 
		    		<input type="radio" name="daily" ng-model="filter.daily" value=""> Reset
		    		<input type="radio" name="daily" ng-model="filter.daily" value="Sell"> Sell
		    		<input type="radio" name="daily" ng-model="filter.daily" value="Strong Sell"> Strong Sell
		    		<input type="radio" name="daily" ng-model="filter.daily" value="Buy">Buy
		    		<input type="radio" name="daily" ng-model="filter.daily" value="Strong Buy">Strong Buy
		        	<table border="1" width="100%">
		        		<tr>
		        			<th>#</th>
		        			<th>Stock</th>
		        			<th>Price</th>
		        			<th>Signal</th>
		        			<th>Time</th>
		        		</tr>
			        	<tr ng-repeat="scr in screener_result | filter: filter | orderBy: 'loadedTime' : true">
			        		<td>{{$index+1}}</td>
			        		<td>{{scr.stockName}}</td>
			        		<td>{{scr.stockPrice}}</td>
			        		<td><span class="{{scr.fiveMins}}"></span> <span class="{{scr.fifteenMins}}"></span> <span class="{{scr.hourly}}"></span> <span class="{{scr.daily}}"></span></td>
			        		<td>{{scr.loadedTime | date : 'MMM d, y h:mm:ss'}}</td>
			        	</tr>
		        	</table>
		        </div>`;
		    $('.wrapper').html($compile($template)($rootScope));
		  });
	  }, 5000);
	  
} else {
	setInterval(function(){
		check_stock();
	}, 10000);
}