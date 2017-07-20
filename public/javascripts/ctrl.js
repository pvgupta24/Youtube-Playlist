/**
 * Created by Praveen Gupta on 19-07-2017.
 */
/**
 * Created by Praveen Gupta on 18-06-2017.
 */

/*

app.controller('loginCtrl', function ($location, $scope, $http, $rootScope, $sessionStorage) {


    $scope.submit = function () {
        $http({
            method: 'POST',
            url: "https://ieeespwd.herokuapp.com/api/users/" + $scope.username,
            data: {"password": $scope.password}
        }).then(function success(response) {
            if (response.data['statusText'] === "Success") {
                $sessionStorage.loggedIn = true;
                $rootScope.hideLogout = !$sessionStorage.loggedIn;
                $rootScope.hideLogin = $sessionStorage.loggedIn;
                $rootScope.username = $scope.username;
                $location.path('/home');

                $rootScope.toast = "Welcome " + $scope.username;
                toast();
            }
            else {
                $rootScope.toast = response.data['statusText'];
                toast();
                $sessionStorage.loggedIn = false;
            }
        }, function () {
            $rootScope.toast = "Could not complete your request.. Please try again.";
            toast();
        })
    };

});

app.controller('registerCtrl', function ($scope, $http, $location) {

    $scope.register = function () {
        var data = {
            "username": $scope.username,
            "password": $scope.password,
            "name": $scope.name,
            "admin": false,
            "email": $scope.email
        };
        $http({
            method: 'POST',
            url: "https://ieeespwd.herokuapp.com/api/users",
            data: data
        }).then(function success(response) {
            $location.path('/home');
            $rootScope.toast = 'Successfull added' + $scope.username;
            toast();
        });
    }

});

app.controller('usersCtrl', function ($scope, $http, $rootScope, $state, $location, $sessionStorage) {
    if (!$sessionStorage.loggedIn) {
        $rootScope.toast = "Please login to see users!!";
        toast();
        $state.go('login');
    }
    $scope.userDetail = {};

    $scope.userHide = true;

    $http({
        method: 'GET',
        url: "https://ieeespwd.herokuapp.com/api/users"
    }).then(function (response) {
        $scope.users = response.data.data;
    });
    $scope.userDetails = function userDetails(username) {
        $scope.username = username;
        $http({
            method: 'GET',
            url: "https://ieeespwd.herokuapp.com/api/users/" + username
        }).then(function (response) {
            $scope.userData = response.data;
            if ($scope.userData.admin) {
                $scope.userData.admin = "Admin";
            }
            else {
                $scope.userData.admin = "Basic User";
            }
        });
        $scope.userHide = false;

    };
    if ($rootScope.author != null)
        $scope.userDetails($rootScope.author.username);

    $rootScope.author = null;
    $scope.close = function () {
        $scope.userDetail = {};
        $scope.userHide = true;
    }
});
app.controller('logoutCtrl', function ($http, $scope, $state, $rootScope, $sessionStorage) {


    if ($sessionStorage.loggedIn == null)
        $sessionStorage.loggedIn = false;

    if ($sessionStorage.loggedIn !== null) {

    }
    $rootScope.hideLogout = !$sessionStorage.loggedIn;
    $rootScope.hideLogin = $sessionStorage.loggedIn;
    $scope.logOut = function () {
        toast();
        $http({
            method: 'POST',
            url: "https://ieeespwd.herokuapp.com/api/logout"
        }).then(function () {

                $sessionStorage.loggedIn = false;
                $rootScope.hideLogout = true;
                $rootScope.hideLogin = false;
                $state.go('home');
                $rootScope.toast = "Logged Out";
                toast();
            }

            , function () {
                $rootScope.toast = 'Could not Logout';
                toast();
            });
    };
    $scope.login = function () {
        $state.go('login');
    };
});
*/

app.controller('playlistsCtrl',['$scope','$http',function ($scope,$http) {
    $http({
        method: 'GET',
        url: "/api/playlists",
    }).then(function success(res) {
        console.log(res);
        $scope.playlists=res.data;
    },function fail() {
    console.log("hmmmmmmmm failed");
    });
}]);