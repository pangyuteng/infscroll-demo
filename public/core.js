var scotchTodo = angular.module('scotchTodo', ['infinite-scroll']);

function mainController($scope, $http) {
	$scope.formData = {};

	// when landing on the page, get all todos and show them
	$http.get('/api/todos')
		.success(function(data) {
			$scope.todos = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	// when submitting the add form, send the text to the node API
	$scope.createTodo = function() {
		$http.post('/api/todos', $scope.formData)
			.success(function(data) {
				$scope.formData = {}; // clear the form so our user is ready to enter another
				$scope.todos = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	// delete a todo after checking it
	$scope.deleteTodo = function(id) {
		$http.delete('/api/todos/' + id)
			.success(function(data) {
				$scope.todos = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

}

scotchTodo.controller('infController', function($scope, InfTodo) {
  $scope.inftodo = new InfTodo();
});

// InfTodo constructor function to encapsulate HTTP and pagination logic
scotchTodo.factory('InfTodo', function($http) {
  var InfTodo = function() {
    this.items = [];
    this.busy = false;
    this.seen_ids = [];
  };

  InfTodo.prototype.nextPage = function() {
    if (this.busy) return;
    this.busy = true;

    //var url = "http://localhost:8080/api/todo-inf";
    var url = "/api/todo-inf";

    var isQuery = false;
    var addons = "?";
    
    for (let item of this.seen_ids){
    	addons+="nin="+item+"&";
    	isQuery = true;
    }
    if (isQuery){
    	url+=addons;
    }
    //url+='&jsonp=JSON_CALLBACK';
	
	$http.get(url).success(function(data) {
      var items = data.todos;

      for (var i = 0; i < items.length; i++) {
        this.items.push(items[i]);
      }
      this.seen_ids = this.items.map(function(a) {return a._id});
      this.busy = false;
	}.bind(this));
  };

  return InfTodo;
});
/*
scotchTodo.controller('infController', function($scope, Reddit) {
  $scope.reddit = new Reddit();
});

// Reddit constructor function to encapsulate HTTP and pagination logic
scotchTodo.factory('Reddit', function($http) {
  var Reddit = function() {
    this.items = [];
    this.busy = false;
    this.after = '';
  };

  Reddit.prototype.nextPage = function() {
    if (this.busy) return;
    this.busy = true;

    var url = "https://api.reddit.com/hot?after=" + this.after + "&jsonp=JSON_CALLBACK";
    $http.jsonp(url).success(function(data) {
      var items = data.data.children;
      for (var i = 0; i < items.length; i++) {
        this.items.push(items[i].data);
      }
      this.after = "t3_" + this.items[this.items.length - 1].id;
      this.busy = false;
    }.bind(this));
  };

  return Reddit;
});
*/