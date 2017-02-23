//Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '281296927473-dru253jk83in453051u1t97f0ckdktom.apps.googleusercontent.com';

var SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

var sheetID = "YO";

var stringToPass = "*";

var discoveryUrl = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

var numberOfColumns = 0;

var rangeInput = "empty range";

var tableRange1 = "Sheet1!";

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
        console.log(range.values.length);
        pairedTtestAnova123(range)
    });



}


function pairedTtestappendPre(message) {
    var pre = document.getElementById('output');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

function pairedTtestAnova123(input) {
    
    $.post('pairedTtest.php', {in1: JSON.stringify(input)},
            function (data)
            {
                var json = data;
              console.log(data);
                obj = JSON.parse(json);
                obj = JSON && JSON.parse(json) || $.parseJSON(json);
                  var tRatio =  obj.data[0][1];
                   var length = (obj.data[1][1])-1;
                   
                   console.log(tRatio);
                   console.log(length);

              gapi.client.load(discoveryUrl).then(pairedTtestlookUpFtable(tRatio,length));

            });
}

function pairedTtestlookUpFtable(tRatioIn,lengthIn) {

    tableRange1 = tableRange1 + "B" + (lengthIn + 1);
    console.log(tableRange1);
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1ubh4Mk7zxH5D5bF_uMqg9AAgWFkEfXunQkDpqgEufwA',
        range: tableRange1,
    }).then(function (response) {
        var range1 = response.result;
        var criticalValue = (range1.values[0][0]);
        if ((tRatioIn <= -Math.abs(criticalValue))||(tRatioIn >= criticalValue)) {
            console.log('We reject the null hypothises as ' );
            var stringPass1 = 'We reject the null hypothises as';
            
            gapi.client.load(discoveryUrl).then(PairedTtestcreateGoogleObjects(stringPass1));

        } else {
            console.log('We ACCEPT the null hypothises as');
            var stringPass1 = 'We ACCEPT the null hypothises as';
            gapi.client.load(discoveryUrl).then(PairedTtestcreateGoogleObjects(stringPass1));

        }

    });
}

function PairedTtestcreateGoogleObjects(obj) {
    console.log('asdfsdfsdfsdfsdf');
    var nameOfSheet = (document.getElementById("sheetName").value);
    nameOfSheet += "-T-Test-output"
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
                [obj, obj],
            ],
        }).then(function (response1234) {
            console.log('2');
        });
    }, delayMillis);
}
