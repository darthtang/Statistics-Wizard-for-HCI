//Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '281296927473-dru253jk83in453051u1t97f0ckdktom.apps.googleusercontent.com';

var SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

var sheetID = "YO";

var discoveryUrl = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

var numberOfColumns = 0;

var rangeInput = "empty range";

var tableRange = "a = 0.10!";

var allTheNumbers = [];

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


function calculateNormloadSheetsApi() {

    gapi.client.load(discoveryUrl).then(calculateNormlistMajors);

}

function calculateNormlistMajors() {


    var lastLetterLower = (document.getElementById("userLastColumnLetters").value);
    var lastLetters = lastLetterLower.toUpperCase();
    var sheetName = (document.getElementById("sheetName").value);

    rangeInput = sheetName + '!A2:' + lastLetters;

    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: sheetID,
        range: rangeInput,
    }).then(function (response) {
            var range = response.result;
//            console.log(range.values);
//            for (x = 0; x < range.values.length; x++) {
//                for (i = 0; i < range.values[x].length; i++) {
//                    if(range.values[x][i]){
//                        allTheNumbers.push(range.values[x][i]);                       
//                    }
//                }
//            }     
            
            calculateNormAnova123(range);
        });
}


function calculateNormappendPre(message) {
    var pre = document.getElementById('output');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

function calculateNormAnova123(input) {


    $.post('normalDist.php', {in1: JSON.stringify(input)},
            function (data)
            {
                var json = data;
                obj = JSON.parse(json);
                obj = JSON && JSON.parse(json) || $.parseJSON(json);
                console.log(obj);
                // var across = (obj.data[0][1]);

            });

}