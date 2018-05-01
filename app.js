var textchatref = new Firebase('https://sharemarket-52975.firebaseio.com/Buy-Sell-Signals/');
var current_price = new Firebase('https://sharemarket-52975.firebaseio.com/Current-Price/');
var summary = {};
summary.high_volume = new Firebase('https://sharemarket-52975.firebaseio.com/Summary/High volume stocks/');
summary.high_price_movement = new Firebase('https://sharemarket-52975.firebaseio.com/Summary/High Price Movement in last 5 minutes/');
summary.top_losers = new Firebase('https://sharemarket-52975.firebaseio.com/Summary/Most Percentage Lose/');
summary.top_gainers = new Firebase('https://sharemarket-52975.firebaseio.com/Summary/Most Percentage Changes of the day/');
summary.upper_bolliger_crossover = new Firebase('https://sharemarket-52975.firebaseio.com/Summary/Upper Bollinger band crossover(15 mts)/');

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
})
.service('Session', function () {
    this.create = function (user, save) {
        this.userId = user.id;
        this.user = user;
        this.is_logged_in = true;
        if(save){
        	localStorage.setItem('auth', JSON.stringify(user));
        }
    	
    };
    this.destroy = function () {
        this.userId = null;
        this.user = null;
        this.is_logged_in = false;
        localStorage.removeItem('auth');
    };
    this.is_logged_in = false;
})
.run(function($rootScope, $location, Session) {
	var auth = localStorage.getItem('auth');
    if(!!auth){
    	Session.create(JSON.parse(auth));
    }
});