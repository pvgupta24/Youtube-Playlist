/**
 * Created by Praveen Gupta on 19-07-2017.
 */

app.service('myService', ['$rootScope,$timeout', function ($rootScope,$timeout) {
    $scope.trustUrl = function (url) {
        return $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + url);
    };
}]);