<?php

//this is a reutilised object and is also used in the one way anova. Please refer to the anovaObject class to find out more details about what it does!
include "anovaObject.php";

//input1 one is the string input into the file so that we can process
//input2 is the length of one columns
//input3 is the number of columns we have
//the inputs are all used to calculated the repated measured anova calculation

$input1 = $_POST['in1'];
$input2 = $_POST['in2'];
$input3 = $_POST['in3'];



$toBeMadeIntoArrays = substr($input1, 1);
$array = explode("***", $toBeMadeIntoArrays);



$listOfObjects = [];
for ($i = 1; $i < $input3 + 1; $i++) {

    ${'object' . $i} = new anovaObjects($array[$i]);
    ${'object' . $i}->alert(${'object' . $i}->inputIntoClass);
    array_push($listOfObjects, ${'object' . $i});
}
// up until this point we have create multiple different anovaObjects which are representing
//the different columns we have in the google sheet.


$dfSubjects = $input2 - 1;
$sValue = $input2;
$dfBetween = $input3 - 1;
$dfWithin = ($input2 * $input3) - $input3;
$dfError = $dfWithin - $dfSubjects;
$gValue = 0;
$sumOfXsquared = 0;
$sumsOfSquaredWithin = 0;
$nValue = $input2 * $input3;
$dfTotal = ($input2 * $input3) - 1;
$ssTotal = 0;
$ssSubjects = 0;
//up until this point we have initiales key values to 0 and performed part of the repeatedMeasuresAnova

//we are finding the sumsof squaresWithin within this for loop and the G value which is the totalOfTheColumn
for ($i = 0; $i < sizeof($listOfObjects); $i++) {
    $gValue = $gValue + $listOfObjects[$i]->totalOfArray;
    $sumOfXsquared = $sumOfXsquared + $listOfObjects[$i]->totalsquared;
    $sumsOfSquaredWithin = $sumsOfSquaredWithin + $listOfObjects[$i]->sumsOfSquares;
}


$ssSubjectsArray = [];

for ($i = 0; $i < $input2; $i++) {
   $current = 0;
    for ($x = 0; $x < $input3; $x++) {
        $current = $current + $listOfObjects[$x]->stack[$i];
    }
    
    $current = $current*$current;
    array_push($ssSubjectsArray, $current);
}

//the following evaluations are simply following insttructions from 
//tutorials and worksheets from educational materials


$sumOfArrayOfsubjects = array_sum($ssSubjectsArray);
$ssSubjects = ($sumOfArrayOfsubjects/$input3)-(($gValue*$gValue)/($input2 * $input3));



$ssTotal = $sumOfXsquared - (($gValue * $gValue) / $nValue);
$ssBetween = ($ssTotal) - ($sumsOfSquaredWithin);
$ssError = $sumsOfSquaredWithin - $ssSubjects;
$ssTotal = $ssBetween + $sumsOfSquaredWithin;

$msBetween = $ssBetween/$dfBetween;
$msError = $ssError/$dfError;

$fRatio = ($msBetween/$msError);

//we utlise the stdClass as a canvas to upload our key values into
// we then package that into a JSON file so that it can be transported back to the JS file calling it.
$obj = new stdClass();
$obj->label = "object";
$obj->data = array(
    array('dfBetween', $dfBetween),
    array('dfWithin', $dfError),
    array('fRatio', $fRatio),
);

echo json_encode($obj);
?>
