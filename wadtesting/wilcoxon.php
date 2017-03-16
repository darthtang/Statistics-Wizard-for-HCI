<?php
//<!--The Wilcoxon.php file is used to calculate the W value. It does this
//by utlising the wilcoxonCalc.jar file that is infact an executable java jar file.-->



//this is the input into the file by the json call from the wilcoxon.js file. this is an object read from the google sheets spreadsheet
$input1 = $_POST['in1'];

//since the input was passeed from the wilcoxon.js file was encoded in json...we must decode the json into a usable format.
$object = json_decode($input1, true);

//the sizeOf function gets the size of the [values] array within the decoded object. This value is used for processing and creating a string with a ! del between.
$length = sizeof($object["values"]);
array_push($object["values"][0], "!");
$merged = array_merge($object["values"][0],$object["values"][1]);
$stringToPass = implode(" ", $merged);


//the exec function is a function that can be used to call other files from different languages i.e, java, c or R. In this case
//we are calling an exectuable java jar file that can return a W value from the running of a wilcoxon rank test. please refer to the java file for further documentation
//the variable $output is a variable that is populated instantly with the returned value from running the jar file
exec("java -jar wilcoxonCalc.jar $stringToPass" , $output);


// here we are setting up a stdclass. The stdClass is simply a plain vanilla class within nothing in it, basically an empty object that can be manipulated
// we then file that stdClass with values in an array structure and echo back to the javascript file a JSON_Encoded object with the relevant values to carry on the 
// last processes of the wilcoxon calculation. 
$obj = new stdClass();
$obj->label = "object";
$obj->data = array(
    array('Mean', $output),
    array('length', sizeof($object["values"][1]))
);

echo json_encode($obj)
?>
