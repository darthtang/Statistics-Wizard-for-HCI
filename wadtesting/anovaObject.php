<?php


//new line
class anovaObjects {
    var $mean =0;
    var $sumsOfSquares;
    var $inputIntoClass;
    var $totalOfArray =0;
    var $totalsquared=0;
    var $arrayOfItems = 0;
    var $ssArray = 0;
    var $stack = array("orange", "banana");
    
    
    function __construct($inputIntoClass) {
        $this->inputIntoClass = substr($inputIntoClass, 1);
        
    }

    function alert($input) {
        
        $arrayOfItems = explode("_",$input);
        $ssArray = explode("_",$input);
        $this->stack = &$arrayOfItems;
        //print_r(array_values($arrayOfItems));
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