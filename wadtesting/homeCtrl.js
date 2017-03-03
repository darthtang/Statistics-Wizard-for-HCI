angular
        .module('app')
        .controller('homeCtrl', ['$scope', function ($scope) {

                $scope.checkAuth1 = function () {
                    alert('1');
                    checkAuth1();
                };
                $scope.pairedTtestRun = function () {
                    alert('2');
                    pairedTtestRun();
                };
                $scope.repeatedAnovaRun = function () {
                    alert('3');
                    repeatedAnovaRun();
                };
                $scope.calculateNorm = function () {

                    var a = document.getElementById("userLastColumnLetters").value;
                    var b = document.getElementById("sheetName").value;
                    var c = document.getElementById("userInput").value;
                    var str1 = "";
                    var n1 = str1.localeCompare(a);
                    var n2 = str1.localeCompare(b);
                    var n3 = str1.localeCompare(c);
                    if (n1 === 0 || n2 === 0 || n3 === 0) {
                        if (n1 === 0) {
                            alert('Last column letter is empty');
                        }
                        if (n2 === 0) {
                            alert('Sheet name is empty');
                        }
                        if (n3 === 0) {
                            alert('Sheet ID is empty');
                        }
                    } else {
                        console.log('youre okay');
                        console.log(a);
                        console.log(b);
                        console.log(c);
                        document.getElementById("norm").setAttribute("class", "collapse in");
                        document.getElementById("userLastColumnLetters").readOnly = true;
                        document.getElementById("sheetName").readOnly = true;
                        document.getElementById("userInput").readOnly = true;
                        alert('4');
                        calculateNorm();
                    }
                };
            }]);