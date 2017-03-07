<?php

include "spObject.php";

$input1 = $_POST['in1'];

$object = json_decode($input1, true);

$length = sizeof($object["values"]);

$thing = $object["values"];

$t0 = array(16, 12, 23, 8, 3, 5, 19, 22, 12, 16, 14, 24, 9, 3, 2);
$t1 = array(22, 18, 24, 20, 12, 13, 22, 22, 20, 22, 25, 26, 12, 9, 8);
//$t2 = array(23,24,26,28,13,11,25,23,22,26,18,21,20,13,6); 
//$t3 = array(25,29,27,30,17,15,26,26,24,29,21,23,23,16,10); 
$cars2 = stats_covariance($t0, $t1);
//$cars3 = stats_variance($t0,true);

$listOfObjectsSP = [];
for ($i = 0; $i < $length; $i++) {

    ${'object' . $i} = new spObject();
    ${'object' . $i}->mean = array_sum($object["values"][$i]) / (sizeof($object["values"][$i]));
    ${'object' . $i}->variance = stats_variance($object["values"][$i], true);
    ${'object' . $i}->listOfNumbers = $object["values"][$i];
    array_push($listOfObjectsSP, ${'object' . $i});
}

for ($i = 0; $i < $length; $i++) {

    ${'ARRAY' . $i} = new SplFixedArray($length);

    for ($t = 0; $t < $length; $t++) {

        ${'ARRAY' . $i}[$t] = stats_covariance($listOfObjectsSP[$i]->listOfNumbers, $listOfObjectsSP[$t]->listOfNumbers);
    }
}


$obj = new stdClass();
$obj->label = "object";
$obj->data = array(
    array('objects', ${'ARRAY' . 0}),
    array('objects', ${'ARRAY' . 1}),
    array('objects', ${'ARRAY' . 2}),
    array('objects', ${'ARRAY' . 3})
);

echo json_encode($obj)
?>
