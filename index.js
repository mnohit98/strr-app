const express = require('express');
const bodyParser = require('body-parser');
const locationRoutes = require('./routes/locationRoutes');
const activityRoutes = require('./routes/activityRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const blobRoutes = require('./routes/blobRoutes');
const {chatRoutes, chatSocket} = require('./routes/chatRoutes');
const swaggerSetup = require('./swagger');
const authenticateToken = require('./middleware/authToken'); // Import the auth middleware
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const app = express();

// Enable CORS for requests from 'http://localhost:4000'
const corsOptions = {
  origin: 'http://localhost:4000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,  // Allow cookies if needed
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
const PORT = process.env.PORT || 3000;
swaggerSetup(app);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
    
app.disable('x-powered-by');
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/api/location', authenticateToken, locationRoutes);
app.use('/api/activity', authenticateToken, activityRoutes);
app.use('/api/user', authenticateToken, userRoutes);
app.use('/api/chat', authenticateToken, chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/blob', authenticateToken, blobRoutes);
app.use(express.static('public'))

const server = require('http').createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

chatSocket(server);