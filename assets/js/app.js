var CLIENT_ID = '19749026565-sel10tirv0a9t0hnl6cumr54b07perib';
var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly", 'profile'];

//authorize that jank
function checkAuth() {
    gapi.auth.authorize({
        'client_id': CLIENT_ID,
        'scope': SCOPES.join(' '),
        'immediate': true
    }, handleAuthResult);
}
// depending on the result, let's run the API
function handleAuthResult(authResult) {
    var authorizeDiv = document.querySelector('#authorize-div');
    if (authResult && !authResult.error) {
        authorizeDiv.style.display = 'none';
        loadCalendarApi();
    } else {
        authorizeDiv.style.display = 'inline';
    }
}

function handleAuthClick(event) {
    gapi.auth.authorize({
            client_id: CLIENT_ID,
            scope: SCOPES,
            immediate: false
        },
        handleAuthResult);
    return false;
}

function loadCalendarApi() {
    var today = new Date();
    var sunday = new Date(today.getFullYear(), today.getMonth(), today.getDate(today.getDay() === 0 ? 0 : 7) - today.getDay());
    var sundayISO = sunday.toISOString();
    var day1 = {};
    day1[sundayISO] = [];
    var schedule = [day1];
    for (i = 1; i < 15; i++) {
        var d = new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate(), sunday.getHours(), sunday.getMinutes(), sunday.getSeconds(), sunday.getMilliseconds() + (i * 86400000));
        var next = {}
        next[d.toISOString()] = [];
        var lSKey = i + 1;
        localStorage.setItem('day' + lSKey, Object.keys(next)[0]);
        schedule.push(next);
    }
    localStorage.setItem("day1", Object.keys(day1)[0]);
    gapi.client.load('calendar', 'v3', listUpcomingEvents);
}

function listUpcomingEvents() {

    var shifts = gapi.client.calendar.events.list({
        'calendarId': 'mackintoshsecurity.com_brjlf7ls2dmrbvet7pjpl2hflo@group.calendar.google.com',
        'timeMin': localStorage.getItem('day1'),
        'timeMax': localStorage.getItem('day15'),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 42,
        'orderBy': 'startTime'
    });

    shifts.execute(function(resp) {
        console.log(resp.items);
    });
}
