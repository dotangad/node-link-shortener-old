const app = require('express')();

app.get('/api/create_route', (req, res) => {
  res.json(req.query);
});

app.listen(3000);
