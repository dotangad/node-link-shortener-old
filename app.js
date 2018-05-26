const bodyParser = require('body-parser');
const express = require('express');
const FileSync = require('lowdb/adapters/FileSync');
const low = require('lowdb');

const app = express();

const adapter = new FileSync('routes.json');
const db = low(adapter);

app.use(bodyParser.json({ inflate: true }));

db.defaults({})
  .write();

function createRoute(req, res) {
  const short = req.query.short || req.body.short;
  // Use encodeURIComponent in the frontend to encode URL
  const long = decodeURIComponent(req.query.long) || req.body.long;
  if(db.has(short).value()) {
    res.send('exists');
  } else {
    db.set(short, long)
      .write();
    res.send('success');
  }
  res.end();  
}

app.get('/api/create_route', createRoute);
app.post('/api/create_route', createRoute);

app.get('/api/get_routes', (req, res) => {
  res.json(db.getState());
});

app.get('/:short', (req, res) => {
  res.redirect(db.has(req.params.short).value());
});

app.get('/', (req, res) => {
  res.render('index.html');
});

app.use(function(req, res, next){
  res.status(404);
  res.end('404');
});

app.listen(3000);
