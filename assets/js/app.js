var client_id = '19749026565-sel10tirv0a9t0hnl6cumr54b07perib.apps.googleusercontent.com';
var params = {},
    queryString = location.hash.substring(1),
    regex = /([^&=]+)=([^&]*)/g,
    m;
while (m = regex.exec(queryString)) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    localStorage.setItem('access_token', params.access_token);
    localStorage.setItem('token_type', params.token_type);
    localStorage.setItem('expires_in', params.expires_in);
}
$.get('https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + localStorage.access_token, function(r) {
    if (r.aud !== client_id) {
        return false;
    } else {
        localStorage.setItem('user', r.sub);
    }
})
$.get('https://www.googleapis.com/plus/v1/people/' + localStorage.user + '?access_token=' + localStorage.access_token, function(person) {
    localStorage.setItem('displayName', person.displayName);
    localStorage.setItem('image', person.image.url);
})
if (localStorage.displayName) {
    $('#profile_caption').html(localStorage.displayName.toUpperCase());
}
// I prefer the Google API Client Library for Calendars.
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
        // authorizeDiv.style.display = 'none';
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

    shifts.execute(function(calendar_data) {
        func(calendar_data);
    });

}
var today = new Date();
var yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
var sunday = new Date(today.getFullYear(), today.getMonth(), today.getDate(today.getDay() === 0 ? 0 : 7) - today.getDay());
var sundayISO = sunday.toISOString();
var day1 = {};
day1[sundayISO] = [];
var schedule = [day1];
var scheduleISOStrings = [sundayISO];
for (i = 1; i < 15; i++) {
    var d = new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate(), sunday.getHours(), sunday.getMinutes(), sunday.getSeconds(), sunday.getMilliseconds() + (i * 86400000));
    scheduleISOStrings.push(d.toISOString());
    var next = {}
    next[d.toISOString()] = [];
    var lSKey = i + 1;
    schedule.push(next);
    localStorage.setItem("day1", Object.keys(day1)[0]);
}

function func(data) {
    localStorage.setItem('APIdata', JSON.stringify(data));
}
if (localStorage.APIdata) {
    var dataAPI = JSON.parse(localStorage.APIdata);
    var shifts = dataAPI.items;
}
shifts.forEach(function(a, b, c) {
    schedule.forEach(function(d, e, f) {
        var k = Object.keys(d)[0],
            n = e > 0 ? e - 1 : 0,
            x = f[n],
            k2 = Object.keys(x)[0];
        if (new Date(a.start.dateTime) < new Date(k) && new Date(a.start.dateTime) >= new Date(k2)) {
            f[n][k2].push(a);
        }
    });
});

function equalsMe(x, y, z) {
    return x.displayName == localStorage.displayName;
}
for (i = 0; i < 14; i++) {
    var highlight = "";
    var time = "";
    if (schedule[i][scheduleISOStrings[i]].length > 0) {
        schedule[i][scheduleISOStrings[i]].forEach(function(x, y, z) {
            if (x.attendees.some(equalsMe)) {
                var start = new Date(x.start.dateTime),
                    end = new Date(x.end.dateTime);
                time += '\n' + start.toLocaleTimeString() + ' - ' + end.toLocaleTimeString();
                highlight = ' highlighted';
                schedule[i][scheduleISOStrings[i]].me = true;
                console.log('i am schedule', schedule);
            }
        });
    }
    if (new Date(scheduleISOStrings[i + 1]) < today) {
        highlight += ' opacity-50';
    }
    var div = $('<div title="' + time + '" class="day' + highlight + '">' + new Date(scheduleISOStrings[i]).getDate() + '</div>')
    $('#schedule').append(div);
}
var mine = [];

for(i = 0; i < 14; i++){
  if(schedule[i][scheduleISOStrings[i]].hasOwnProperty('me')){
    mine.push(schedule[i]);
  }
}
var upcoming = [];
//find the smallest higher than today
for (i = 0; i < mine.length; i++){
  console.log('mine i ', mine[i]);
  var a = mine[i][Object.keys(mine[i])[0]][0].start.dateTime;
  console.log('a', new Date(a), 'today', new Date());
  if(new Date(a) >= new Date()) {
    upcoming.push(mine[i]);
  }
}
//about here is where I've gone all the way off the deep end. I apologize for the schizophrenic code.
var next_shift = new Date(Object.keys(upcoming[0])[0]);
console.log('upcoming', upcoming[0]);
console.log('mine', mine);
console.log('next shift', next_shift);
var next_day = next_shift.getDay();
var weekday = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
$('#next_shift h2').html(weekday[next_day]);
$('#time').html(new Date(upcoming[0][next_shift.toISOString()][0].start.dateTime).toLocaleTimeString() + ' - ' + new Date(upcoming[0][next_shift.toISOString()][0].end.dateTime).toLocaleTimeString());
$('#location').html(upcoming[0][next_shift.toISOString()][0].location);
$('iframe').attr('src', "https://www.google.com/maps/embed/v1/place?key=AIzaSyDqLl0PzeqFJE5dLUv81Y5qgmyK1WUcgfw&q=" + upcoming[0][next_shift.toISOString()][0].location);
