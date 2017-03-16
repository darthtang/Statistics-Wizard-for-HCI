//Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '281296927473-dru253jk83in453051u1t97f0ckdktom.apps.googleusercontent.com';
//NOTE** the scope is specific. In order to read-write , the scope must be as such or else the application will simply not be able to read or write.

var SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

var sheetID = "YO";

var stringToPass = "*";

var discoveryUrl = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

var numberOfColumns = 0;

var rangeInput = "empty range";

var tableRange = "a = 0.10!";

//This is the initial entry point for the file. This function is being calld by GUI->homeCtrl->ThisMethod
//The method is setting up values in order to read a specific spreadsheet.->sheetID. The method also performs authorisation checks.


function repeatedAnovaRun() {

    sheetID = (document.getElementById("userInput").value);
    console.log(sheetID);
    gapi.auth.authorize(
            {
                'client_id': CLIENT_ID,
                'scope': SCOPES.join(' '),
                'immediate': true
            }, handleAuthResult);
}

function handleAuthResult(authResult) {
    var authorizeDiv = document.getElementById('authorize-div');
    if (authResult && !authResult.error) {
        authorizeDiv.style.display = 'none';
        loadSheetsApi();

    } else {
        authorizeDiv.style.display = 'inline';
    }
}

function handleAuthClick(event) {
    gapi.auth.authorize(
            {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
            handleAuthResult);
    return false;
}

//this function starts the intial call to start the process of calculating the repatedANova result
function loadSheetsApi() {

    gapi.client.load(discoveryUrl).then(readSheetsRepAno);

}
//this function aims to read the sheets to find out how many columns there are 
//to help perform the calulation
function readSheetsRepAno() {

    gapi.client.sheets.spreadsheets.get({
        spreadsheetId: sheetID,
    }).then(function (response) {
        var object = (response.result);
        var target = (document.getElementById("sheetName").value);
        for (x = 0; x < object.sheets.length; x++) {
            if (target === object.sheets[x].properties.title) {
                console.log('sucess');
                numberOfColumns123 = (object.sheets[x].properties.gridProperties.columnCount);
                console.log(numberOfColumns123);
                gapi.client.load(discoveryUrl).then(repeatedAnovaCreateSheets(numberOfColumns123));
            } else {
                console.log('nothing yet');
            }
        }
    });

}

//this function aims to push the findings from the repatedAnova calculation onto 
//the google spreadsheet that we have made
function pushToSheet(chunkinput, reject, criticalValIN,ratio) {
    console.log('look below me');
    console.log(chunkinput);
    
    
    //some basic error checking to decide the significance
        if (reject === 1) {
        var resultOfTest = 'Your F-ratio is GREATER than your critical value. There is a significant difference between the columns';
    } else {
        var resultOfTest = 'Your F-ratio is LESS THAN than your critical value. There is no significant difference between the columns';

    }
    
    //here we are setting up the A1 format string so that the system knows where
    // to print to on the sheet
    var nameOfSheet = (document.getElementById("sheetName").value);
    nameOfSheet += "-Repeated-Measures-ANOVA-Results";
    
    gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: sheetID,
        range: nameOfSheet,
        valueInputOption: "USER_ENTERED",
        majorDimension: "ROWS",
        values: [
            [chunkinput.data[0][0], chunkinput.data[0][1]],
            [chunkinput.data[1][0], chunkinput.data[1][1]],
            [chunkinput.data[2][0], chunkinput.data[2][1]],
            ['The critical value from the F TABLE', criticalValIN],
            [resultOfTest]
        ],
    }).then(function (response1234) {
        console.log(response1234);
    });
}

//this function aims to create a new google sheet so that we have a 
//blank sheet to paste our findings
//this function also reads from the google sheet to construct a string that can be passed to the repeatedanova.php file
//the string created is a string representation of all the values in the sheet in terms of columns.
function repeatedAnovaCreateSheets(input) {
    //this aims to create a name of the new sheet we are about to create. we take the name of the original sheet and append the name of the test we are performing.

    var nameOfSheet = (document.getElementById("sheetName").value);
    nameOfSheet += "-Repeated-Measures-ANOVA-Results";
        //batchupdate is the api call that allows our application to create a new sheet on the sheetID
    // we can set the properties like row count and tab colour etc. 
    
    gapi.client.sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheetID,
        requests: [
            {
                addSheet: {
                    properties: {
                        title: nameOfSheet,
                        gridProperties: {
                            rowCount: 20,
                            columnCount: 12
                        },
                        tabColor: {
                            red: 1.0,
                            green: 0.3,
                            blue: 0.4
                        }
                    }
                }
            }
        ]

    }).then(function (response1234) {
        console.log(response1234);
    });


    var lastLetterLower = (document.getElementById("userLastColumnLetters").value);
    var lastLetters = lastLetterLower.toUpperCase();
    var sheetName = (document.getElementById("sheetName").value);

    rangeInput = sheetName + '!A2:' + lastLetters;


    //this following code aims to read in the columns into one string while seperating each string by a '***' delimator
    
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: sheetID,
        range: rangeInput,
    }).then(function (response) {
        var range = response.result;
        if (range.values.length > 0) {
            for (x = 0; x < input; x++) {
                stringToPass = stringToPass + "***";
                for (i = 0; i < range.values.length; i++) {
                    var row = range.values[i];

                    stringToPass = stringToPass + "_" + row[x];

                }
                if (x === (input - 1)) {
                    console.log(stringToPass);
                    //here we have all the values that we need to perform the calculation 
                    repeatedAnovaJson(stringToPass, range.values.length, input);
                }
            }
        } else {
            appendPre('No data found.');
        }
    }, function (response) {
        appendPre('Error: ' + response.result.error.message);
    });

}


function appendPre(message) {
    var pre = document.getElementById('output');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

// this function aims to call the repeatedAnova.php file which will perform the repeatedMeasuresAnova calculation and return significant values

function repeatedAnovaJson(input, length, col) {
    
        //this is the request to the php file while passing the param{param}

    $.post('repeatedAnova.php', {in1: input, in2: length, in3: col},
            function (data)
            {
                //this section aims to unpackage the results from the repatedanova.php.
                //at this point we can consider that most of the hardcore calculation have been performed but we still need to interpret the result
                //the json payload from the php is unpackaged into a readible format
                
                var json = data;
                obj = JSON.parse(json);
                obj = JSON && JSON.parse(json) || $.parseJSON(json);
                var across = (obj.data[0][1]);
                var down = (obj.data[1][1]);
                var ratio = (obj.data[2][1]);

                //given the hardcore calculations have been performed we can now consider to create objects on the spreadsheet to represrent our findings to the user
                //note we are passing out calculation findings as a parameter to our new function.
               
               //the following function aims to look up the critical value
                gapi.client.load(discoveryUrl).then(lookUpFtable(across, down, ratio, obj));

            });

}


//this function aims to look up the critical value we need to see if there is a signigcant difference
// we do include some bespoke alterations in altering the x,y tables for the table because the table was copies and pasted from a web source and the code must accomodate the layout via ascci-fying number and letters
function lookUpFtable(acrossIn, lengthIn, ratioIn, chunk) {

    if (acrossIn <= 10) {
        acrossIn = acrossIn;
    }
    if ((acrossIn > 10) && (acrossIn <= 12)) {
        acrossIn = 11;
    }
    if ((acrossIn > 12) && (acrossIn <= 15)) {
        acrossIn = 12;
    }
    if ((acrossIn > 15) && (acrossIn <= 20)) {
        acrossIn = 13;
    }
    if ((acrossIn > 20) && (acrossIn <= 24)) {
        acrossIn = 14;
    }
    if ((acrossIn > 24) && (acrossIn <= 30)) {
        acrossIn = 15;
    }
    if ((acrossIn > 30) && (acrossIn <= 40)) {
        acrossIn = 16;
    }
    if ((acrossIn > 40) && (acrossIn <= 60)) {
        acrossIn = 17;
    }
    if ((acrossIn > 60) && (acrossIn <= 120)) {
        acrossIn = 18;
    }
    if (acrossIn > 120) {
        acrossIn = 19;
    }

    if (lengthIn <= 10) {
        lengthIn = lengthIn;
    }
    if ((lengthIn > 30) && (lengthIn <= 40)) {
        lengthIn = 31;
    }
    if ((lengthIn > 40) && (lengthIn <= 60)) {
        lengthIn = 32;
    }
    if ((lengthIn > 60) && (lengthIn <= 120)) {
        lengthIn = 33;
    }
    if ((lengthIn > 120)) {
        lengthIn = 34;
    }
    tableRange = tableRange + (String.fromCharCode(65 + acrossIn)) + (lengthIn + 1);

    console.log(tableRange);

    
    //once we have ascii-fied our values, we can now look up the values from the F table.
    //the sheet ID is hardcoded as we never need to look up a new table. 
    //there is potential for growth here to accomodate different tables with different different alpha values
    // note we have included a time delay because by the time we want to push/write our findings onto the google sheet that we have created, the sheet is not actually created yet due to lag
    // including a time delay seems to iliviate the issue
    //we also include a basic check to compare critical values from the f table to our findins from the repeatedAnova.php results
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1Ugb7TtHSuDVyibD70qokK_QLu5nv9pg3daw_J-7eEsU',
        range: tableRange,
    }).then(function (response) {
        var range1 = response.result;
        var criticalValue = (range1.values[0][0]);
        if (ratioIn >= criticalValue) {
            console.log('there is a sig diff in the data. F = ' + ratioIn);

            console.log('crit is: ' + criticalValue);

            var delayMillis = 2000;
            setTimeout(function () {
                pushToSheet(chunk,1,criticalValue,ratioIn);
            }, delayMillis);


        } else {
            console.log('there is NO sig diff in the data. F = ' + ratioIn);
            console.log('crit is: ' + criticalValue);

            var delayMillis = 2000;
            setTimeout(function () {
                pushToSheet(chunk,0,criticalValue,ratioIn);
            }, delayMillis);
        }

    });

}
