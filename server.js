const express = require('express');

const app = express(); //initializing app variable with express
const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => res.send('API Running'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
