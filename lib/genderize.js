var Genderize = {};

(function (Genderize) {
    'use strict';

    var locationCode = function (location) {
        if (location === 'Romania') {
            return 'ro';
        }
        return 'no';
    }

    Genderize.query = function (name, location) {
        var apiRoot = 'https://api.genderize.io/';

        return apiRoot + '?name=' + name + '&country_id=' + locationCode(location);
    }

    Genderize.estimateGender = function (employee, success, error) {
        var error = error || function (e) { console.log(e); },
            success = success || function (r) { console.log(r); },
            getRequest = new XMLHttpRequest(),
            url = Genderize.query(employee.firstName.split(' ')[0], employee.location);

        getRequest.open('GET', url, true);

        getRequest.onload = function() {
            if (getRequest.status >= 200 && getRequest.status < 400) {
                var result = JSON.parse(getRequest.responseText);

                success(result);
            } else {
                error('Tried to get employees, but the server returned an error');
            }
        };

        getRequest.onerror = function() {
            error('There was a connection error when getting employees');
        };

        getRequest.send();
    };
}(Genderize));