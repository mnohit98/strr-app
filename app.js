const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const locationRoutes = require('./routes/location.routes');
const activityRoutes = require('./routes/activity.routes');