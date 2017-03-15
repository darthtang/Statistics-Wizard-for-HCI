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

function checkAuth1() {

    sheetID = (document.getElementById("userInput").value);
    console.log(sheetID);
    gapi.auth.authorize(
            {
                'client_id': CLIENT_ID,
                'scope': SCOPES.join(' '),
                'immediate': true
            }, GoogleConnectorhandleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function GoogleConnectorhandleAuthResult(authResult) {
    var authorizeDiv = document.getElementById('authorize-div');
    if (authResult && !authResult.error) {
        // Hide auth UI, then load client library.
        authorizeDiv.style.display = 'none';
        GoogleConnectorloadSheetsApi();

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
function handleAuthClick(event) {
    gapi.auth.authorize(
            {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
            GoogleConnectorhandleAuthResult);
    return false;
}

/**
 * Load Sheets API client library.
 */
function GoogleConnectorloadSheetsApi() {

    gapi.client.load(discoveryUrl).then(GoogleConnectorlistMajors123);

}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function GoogleConnectorlistMajors123() {

    gapi.client.sheets.spreadsheets.get({
        spreadsheetId: sheetID,
    }).then(function (response) {
        var object = (response.result);

        console.log(object);
        console.log(object.sheets[1].properties.title);

        var target = (document.getElementById("sheetName").value);

        for (x = 0; x < object.sheets.length; x++) {
            if (target === object.sheets[x].properties.title) {
                console.log('sucess');
                numberOfColumns123 = (object.sheets[x].properties.gridProperties.columnCount);
                console.log(numberOfColumns123);
                gapi.client.load(discoveryUrl).then(GoogleConnectorlistMajors(numberOfColumns123));
            } else {
                console.log('nothing yet');
            }
        }
    });

}

function GoogleConnectorpushToSheet(chunkinput, reject, criticalValIN,ratio) {
    console.log('look below me');
    console.log(reject);
    if (reject === 1) {
        var resultOfTest = 'Your F-ratio is GREATER than your critical value. There is a significant difference between the columns';
    } else {
        var resultOfTest = 'Your F-ratio is LESS THAN than your critical value. There is no significant difference between the columns';

    }
    
    var nameOfSheet = (document.getElementById("sheetName").value);
    nameOfSheet += "-One-Way-ANOVA-Results";
    console.log(chunkinput);
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


function GoogleConnectorlistMajors(input) {
    
    var nameOfSheet = (document.getElementById("sheetName").value);
    nameOfSheet += "-One-Way-ANOVA-Results";
    console.log('asdfsdfsdfsdfsdf');
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
    console.log(input);


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
                    GoogleConnectorAnova123(stringToPass, range.values.length, input);
                }
            }
        } else {
            appendPre('No data found.');
        }
    }, function (response) {
        appendPre('Error: ' + response.result.error.message);
    });



}


function GoogleConnectorappendPre(message) {
    var pre = document.getElementById('output');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

function GoogleConnectorAnova123(input, length, col) {


    $.post('ChiSquared.php', {in1: input, in2: length, in3: col},
            function (data)
            {
                var json = data;
                obj = JSON.parse(json);
                obj = JSON && JSON.parse(json) || $.parseJSON(json);
                console.log(obj);
                var across = (obj.data[0][1]);
                var down = (obj.data[1][1]);
                var ratio = (obj.data[2][1]);

                gapi.client.load(discoveryUrl).then(GoogleConnectorlookUpFtable(across, down, ratio, obj));

            });

}

function GoogleConnectorlookUpFtable(acrossIn, lengthIn, ratioIn, chunk) {

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
            var delayMillis = 2000;
            setTimeout(function () {
                GoogleConnectorpushToSheet(chunk, 1, criticalValue,ratioIn);
            }, delayMillis);
        } else {
            console.log('there is NO sig diff in the data. F = ' + ratioIn);
            var delayMillis = 2000;
            setTimeout(function () {
                GoogleConnectorpushToSheet(chunk, 0, criticalValue,ratioIn);
            }, delayMillis);
        }

    });

}
