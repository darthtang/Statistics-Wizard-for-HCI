//Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com

//setting all of the standard variables
var CLIENT_ID = '281296927473-dru253jk83in453051u1t97f0ckdktom.apps.googleusercontent.com';

var SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

var sheetID = "YO";

var discoveryUrl = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

var numberOfColumns = 0;

var rangeInput = "empty range";

var tableRange = "a = 0.10!";

var allTheNumbers = [];


//check Google sheets auth
function calculateNorm() {


        sheetID = (document.getElementById("userInput").value);
        console.log(sheetID);
        gapi.auth.authorize(
                {
                    'client_id': CLIENT_ID,
                    'scope': SCOPES.join(' '),
                    'immediate': true
                }, calculateNormhandleAuthResult);
    

        
    
}

//handle the auth and display auth button
function calculateNormhandleAuthResult(authResult) {
    var authorizeDiv = document.getElementById('authorize-div');
    if (authResult && !authResult.error) {
        // Hide auth UI, then load client library.
        authorizeDiv.style.display = 'none';
        calculateNormloadSheetsApi();

    } else {
        // Show auth UI, allowing the user to initiate authorization by
        // clicking authorize button.
        authorizeDiv.style.display = 'inline';
    }
}


function calculateNormhandleAuthClick(event) {
    gapi.auth.authorize(
            {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
            calculateNormhandleAuthResult);
    return false;
}

//start to tun the calculations by calling the first method with the discovery URL
function calculateNormloadSheetsApi() {

    gapi.client.load(discoveryUrl).then(calculateNormReadSheet);

}

//reads the spreadsheet and puts tge reutrned object in variable
function calculateNormReadSheet() {


    var lastLetterLower = (document.getElementById("userLastColumnLetters").value);
    var lastLetters = lastLetterLower.toUpperCase();
    var sheetName = (document.getElementById("sheetName").value);

    rangeInput = sheetName + '!A2:' + lastLetters;

    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: sheetID,
        range: rangeInput,
    }).then(function (response) {
        var range = response.result;
        calculateNormJSON(range);
    });
}


function calculateNormappendPre(message) {
    var pre = document.getElementById('output');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

//calls using json and ajax to call the php file which will perform the calculation
function calculateNormJSON(input) {

    $.post('normalDist.php', {in1: JSON.stringify(input)},
            function (data)
            {
                var json = data;
                obj = JSON.parse(json);
                obj = JSON && JSON.parse(json) || $.parseJSON(json);
                console.log(obj);
                // var across = (obj.data[0][1]);
                gapi.client.load(discoveryUrl).then(createGoogleObjects(obj));


            });

}

//creates the google sheet that we will the canvas and also writes to that sheet with the results fond
function createGoogleObjects(obj) {

    var nameOfSheet = (document.getElementById("sheetName").value);
    nameOfSheet += "-Anderson-Darling-Normal-Distribution-Test"
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

    var delayMillis = 2000;
    setTimeout(function () {

        console.log('look below me');
        gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: sheetID,
            range: nameOfSheet + "!A1:B7",
            valueInputOption: "USER_ENTERED",
            majorDimension: "ROWS",
            values: [
                ["Average", obj.data[0][1]],
                ["Sigma(Standard Devation(NOT population SD))", obj.data[1][1]],
                ["N", obj.data[11][1]],
                ["AD", obj.data[7][1]],
                ["AD*", obj.data[8][1]],
                ["P-value", obj.data[9][1]],
                ["Normal or Not Normalises?", obj.data[10][1]]
            ],
        }).then(function (response1234) {
            console.log('2');
        });
    }, delayMillis);
}