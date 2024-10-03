const express = require('express');
const bodyParser = require('body-parser');
const locationRoutes = require('./routes/locationRoutes');
const activityRoutes = require('./routes/activityRoutes');
const userRoutes = require('./routes/userRoutes');
const {chatRoutes, chatSocket} = require('./routes/chatRoutes');
const swaggerSetup = require('./swagger');

const app = express();
const PORT = process.env.PORT || 3000;
swaggerSetup(app);
app.use(bodyParser.json());

app.use('/api/location', locationRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use(express.static('public'))


const server = require('http').createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

chatSocket(server);