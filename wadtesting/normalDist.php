<?php

$input1 = $_POST['in1'];

$object = json_decode($input1, true);

$length = sizeof($object["values"]);

$t0 = array(16,12,23,8,3,5,19,22,12,16,14,24,9,3,2); 
$t1 = array(22,18,24,20,12,13,22,22,20,22,25,26,12,9,8); 
$t2 = array(23,24,26,28,13,11,25,23,22,26,18,21,20,13,6); 
$t3 = array(25,29,27,30,17,15,26,26,24,29,21,23,23,16,10); 
$cars2 = stats_covariance ( $t0 , $t1 );


$allTheNumbers = [];
$sigmaArray = [];
$fxi = [];
$fxi1 = [];
$inversed = [];
$s = [];


for ($x = 0; $x < $length; $x++) {
    for ($i = 0; $i < sizeof($object["values"][$x]); $i++) {
        $current = $object["values"][$x][$i];
        if ($current != "") {
            array_push($allTheNumbers, $current);
        }
    }
}

sort($allTheNumbers);
$mean = array_sum($allTheNumbers) / sizeof($allTheNumbers);

for ($x = 0; $x < sizeof($allTheNumbers); $x++) {
    $current = ($allTheNumbers[$x]) - $mean;
    $sqrd = $current * $current;
    array_push($sigmaArray, $sqrd);
}

$meanSqrd = array_sum($sigmaArray) / (sizeof($sigmaArray)-1);
$sigma = sqrt($meanSqrd);
//$testing = log(0.075756140547901);
//$sigma = 211.6844;

for ($x = 0; $x < sizeof($allTheNumbers); $x++) {
    $current1 = ($allTheNumbers[$x] - $mean) / $sigma;
    $normdist1 = erf($current1 / (sqrt(2)));
    $normdist2 = (0.5) + ((0.5) * $normdist1);
    if ($normdist2 < 0) {
        $normdist3 = 1 - $normdist2;
        array_push($fxi, $normdist3);
        array_push($fxi1, 1 - $normdist3);
        array_push($inversed, 1 - $normdist3);
    } else {
        array_push($fxi, $normdist2);
        array_push($fxi1, 1 - $normdist2);
        array_push($inversed, 1 - $normdist2);
    }
}

sort($inversed);

for ($x = 0; $x < sizeof($allTheNumbers); $x++) {
 $toPush1 = log($fxi[$x]);
 $toPush2 = ($toPush1)+(log($inversed[$x]));
 $toPush3 = ((2*($x+1))-1) * $toPush2;
 array_push($s, $toPush3);
}

$num = -1*abs(sizeof($s));

$AD = $num - ((array_sum($s))/(sizeof($s)));
$ADstar = $AD*(1+(0.75/sizeof($s)+(2.25/(sizeof($s)*sizeof($s)))));

if($ADstar >= 0.6){
    $p = exp((1.2937-(5.709*($ADstar)))+(0.0186*($ADstar*$ADstar)));
}
if($ADstar >= 0.34 && $ADstar < 0.6){
    $p = exp((0.9177-(4.279*($ADstar)))-(1.38*($ADstar*$ADstar)));
}
if($ADstar >= 0.2 && $ADstar < 0.34){
    $p = 1 - exp(((-8.318) +(42.796*($ADstar)))-(59.938*($ADstar*$ADstar)));
}
if($ADstar < 0.2){
    $p = 1- exp(((-13.436)+(101.14*($ADstar)))-(223.73*($ADstar*$ADstar)));
}

if($p>=0.05){
   $isNormal = "The data you have is normal";
}else{
   $isNormal = "The data you have is NOT normal";
}

function erf($x) {
    # constants
    $a1 = 0.254829592;
    $a2 = -0.284496736;
    $a3 = 1.421413741;
    $a4 = -1.453152027;
    $a5 = 1.061405429;
    $p = 0.3275911;

    # Save the sign of x
    $sign = 1;
    if ($x < 0) {
        $sign = -1;
    }
    $x = abs($x);

    # A&S formula 7.1.26
    $t = 1.0 / (1.0 + $p * $x);
    $y = 1.0 - ((((($a5 * $t + $a4) * $t) + $a3) * $t + $a2) * $t + $a1) * $t * exp(-$x * $x);

    return $sign * $y;
}

$obj = new stdClass();
$obj->label = "object";
$obj->data = array(
    array('Mean', $mean),
    array('sigma', $sigma),
    array('object', $allTheNumbers),
    array('fxi', $fxi),
    array('fxi1', $fxi1),
    array('inversed', $inversed),
    array('s', $s),
    array('AD', $AD),
    array('ADstar', $ADstar),
    array('p', $p),
    array('normal', $isNormal),
    array('N',  sizeof($allTheNumbers)),
    array('Covariance', $cars2)
);

echo json_encode($obj)
?>
