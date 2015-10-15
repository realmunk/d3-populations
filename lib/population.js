var Population = function (population) {
    "use strict";

    var population = population || Resource.Computas;

    if(population === 'Stortinget') {
        population = Resource.Stortinget;
    }

    var self = {},
        Pct = function (n, m) { return m * (100 / n); },
        age = function (p) {
            let birthYear = new Date(p.birthDate).getYear();
            let thisYear = new Date().getYear();

            return thisYear - birthYear;
        },
        employed = function (p) {
            let birthYear = new Date(p.employmentDate).getYear();
            let thisYear = new Date().getYear();

            return thisYear - birthYear;
        },
        sortBy = function (array, filter) {

            let f = filter ? filter : function (a, b) {
                return a === b;
            };

            if(array.length === 0) return [];

            let first = array[0];

            let indexed = array.filter(function (e) {
                return f(e, first);
            });

            let unindexed = array.filter(function (e) {
                return !f(e, first);
            });

            return [indexed].concat(sortBy(unindexed, filter));
        };

    self.males = function () {
        return population.data.filter(function (employee) {
            if (employee.gender === 'M') {
                return true;
            }
            return false;
        });
    };

    self.females = function () {
        return population.data.filter(function (employee) {
            if (employee.gender === 'F') {
                return true;
            }
            return false;
        });
    };

    self.malesPct = function () {
        return Pct(self.males().length + self.females().length, self.males().length);
    };

    self.femalesPct = function () {
        return Pct(self.males().length + self.females().length, self.females().length);
    };

    self.genderDist = function () {
        return {
            name: population.name,
            label: d3.min(population.data, function (d) { return age(d); }) + " - " + d3.max(population.data, function (d) { return age(d); }),
            females: self.females().length,
            males: self.males().length
        };
    };

    self.genderDistPct = function () {
        return {
            name: population.name,
            label: d3.min(population.data, function (d) { return age(d); }) + " - " + d3.max(population.data, function (d) { return age(d); }),
            females: self.femalesPct(),
            males: self.malesPct()
        };
    };

    self.genderDistAge = function (r) {
        r = r || 3

        let ageBound = function (p) {
            return Math.round((age(p) * r) / 10);
        };

        let ageDist = sortBy(population.data, function (x, y) {
            return ageBound(x) === ageBound(y);
        });

        return ageDist.sort(function (a, b) {
                return age(b[0]) - age(a[0]);
            })
            .map(function (a) {
                return Population({name: "Age" +  age(a[0]), data: a}).genderDist();
            });
    };

    self.genderDistAgePct = function (r) {
        r = r || 3
        
        let ageBound = function (p) {
            return Math.round((age(p) * r) / 10);
        };

        let ageDist = sortBy(population.data, function (x, y) {
            return ageBound(x) === ageBound(y);
        });

        return ageDist.sort(function (a, b) {
                return age(b[0]) - age(a[0]);
            })
            .map(function (a) {
                return Population({name: "Age" +  age(a[0]), data: a}).genderDist();
            });
    };

    self.genderDistTime = function (r) {  
        r = r || 3;

        let ageBound = function (p) {
            return Math.round((employed(p) * r) / 10);
        };

        let ageDist = sortBy(population.data, function (x, y) {
            return ageBound(x) === ageBound(y);
        });

        return ageDist.sort(function (a, b) {
                return employed(b[0]) - employed(a[0]);
            })
            .map(function (a) {
                return Population({name: "Age" +  employed(a[0]), data: a}).genderDist();
            });
    };

    self.genderDistTimePct = function (r) {
        r = r || 3;

        let ageBound = function (p) {
            return Math.round((employed(p) * r) / 10);
        };

        let ageDist = sortBy(population.data, function (x, y) {
            return ageBound(x) === ageBound(y);
        });

        return ageDist.sort(function (a, b) {
                return employed(b[0]) - employed(a[0]);
            })
            .map(function (a) {
                return Population({name: "Age" +  employed(a[0]), data: a}).genderDist();
            });
    };

    self.updateGenders = function (genders) {
        return Population({
            name: population.name,
            data: population.data.map(function (employee) {
                if (employee.gender !== 'F' && employee.gender !== 'M') {
                    var approximation = genders.filter(function (gender) {
                        return employee.firstName === gender.name;
                    })[0];

                    if (approximation) {
                        employee.gender = approximation.gender;
                    };
                };
                return employee;
            })
        });
    };

    return self;
};

var Pop = Population;