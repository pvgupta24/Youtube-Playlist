/**
 * Created by Praveen Gupta on 19-07-2017.
 */

app.service('myService', ['$rootScope,$timeout', function ($rootScope,$timeout) {
    this.toast = function (msg) {
        $myToast = $('#myToast');
        $rootScope.toastMsg = msg;
        $myToast.modal('show');
        $timeout(function () {
            $myToast.modal('hide');
        }, 1500);
    }
}]);