<?php


//initialize input and decode from json
$input1 = $_POST['in1'];
$object = json_decode($input1,true);

$length = sizeof($object["values"]);
$difference = [];
$differenceSqrd = [];

//calculate an array of differences
for ($x = 0; $x < $length; $x++) {
    $current = (($object["values"][$x][0])-($object["values"][$x][1]));
    array_push($difference, $current);
}

//sum the differences
$sumOfDifference = array_sum($difference);

// have an array of sqrd differences
for ($x = 0; $x < $length; $x++) {
    $currentSqrd = $difference[$x]*$difference[$x];
    array_push($differenceSqrd, $currentSqrd);
}

//sum the squared differences
$sumOfDifferenceSqrd = array_sum($differenceSqrd);

//calculate basic variables and find the T-value
$a = $length * $sumOfDifferenceSqrd;
$b = $sumOfDifference*$sumOfDifference;
$c = ($a-$b)/($length-1);
$d = sqrt($c);
$tValue = $sumOfDifference/$d;

//package results into json and return back to javascript.
$obj = new stdClass();
$obj->label = "object";
$obj->data = array(
    array('tValue',$tValue ),
    array('length',$length ),


);

echo json_encode($obj);

?>
