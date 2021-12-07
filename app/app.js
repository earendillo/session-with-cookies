const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

let sessions = {};

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
    const sessionId = sessions[req.cookies['sessionId']] ? req.cookies['sessionId'] : '';

    res.send(getView(sessionId));
});

app.get('/create-session', (req, res) => {
    let sessionId = req.cookies['sessionId'];
    if (!sessions[req.cookies['sessionId']]) {
        sessionId = createSessionId();
        sessions[sessionId] = {values: []};
        res.cookie('sessionId', sessionId);
    }

    res.send(getView(sessionId));
});

app.get('/delete-session', (req, res) => {
    delete sessions[req.cookies['sessionId']];
    res.clearCookie('sessionId');
    res.send(getView(''));
});

app.post('/add-to-session', (req, res) => {
    const sessionId = req.cookies['sessionId'];

    if (sessions[sessionId]) {
        sessions[sessionId].values.push({value: req.body.value});
    }

    res.send(getView(sessionId));
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
        '    <form action="/create-session" method="get" >\n' +
        '        <div>\n' +
        '            <input type="submit" value="Create session!">\n' +
        '        </div>\n' +
        '    </form>' +
        '    <form action="/delete-session" method="get" >\n' +
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


