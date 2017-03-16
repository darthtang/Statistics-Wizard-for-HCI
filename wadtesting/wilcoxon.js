//Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com

var CLIENT_ID = '281296927473-dru253jk83in453051u1t97f0ckdktom.apps.googleusercontent.com';

//NOTE** the scope is specific. In order to read-write , the scope must be as such or else the application will simply not be able to read or write.
var SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

var sheetID = "YO";

var discoveryUrl = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

var numberOfColumns = 0;

var rangeInput = "empty range";

var tableRangeWilcoxon = "wilcoxontable!A";

var allTheNumbers = [];


//This is the initial entry point for the file. This function is being calld by GUI->homeCtrl->ThisMethod
//The method is setting up values in order to read a specific spreadsheet.->sheetID. The method also performs authorisation checks.
function wilcoxonRun() {
    
    sheetID = (document.getElementById("userInput").value);
    console.log(sheetID);
    gapi.auth.authorize(
            {
                'client_id': CLIENT_ID,
                'scope': SCOPES.join(' '),
                'immediate': true
            }, wilcoxonhandleAuthResult);

}

//handles authorisation to a Google Account
function wilcoxonhandleAuthResult(authResult) {
    var authorizeDiv = document.getElementById('authorize-div');
    if (authResult && !authResult.error) {
        // Hide auth UI, then load client library.
        authorizeDiv.style.display = 'none';
        wilcoxonloadSheetsApi();

    } else {
        // Show auth UI, allowing the user to initiate authorization by
        // clicking authorize button.
        authorizeDiv.style.display = 'inline';
    }
}

//handles authorisation to a Google Account
function wilcoxonhandleAuthClick(event) {
    gapi.auth.authorize(
            {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
            wilcoxonhandleAuthResult);
    return false;
}

//This is the start of doing the wilcoxon calculation.
function wilcoxonloadSheetsApi() {

    gapi.client.load(discoveryUrl).then(wilcoxonReadSheet);

}

//function is used to read the a specific Google Sheet from a spreadsheet. 
function wilcoxonReadSheet() {
    
    
    var lastLetterLower = (document.getElementById("userLastColumnLetters").value);
    //this is making sure that the last letter is in uppercase as the API seems to not accept lower case values. a simple but needed line of code.
    var lastLetters = lastLetterLower.toUpperCase();
    var sheetName = (document.getElementById("sheetName").value);
    
    //Here we are constructing the search range that we need to search on the specific sheet name and how many columns we should search up to. 
    rangeInput = sheetName + '!A2:' + lastLetters;
    
    
    //here we make our first Google API call. 
    //values.get is a specific call to read values from a spreadsheet. The results are then evakualuated using the .result method on the response. 
    //the spreadsheetID is the ID you can commonly find in the URL of any Google Spreadsheet.
    //the range, constructed from before, is used to read a specific google sheet at a certain range. This is in an A1 spreadsheet format.
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: sheetID,
        range: rangeInput,
        majorDimension: "COLUMNS",
    }).then(function (response) {
        var range = response.result;
        //Console logs are in place for easy error checking and value checking.
        console.log('***********');
        console.log(range);
        console.log('***********');
        //we then call to a different method while also passing the response from the google api call.
        wilcoxonJSON(range);
    });
}


function wilcoxonappendPre(message) {
    var pre = document.getElementById('output');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

//here we are making a request to the wilcoxon php file. Note, the majority of the statsitcal calculations are performed server side.
// the post request is calling on the wilcoxon.php file.....and is passing a a json encoded object. The object passed in the result from the previous api call in the method
function wilcoxonJSON(input) {
    
    //this is the request to the php file while passing the param{param}
    $.post('wilcoxon.php', {in1: JSON.stringify(input)},
            function (data)
            {
                //this section aims to unpackage the results from the wilcoxon.php.
                //at this point we can consider that most of the hardcore calculation have been performed but we still need to interpret the result
                //the json payload from the php is unpackaged into a readible format
                var json = data;
                obj = JSON.parse(json);
                obj = JSON && JSON.parse(json) || $.parseJSON(json);
                console.log(obj.data);
                
                //given the hardcore calculations have been performed we can now consider to create objects on the spreadsheet to represrent our findings to the user
                //note we are passing out calculation findings as a parameter to our new function.
                gapi.client.load(discoveryUrl).then(wilcoxoncreateGoogleObjects(obj));
                
            });

}
//this function aims to create a new google sheet so that we have a blank sheet to paste our findings

function wilcoxoncreateGoogleObjects(obj) {
    
    //this aims to create a name of the new sheet we are about to create. we take the name of the original sheet and append the name of the test we are performing.
    var nameOfSheet = (document.getElementById("sheetName").value);
    nameOfSheet += "-Wilcoxon-Test-Results";
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
        console.log('1');
    });


    //basic error checking on the console to speed up development time
    console.log(obj.data[1][1]);
    console.log(tableRangeWilcoxon + obj.data[1][1]);

    // the following section of code aims to read from a specific value table to find a critical value
    // the value from the wilcoxon value is then compared to a value found on the table to state decide if there are significances.
    //note the setTimout function** -> we must set a time delay because by the time we want to add values onto our newly created sheet...the sheet does not excist.
    // Therefore we must put a short time delay to allow the google api to create the google sheet first. 
    
    
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1qgFlb_FZKpi5qQQdetCjxVf9FCEYiTLsAz463hH3uJ4',
        range: tableRangeWilcoxon + obj.data[1][1],
    }).then(function (response) {
        var range = response.result;
        console.log('***********');
        var valueFromWilcoxonTable = range["values"][0];
        var valueW = obj.data[0][1][0][0];
        console.log(valueFromWilcoxonTable);
        console.log(valueW);
        console.log('***********');

        var delayMillis = 2000;
        setTimeout(function () {
            //after the time delay has passed (which allows google time to create the sheet, we can then display out results onto the sheet that we have created.
            displayResultsWilcoxon(valueFromWilcoxonTable,valueW)

        }, delayMillis);
    });
}

//this simply displays the results that we have found onto the google sheet. 
function displayResultsWilcoxon(tableVal,valueWin) {
    
    var nameOfSheet = (document.getElementById("sheetName").value);
    nameOfSheet += "-Wilcoxon-Test-Results";
    var integerTable = parseInt(tableVal);
    
    if(valueWin<=integerTable){
        var answerOfWilcoxon = "there is a significant difference between the values as the the observer value (W) is less than the value found on the Wilcoxon Table" 
    }else{
        var answerOfWilcoxon = "there is NO significant difference between the values as the the observer value (W) is MORE than the value found on the Wilcoxon Table" 

    }

    gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: sheetID,
        range: nameOfSheet + "!A1:B7",
        valueInputOption: "USER_ENTERED",
        majorDimension: "ROWS",
        values: [
            ["Value from the Wilcoxon table", integerTable],
           ["W result from the Wilcoxon Calculation", valueWin],
           [answerOfWilcoxon]
        ],
    }).then(function (response1234) {
        console.log('2');
    });

}