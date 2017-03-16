//Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '281296927473-dru253jk83in453051u1t97f0ckdktom.apps.googleusercontent.com';

var SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

var sheetID = "YO";

var discoveryUrl = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

var numberOfColumns = 0;

var rangeInput = "empty range";

var tableRangeWilcoxon = "wilcoxontable!A";

var allTheNumbers = [];

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


function wilcoxonhandleAuthClick(event) {
    gapi.auth.authorize(
            {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
            wilcoxonhandleAuthResult);
    return false;
}


function wilcoxonloadSheetsApi() {

    gapi.client.load(discoveryUrl).then(wilcoxonReadSheet);

}

function wilcoxonReadSheet() {


    var lastLetterLower = (document.getElementById("userLastColumnLetters").value);
    var lastLetters = lastLetterLower.toUpperCase();
    var sheetName = (document.getElementById("sheetName").value);

    rangeInput = sheetName + '!A2:' + lastLetters;

    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: sheetID,
        range: rangeInput,
        majorDimension: "COLUMNS",
    }).then(function (response) {
        var range = response.result;
        console.log('***********');
        console.log(range);
        console.log('***********');
        wilcoxonJSON(range);
    });
}


function wilcoxonappendPre(message) {
    var pre = document.getElementById('output');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

function wilcoxonJSON(input) {

    $.post('wilcoxon.php', {in1: JSON.stringify(input)},
            function (data)
            {
                var json = data;
                obj = JSON.parse(json);
                obj = JSON && JSON.parse(json) || $.parseJSON(json);
//                console.log(obj.data[0][1]);
                console.log(obj.data);
                // var across = (obj.data[0][1]);
                gapi.client.load(discoveryUrl).then(wilcoxoncreateGoogleObjects(obj));


            });

}

function wilcoxoncreateGoogleObjects(obj) {
    console.log('asdfsdfsdfsdfsdf');
    var nameOfSheet = (document.getElementById("sheetName").value);
    nameOfSheet += "-Wilcoxon-Test-Results";
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

    console.log(obj.data[1][1]);
    console.log(tableRangeWilcoxon + obj.data[1][1]);

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
            displayResultsWilcoxon(valueFromWilcoxonTable,valueW)

        }, delayMillis);



    });
}
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