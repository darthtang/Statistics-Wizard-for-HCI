<?php

include "anovaObject.php";

$input1 = $_POST['in1'];
$input2 = $_POST['in2'];
$input3 = $_POST['in3'];



$toBeMadeIntoArrays = substr($input1, 1);

$array = explode("***", $toBeMadeIntoArrays);

$listOfObjects = [];
for ($i = 1; $i < $input3 + 1; $i++) {

    ${'object' . $i} = new ChiSquaredObjects($array[$i]);
    ${'object' . $i}->alert(${'object' . $i}->inputIntoClass);
    array_push($listOfObjects, ${'object' . $i});
}

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

$sumOfArrayOfsubjects = array_sum($ssSubjectsArray);
$ssSubjects = ($sumOfArrayOfsubjects/$input3)-(($gValue*$gValue)/($input2 * $input3));



$ssTotal = $sumOfXsquared - (($gValue * $gValue) / $nValue);
$ssBetween = ($ssTotal) - ($sumsOfSquaredWithin);
$ssError = $sumsOfSquaredWithin - $ssSubjects;
$ssTotal = $ssBetween + $sumsOfSquaredWithin;

$msBetween = $ssBetween/$dfBetween;
$msError = $ssError/$dfError;

$fRatio = ($msBetween/$msError);


$obj = new stdClass();
$obj->label = "object";
$obj->data = array(
    array('dfBetween', $dfBetween),
//    array('dfBetween',35),
    array('dfWithin', $dfError),
    array('fRatio', $fRatio),
);

echo json_encode($obj);
?>
