const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const app = express(); //initializing app variable with express

//lets connect database
connectDB();

//initializing Parser Old= body parser, New= express khudka parser diya hai
app.use(express.json());

//Define Routes

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/post'));

//serve the static assets in production
if (process.env.NODE_ENV === 'production') {
  //Set the static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
