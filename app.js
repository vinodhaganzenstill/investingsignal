var textchatref = new Firebase('https://sharemarket-52975.firebaseio.com/Buy-Sell-Signals/');
var current_price = new Firebase('https://sharemarket-52975.firebaseio.com/Current-Price/');
var summary = {};
summary.high_volume = new Firebase('https://sharemarket-52975.firebaseio.com/High volume stocks/');
summary.high_price_movement = new Firebase('https://sharemarket-52975.firebaseio.com/High Price Movement in last 5 minutes/');
summary.top_losers = new Firebase('https://sharemarket-52975.firebaseio.com/Most Percentage Lose/');
summary.top_gainers = new Firebase('https://sharemarket-52975.firebaseio.com/Most Percentage Changes of the day/');
summary.upper_bolliger_crossover = new Firebase('https://sharemarket-52975.firebaseio.com/Upper Bollinger band crossover(15 mts)/');

var app = angular.module('todoApp', []);

app.filter('startFrom', function() {
    return function(input, start) {
    	if(input === undefined) {
    		return [];
    	} else {
    		start = +start; //parse to int
        	return input.slice(start);
    	}
    }
});