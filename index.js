const express = require('express');
const bodyParser = require('body-parser');
const locationRoutes = require('./routes/locationRoutes');
const activityRoutes = require('./routes/activityRoutes');
const userRoutes = require('./routes/userRoutes');
const swaggerSetup = require('./swagger');

const app = express();
const PORT = process.env.PORT || 3000;
swaggerSetup(app);
app.use(bodyParser.json());

app.use('/api/location', locationRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/user', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
