const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

const SESSION_ID = 'sessionId';
const URL_ENCODED_OPTIONS = {
    extended: true
};
const sessions = {};

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded(URL_ENCODED_OPTIONS));

app.get('/', (req, res) => {
    const sessionIdFromRequest = req.cookies[SESSION_ID];
    const sessionId = sessions[sessionIdFromRequest] ? sessionIdFromRequest : '';

    res.send(getView(sessionId));
});

app.post('/create-session', (req, res) => {
    let sessionId = req.cookies[SESSION_ID];
    if (!sessions[req.cookies[SESSION_ID]]) {
        sessionId = createSessionId();
        sessions[sessionId] = {values: []};
        res.cookie('sessionId', sessionId);
    }

    res.redirect('/');
});

app.post('/delete-session', (req, res) => {
    delete sessions[req.cookies[SESSION_ID]];
    res.clearCookie(SESSION_ID);
    res.redirect('/');
});

app.post('/add-to-session', (req, res) => {
    const sessionId = req.cookies[SESSION_ID];

    if (sessions[sessionId]) {
        sessions[sessionId].values.push({value: req.body.value});
    }

    res.redirect('/');
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

function createSessionId() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2)}`;
}

function getView(sessionId = '') {
    let sessionValues = '';

    if (sessionId && sessions[sessionId]) {
        for (let object of sessions[sessionId].values) {

            sessionValues = sessionValues + `${object.value} `;
        }
    }

    return `<h1>${sessionId ? sessionId : 'no session initialized'}</h1>\n` +
        `<p>${sessionValues ? sessionValues : 'no session values'}</p>` +
        '    <form action="/create-session" method="post" >\n' +
        '        <div>\n' +
        '            <input type="submit" value="Create session!">\n' +
        '        </div>\n' +
        '    </form>' +
        '    <form action="/delete-session" method="post" >\n' +
        '        <div>\n' +
        '            <input type="submit" value="Delete session!">\n' +
        '        </div>\n' +
        '    </form>\n' +
        '    <form action="/add-to-session" method="post" >\n' +
        '        <div>\n' +
        '            <input type="text" value="" name="value">\n' +
        '            <input type="submit" value="Add to session!">\n' +
        '        </div>\n' +
        '    </form>\n'
}


