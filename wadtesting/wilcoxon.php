<?php

$input1 = $_POST['in1'];

$object = json_decode($input1, true);

$length = sizeof($object["values"]);
array_push($object["values"][0], "!");
//$testIN= "fgsdfgsfg";
//$testIN1= "spicyspicy";
//
//$array1 =array (40,65,53,79,87,41,80,63,51,82,27,71,29);
//$array2 =array (45,68,47,75,88,60,77,69,60,88,30,73,35);
//
$merged = array_merge($object["values"][0],$object["values"][1]);
$stringToPass = implode(" ", $merged);


//exec("java -jar NewTest.jar $array1 $array2" , $output);

exec("java -jar wilcoxonCalc.jar $stringToPass" , $output);

//exec('java -jar NewTest.jar testIN' , $output);


$obj = new stdClass();
$obj->label = "object";
$obj->data = array(
    array('Mean', $output),
    array('length', sizeof($object["values"][1]))
);

echo json_encode($obj)
?>
