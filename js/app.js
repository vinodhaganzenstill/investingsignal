var textchatref = new Firebase('https://sharemarket-52975.firebaseio.com/Buy-Sell-Signals/');
var current_price = new Firebase('https://sharemarket-52975.firebaseio.com/Current-Price/');
var summaryref = new Firebase('https://sharemarket-52975.firebaseio.com/Summary/');

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