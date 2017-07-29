/**
 * Created by Praveen Gupta on 19-07-2017.
 */

app.service('myService', ['$rootScope,$timeout', function ($rootScope,$timeout) {
    var obj = {};
    obj.toast = function (msg) {
        console.log('inside toast');
        $myToast = $('#myToast');
        $rootScope.toastMsg = msg;
        $myToast.modal('show');
        $timeout(function () {
            $myToast.modal('hide');
        }, 1500);
        return obj;
    }
}]);