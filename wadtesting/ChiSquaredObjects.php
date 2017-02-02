<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ChiSquaredObjects
 *
 * @author pjb12147
 */
class ChiSquaredObjects {
    var $mean =0;
    var $sumsOfSquares;
    var $inputIntoClass;
    var $totalOfArray =0;
    var $totalsquared=0;
    
    function __construct($inputIntoClass) {
        $this->inputIntoClass = substr($inputIntoClass, 1);
        
    }

    function alert($input) {
        
        $arrayOfItems = explode("_",$input);
        $ssArray = explode("_",$input);
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