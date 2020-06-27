const express = require('express');
const connectDB = require('./config/db');

const app = express(); //initializing app variable with express

//lets connect database
connectDB();

//initializing Parser
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => res.send('API Running'));
//Define Routes

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/post'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
