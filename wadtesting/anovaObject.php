<?php

// this is a standard object used by ANOVA calculations

//initialising the object variables. These can be accessed from php files who store and use the objects
class anovaObjects {
    var $mean =0;
    var $sumsOfSquares;
    var $inputIntoClass;
    var $totalOfArray =0;
    var $totalsquared=0;
    var $arrayOfItems = 0;
    var $ssArray = 0;
    var $stack = array("orange", "banana");
    
    //constructor for the class only needs and input of string in a specific format
    function __construct($inputIntoClass) {
        $this->inputIntoClass = substr($inputIntoClass, 1);
        
    }
// this method when called calculates all the relevant valus for the column
    function alert($input) {       
        $arrayOfItems = explode("_",$input);
        $ssArray = explode("_",$input);
        $this->stack = &$arrayOfItems;

        $this->totalOfArray = array_sum($arrayOfItems);
        $this->mean = (array_sum($arrayOfItems))/  (sizeof($arrayOfItems));
        
        for($i=0;$i<sizeof($ssArray);$i++){

            $ssArray[$i] = $ssArray[$i]*$ssArray[$i];
        }
        
        $this->totalsquared = array_sum($ssArray);
        
        $sumOfFirstColumn = (array_sum($arrayOfItems)* array_sum($arrayOfItems))/  sizeof($arrayOfItems);
        $this->sumsOfSquares = array_sum($ssArray)-$sumOfFirstColumn;
        
        

    }
    
    
}

//json -----********