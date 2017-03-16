<?php

include "anovaObject.php";

$input1 = $_POST['in1'];
$input2 = $_POST['in2'];
$input3 = $_POST['in3'];

$toBeMadeIntoArrays = substr($input1, 1);

$array = explode("***", $toBeMadeIntoArrays);

$listOfObjects = [];
for ($i = 1; $i < $input3+1; $i++) {
    
    ${'object' . $i} = new anovaObjects($array[$i]);
    ${'object' . $i}->alert(${'object' . $i}->inputIntoClass);
    array_push($listOfObjects,${'object' . $i});

  }

$dfBetween = $input3-1;
$dfWithin = ($input2*$input3)-$input3;
$gValue = 0;
$sumOfXsquared = 0; 
$sumsOfSquaredWithin = 0;
$nValue = $input2*$input3;
$ssTotal = 0;


for($i=0;$i<sizeof($listOfObjects);$i++){
    $gValue = $gValue + $listOfObjects[$i]->totalOfArray;
    $sumOfXsquared = $sumOfXsquared + $listOfObjects[$i]->totalsquared;
    $sumsOfSquaredWithin = $sumsOfSquaredWithin + $listOfObjects[$i]->sumsOfSquares;
    
}

$ssTotal = $sumOfXsquared-(($gValue*$gValue)/$nValue);
$ssBetween = ($ssTotal)-($sumsOfSquaredWithin);

$fRatio = (($ssBetween/$dfBetween)/($sumsOfSquaredWithin/$dfWithin));

    
$obj = new stdClass();
$obj->label="object";
$obj->data = array(
    array('dfBetween',$dfBetween),
//    array('dfBetween',35),
    array('dfWithin',$dfWithin),
    array('fRatio',$fRatio),
);

echo json_encode($obj);

?>
