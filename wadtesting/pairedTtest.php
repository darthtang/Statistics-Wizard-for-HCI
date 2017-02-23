<?php

$input1 = $_POST['in1'];



$object = json_decode($input1,true);

$length = sizeof($object["values"]);
$difference = [];
$differenceSqrd = [];

for ($x = 0; $x < $length; $x++) {
    $current = (($object["values"][$x][0])-($object["values"][$x][1]));
    array_push($difference, $current);
}

//var_dump($difference);
$sumOfDifference = array_sum($difference);

for ($x = 0; $x < $length; $x++) {
    $currentSqrd = $difference[$x]*$difference[$x];
    array_push($differenceSqrd, $currentSqrd);
}

//var_dump($differenceSqrd);
$sumOfDifferenceSqrd = array_sum($differenceSqrd);


$a = $length * $sumOfDifferenceSqrd;
$b = $sumOfDifference*$sumOfDifference;
$c = ($a-$b)/($length-1);
$d = sqrt($c);
$tValue = $sumOfDifference/$d;


$obj = new stdClass();
$obj->label = "object";
$obj->data = array(
    array('tValue',$tValue ),
    array('length',$length ),


);

echo json_encode($obj);

?>
