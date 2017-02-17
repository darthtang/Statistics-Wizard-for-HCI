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

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
    var authorizeDiv = document.getElementById('authorize-div');
    if (authResult && !authResult.error) {
        // Hide auth UI, then load client library.
        authorizeDiv.style.display = 'none';
        loadSheetsApi();

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
            handleAuthResult);
    return false;
}

/**
 * Load Sheets API client library.
 */
function loadSheetsApi() {

    gapi.client.load(discoveryUrl).then(listMajors123);

}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function listMajors123() {

//    gapi.client.sheets.spreadsheets.get({
//        spreadsheetId: sheetID,
//    }).then(function (response) {
//        var object = (response.result);
//
//        console.log(object);
//        console.log(object.sheets[1].properties.title);
//
//        var target = (document.getElementById("sheetName").value);
//
//        for (x = 0; x < object.sheets.length; x++) {
//            if (target === object.sheets[x].properties.title) {
//                console.log('sucess');
//                numberOfColumns123 = (object.sheets[x].properties.gridProperties.columnCount);
//                console.log(numberOfColumns123);
//                gapi.client.load(discoveryUrl).then(listMajors(numberOfColumns123));
//            } else {
//                console.log('nothing yet');
//            }
//        }
//    });

    console.log('asdfsdfsdfsdfsdf');
    gapi.client.sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheetID,
        requests: [
            {
                addSheet: {
                    properties: {
                        title: "Deposits",
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

    gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: sheetID,
         range: "Deposits!A1:D5",
        valueInputOption: "USER_ENTERED",
        majorDimension: "ROWS",
        values: [
            ["Spicy", "Dolly", "Spicy", "Ship Date"],
            ["Wheel", "$20.50", "4", "3/1/2016"],
            ["Door", "$15", "2", "3/15/2016"],
            ["Engine", "$100", "1", "30/20/2016"],
            ["Totals", "=SUM(B2:B4)", "=SUM(C2:C4)", "=MAX(D2:D4)"]
        ],
    }).then(function (response1234) {
        console.log(response1234);
    });

}

function listMajors(input) {

    var lastLetterLower = (document.getElementById("userLastColumnLetters").value);
    var lastLetters = lastLetterLower.toUpperCase();
    var sheetName = (document.getElementById("sheetName").value);

    rangeInput = sheetName + '!A2:' + lastLetters;
    console.log(input + "old method");


    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: sheetID,
        range: rangeInput,
    }).then(function (response) {
        var range = response.result;
        console.log(range.values[1][1] + "mew");
        if (range.values.length > 0) {
            for (x = 0; x < input; x++) {
                stringToPass = stringToPass + "***";
                for (i = 0; i < range.values.length; i++) {
                    var row = range.values[i];

                    stringToPass = stringToPass + "_" + row[x];

                }
                if (x === (input - 1)) {
                    console.log(stringToPass);
                    Anova123(stringToPass, range.values.length, input);
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

function Anova123(input, length, col) {

    $.post('repeatedAnova.php', {in1: input, in2: length, in3: col},
            function (data)
            {
                var json = data;
                obj = JSON.parse(json);
                obj = JSON && JSON.parse(json) || $.parseJSON(json);
                var across = (obj.data[0][1]);
                var down = (obj.data[1][1]);
                var ratio = (obj.data[2][1]);

                gapi.client.load(discoveryUrl).then(lookUpFtable(across, down, ratio));

            });

}

function lookUpFtable(acrossIn, lengthIn, ratioIn) {

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
