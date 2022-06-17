const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use( express.static('public') );

app.use( cors() );
app.use( express.json() );

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})