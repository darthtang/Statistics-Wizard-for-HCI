<?php

include "spObject.php";

$input1 = $_POST['in1'];

$object = json_decode($input1, true);

$length = sizeof($object["values"]);

$thing = $object["values"];

$sumOfVariances = 0;
$groups = $length;
$meansOfVariances = 0;
$matrixMean = 0;
$ssMatrix = 0;
$ssRowMeans = 0;
$ggNumerator = 0;
$ggDenominator = 0;
$ggEpsiolon = 0;

$listOfObjectsSP = [];
for ($i = 0; $i < $length; $i++) {

    ${'object' . $i} = new spObject();
    ${'object' . $i}->mean = array_sum($object["values"][$i]) / (sizeof($object["values"][$i]));
    ${'object' . $i}->variance = stats_variance($object["values"][$i], true);
    ${'object' . $i}->listOfNumbers = $object["values"][$i];
    array_push($listOfObjectsSP, ${'object' . $i});

    $sumOfVariances = $sumOfVariances + ${'object' . $i}->variance;
}
$meansOfVariances = $sumOfVariances / $groups;

$stringFromArray = [];
$totalOfMatrixMeanTemp = 0;
$ssmatrixTemp = [];
$ssmatrixsquared = [];
$meanOfCovairance = [];
$ssrowmeansarr =[];

for ($i = 0; $i < $length; $i++) {

    ${'ARRAY' . $i} = [];

    for ($t = 0; $t < $length; $t++) {
        ${'ARRAY' . $i}[$t] = stats_covariance($listOfObjectsSP[$i]->listOfNumbers, $listOfObjectsSP[$t]->listOfNumbers);
        array_push($ssmatrixTemp,${'ARRAY' . $i}[$t]);
        
        }
}

$tempForMatrixMean = 0;
for ($i = 0; $i < $length; $i++) {

    $tempForMatrixMean = $tempForMatrixMean + (array_sum(${'ARRAY' . $i})/sizeof(${'ARRAY' . $i}));
    array_push($meanOfCovairance, (array_sum(${'ARRAY' . $i})/sizeof(${'ARRAY' . $i})));
       }

for($i=0;$i<sizeof($meanOfCovairance);$i++){
    array_push($ssrowmeansarr, ($meanOfCovairance[$i]*$meanOfCovairance[$i]));   
}
$sumOfsquaresrowmeans = array_sum($ssrowmeansarr);
       
       
       

$matrixMean = $tempForMatrixMean/$groups;


for($i=0;$i<sizeof($ssmatrixTemp);$i++){
    array_push($ssmatrixsquared, ($ssmatrixTemp[$i]*$ssmatrixTemp[$i]));   
}
$sumOfsquares = array_sum($ssmatrixsquared);

for($i=0;$i<$length;$i++){
   $lastItem = sizeof(${'ARRAY' . $i})-1;
   
}


//$meansOfVariances = 41.7667; 
//$matrixMean = 34.61488; 
//$ssMatrix = 20041.47; //$sumOfsquares
//$ssRowMeans = 4832.433; //$sumOfsquaresrowmeans
//        

$ggNumerator = ($groups*($meansOfVariances-$matrixMean))*($groups*($meansOfVariances-$matrixMean));
$ggDenominator = ($groups-1)*($ssMatrix-2*$groups*$ssRowMeans+($groups*$groups)*($matrixMean*$matrixMean));

$obj = new stdClass();
$obj->label = "object";
$obj->data = array(
    array('groups', $groups),
    array('means of variances', $meansOfVariances),
    array('matrix means', $matrixMean),
    array('ss matrix', $sumOfsquares),
    array('ss row means', $sumOfsquaresrowmeans),
    array('numerator', $ggNumerator),
   array('denominator', $ggDenominator),
//    array('GG epsilon', $stringCleaned2)
);

echo json_encode($obj)
?>
