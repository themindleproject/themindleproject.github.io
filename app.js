var app = angular.module('tmdapp', ['ngRoute']);

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: './components/home.html',
        controller: 'homeCtrl'
    }).when('/login', {
        templateUrl: './components/login.html',
        controller: 'loginCtrl'
    }).when('/logout', {
        resolve: {
            deadResolve: function($location, user) {
                user.clearData();
                $location.path('/');
            }
        }
    }).when('/register', {
        templateUrl: './components/register.html',
        controller: 'registerCtrl'
    }).when('/feed', {
        resolve: {
            check: function ($location, user) {
                if (!user.isUserLoggedIn()) {
                    swal({
                        icon: "error",
                        title: "You need to be loggged in",
                        text: "Please login or create an account"
                    });
                    $location.path('/login');
                }
            },
        },
        templateUrl: './components/feed.html',
        controller: 'feedCtrl'
    })
    .otherwise({
        template: '404'
    });

    $locationProvider.html5Mode(true);
});

app.service('user', function () {
    var username;
    var loggedin = false;
    var id;
    this.getName = function () {
        return username;
    };
    this.setID = function (userID) {
        id = userID;
    };
    this.getID = function () {
        return id;
    };
    this.isUserLoggedIn = function () {
        if (!!localStorage.getItem('login')) {
            loggedin = true;
            var data = JSON.parse(localStorage.getItem('login'));
            username = data.username;
            id = data.id;
        }
        return loggedin;
    };
    this.saveData = function (data) {
        username = data.user;
        id = data.id;
        loggedin = true;
        localStorage.setItem('login', JSON.stringify({
            username: username,
            id: id
        }));
    };
    this.clearData = function() {
        localStorage.removeItem('login');
        username = "";
        id = "";
        loggedin = false;
    }
});

app.controller('homeCtrl', function ($scope, $location) {
    $scope.login = function () {
        $location.path('/login');
    };
    $scope.register = function () {
        $location.path('/register');
    };
});

app.controller('loginCtrl', function ($scope, $location, $http, user) {
    $scope.login = function () {
        var email = $scope.loginemail;
        var password = $scope.loginpwd;

        $http({
            url: 'http://localhost/tmd/server/login.php',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'email='+email+'&password='+password
        }).then(function (response) {
            if (response.data.status == 'loggedin') {
                user.saveData(response.data);
                $location.path('/feed');
            } else if (response.data.status == 'pwdincorrect') {
                swal({
                    icon: "error",
                    title: "Wrong Password",
                    text: "Please try again or reset password"
                });
            } else if (response.data.status == 'error') {
                swal({
                    icon: "error",
                    title: "No Account Found",
                    text: "We couldn't find an account with that email"
                });
            } else {
                swal({
                    icon: "error",
                    title: "An unexpected error occured",
                    text: "Please try again or contact the admin"
                });
                
            }
        })
    };

    $scope.gotoregister = function () {
        $location.path('/register');
    };

    $scope.gotohome = function () {
        $location.path('/');
    };
});

app.controller('registerCtrl', function ($scope, $location, $http, user) {
    $scope.register = function () {
        var fullname = $scope.fullname;
        var username = $scope.username;
        var regemail = $scope.regemail;
        var regpwd = $scope.regpwd;

        $http({
            url: 'http://localhost/tmd/server/register.php',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'fullname='+fullname+'&username='+username+'&email='+regemail+'&password='+regpwd
        }).then(function (response) {
            if (response.data.status == 'registered') {
                user.saveData(response.data);
                $location.path('/feed');
            } else {
                swal({
                    icon: "error",
                    title: "Unexpected Error",
                    text: "There was an error creating your account. Please try again"
                });
            }
        });
    };

    $scope.checkUserName = function () {
        var username = $scope.username;

        $http({
            url: 'http://localhost/tmd/server/allusers.php',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'username=' + username
        }).then(function (response) {
            if (response.data.status == 'userfound') {
                $scope.alcolor = "red";
            } else {
                $scope.alcolor = "#1cac91";
            }
        });
    };

    $scope.checkEmail = function () {

    };

    $scope.gotologin = function () {
        $location.path('/login');
    };

    $scope.gotohome = function () {
        $location.path('/');
    };
});

app.controller('feedCtrl', function ($scope, $location, user) {
    $scope.user = user.getName();
});