angular
        .module('app')
        .controller('homeCtrl', ['$scope', function ($scope) {


//each scope set is able to check if the last letter is a legal argument for the calculation


                $scope.checkSphericty = function () {

                    checkSphericty();
                };
                
                $scope.wilcoxon = function () {
                    var lengthOfColumn = document.getElementById("userLastColumnLetters").value;

                    if (lengthOfColumn === "B" || lengthOfColumn === "b") {
                        alert('You have said you have 2 columns. The wilcoxon test is being calculated. Please refer back to your Google Sheet')
                        wilcoxonRun();
                    } else {
                        alert('You did not say you have 2 columns. Wilcoxon only allows 2 columns to be conisdered during calculation of wilcoxon')
                    }
                };
                
                $scope.oneWayAnova = function () {

                    var lengthOfColumn = document.getElementById("userLastColumnLetters").value;

                    if (lengthOfColumn === "B" || lengthOfColumn === "b"||lengthOfColumn === "A" || lengthOfColumn === "a") {
                      alert('You have said you have 2 columns. The One Way ANOVA requires at least more than 2 columns');
                    } else {
                        alert('You have said you have more 2 columns. The One Way ANOVA calculation is being performed. Please refer back to your Google Sheet');
                        oneWayAnovaRun();
                    }
                };
                
                $scope.pairedTtestRun = function () {

                    var lengthOfColumn = document.getElementById("userLastColumnLetters").value;

                    if (lengthOfColumn === "B" || lengthOfColumn === "b") {
                        alert('You have said you have 2 columns. The Paired T-Test calculation is being performed. Please refer back to your Google Sheet');
                        pairedTtestRun();
                    } else {
                        alert('You have said you have 2 columns. T-Tests only allows 2 columns to be conisdered during calculation of T-Tests');
                    }

                };
                $scope.repeatedAnovaRun = function () {

                    var lengthOfColumn = document.getElementById("userLastColumnLetters").value;

                    if (lengthOfColumn === "B" || lengthOfColumn === "b"||lengthOfColumn === "A" || lengthOfColumn === "a") {
                        alert('You have said you have 2 columns. The Repeated Measures ANOVA calculation only allows 2 columns to be conisdered during calculation');
                    } else {
                        alert('You have said you have more 2 columns. The Repeated Measures ANOVA calculation is being performed. Please refer back to your Google Sheet');
                        repeatedAnovaRun();
                    }
                };
                
                
                //This method is special in which it opens up the rest of the wizard tabs only if all of the fields are populared
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
                        alert('Please refer to the Google sheet to find out if you have normally distributed data');
                        document.getElementById("norm").setAttribute("class", "collapse in");
                        document.getElementById("userLastColumnLetters").readOnly = true;
                        document.getElementById("sheetName").readOnly = true;
                        document.getElementById("userInput").readOnly = true;
                        calculateNorm();
                    }
                };
            }]);