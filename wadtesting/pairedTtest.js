//Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '281296927473-dru253jk83in453051u1t97f0ckdktom.apps.googleusercontent.com';

var SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

var sheetID = "YO";

var stringToPass = "*";

var discoveryUrl = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

var numberOfColumns = 0;

var rangeInput = "empty range";

var tableRange = "a = 0.10!";

function pairedTtestRun() {

    sheetID = (document.getElementById("userInput").value);
    console.log(sheetID);
    gapi.auth.authorize(
            {
                'client_id': CLIENT_ID,
                'scope': SCOPES.join(' '),
                'immediate': true
            }, pairedTtesthandleAuthResult);
}


function pairedTtesthandleAuthResult(authResult) {
    var authorizeDiv = document.getElementById('authorize-div');
    if (authResult && !authResult.error) {
        // Hide auth UI, then load client library.
        authorizeDiv.style.display = 'none';
        pairedTtestloadSheetsApi();

    } else {
        // Show auth UI, allowing the user to initiate authorization by
        // clicking authorize button.
        authorizeDiv.style.display = 'inline';
    }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function pairedTtesthandleAuthClick(event) {
    gapi.auth.authorize(
            {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
            pairedTtesthandleAuthResult);
    return false;
}

/**
 * Load Sheets API client library.
 */
function pairedTtestloadSheetsApi() {

    gapi.client.load(discoveryUrl).then(pairedTtestlistMajors);

}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */


function pairedTtestlistMajors() {

//    var lastLetterLower = (document.getElementById("userLastColumnLetters").value);
//    var lastLetters = lastLetterLower.toUpperCase();
    var sheetName = (document.getElementById("sheetName").value);
//
    rangeInput = sheetName + '!A2:B';
//    console.log(input);
//    console.log(rangeInput);


    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: sheetID,
        range: rangeInput,
    }).then(function (response) {
        var range = response.result;
        //console.log(range);
        pairedTtestAnova123(range)
    });



}


function pairedTtestappendPre(message) {
    var pre = document.getElementById('output');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

function pairedTtestAnova123(input) {
    
    //console.log(input);
    

    $.post('pairedTtest.php', {in1: JSON.stringify(input)},
            function (data)
            {
                var json = data;
              console.log(data);
                obj = JSON.parse(json);
                obj = JSON && JSON.parse(json) || $.parseJSON(json);
                   console.log(obj.data[0][1]);
                   console.log('sdfsdfsdf');

               // gapi.client.load(discoveryUrl).then(lookUpFtable(across,down,ratio));

            });
}

function pairedTtestlookUpFtable(acrossIn, lengthIn, ratioIn) {

    console.log(acrossIn);
    console.log(lengthIn);
    console.log(ratioIn);
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
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1Ugb7TtHSuDVyibD70qokK_QLu5nv9pg3daw_J-7eEsU',
        range: tableRange,
    }).then(function (response) {
        var range1 = response.result;
        var criticalValue = (range1.values[0][0]);
        if (ratioIn >= criticalValue) {
            console.log('there is a sig diff in the data. F = ' + ratioIn);
            console.log('crit is: ' + criticalValue);
        } else {
            console.log('there is NO sig diff in the data. F = ' + ratioIn);
            console.log('crit is: ' + criticalValue);
        }

    });
}
