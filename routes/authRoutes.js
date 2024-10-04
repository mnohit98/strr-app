// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db.config');
const validator = require('validator');
const sendVerificationEmail = require("../utils/sendMail");
const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registers a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *               - email
 *               - contact_number
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name for the new user
 *               password:
 *                 type: string
 *                 description: Password for the new user
 *               email:
 *                 type: string
 *                 description: Email address for the new user
 *               contact_number:
 *                 type: int64
 *                 description: Contact number of user
 *             example:
 *               name: johndoe
 *               password: Password123
 *               email: johndoe@example.com
 *               contact_number: 9889898898
 *     responses:
 *       200:
 *         description: Registration successful, email verification required
 *       400:
 *         description: Invalid input or user already exists
 *       500:
 *         description: Server error
 */
router.post('/register', async (req, res) => {
    let { name, email, contact_number, password } = req.body;
    // Validator function for name
    const validateName = (name) => {
        const nameRegex = /^[a-zA-Z][a-zA-Z\s.]*$/;
        return nameRegex.test(name);
    };
    // Sanitize input
    contact_number = contact_number.toString();
    contact_number = validator.trim(contact_number);
    name = validator.trim(name);
    password = validator.trim(password);
    email = validator.normalizeEmail(validator.trim(email).toLowerCase()); // Sanitize email

    if(!(validateName(name) && validator.isLength(name, {min: 1, max: 60}))) {
        return res.status(400).send('Invalid name.');
    }
    // Validate input
    if (!(validator.isEmail(email) && validator.isLength(email, {min: 1, max: 60}))) {
        return res.status(400).send('Invalid email address.');
    }

    if(!(validator.isNumeric(contact_number) && validator.isLength(contact_number, { max: 10, min: 10 }))) {
        return res.status(400).send('Invalid number');
    }

    if (!validator.isLength(password, { min: 6, max: 64 })) {
        return res.status(400).send('Password must be least 6-64 characters long.');
    }



    // Check if the user already exists
    db.query('SELECT * FROM member WHERE email = ? OR contact_number = ?', [email, contact_number], async (err, results) => {
        if (err) {
            return res.status(500).send('Error checking user');
        }

        if (results.length > 0) {
            return res.status(400).send('Username , email or contact already exists.');
        }

        try {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);


            // Insert the new user into the database with email_verified = false
            db.query(
                'INSERT INTO member (name, password, email, contact_number, email_verified) VALUES (?, ?, ?,?, false)',
                [name, hashedPassword, email, contact_number],
                (err, result) => {
                    if (err) {
                        return res.status(500).send('Error registering user');
                    }

                    // Generate a JWT token for email verification (expires in 1 hour)
                    const token = jwt.sign({ userId: result.insertId, email }, process.env.JWT_SECRET, {
                        expiresIn: '1h',
                    });

                    // Send email with the verification link
                    const verificationLink = `${req.protocol}://${req.get('host')}/api/auth/verify-email?token=${token}`;
                    sendVerificationEmail(email, verificationLink).then(() => res.status(200).send('Email link sent for verification'));
                }
            );
        } catch (error) {
            res.status(500).send('Error hashing password');
        }
    });
});

/**
 * @swagger
 * /api/auth/verify-email:
 *   get:
 *     summary: Verifies a user's email
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The verification token sent to the user's email
 *     responses:
 *       200:
 *         description: Email successfully verified
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Server error
 */
router.get('/verify-email', (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.status(400).send('Verification token is missing.');
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userId } = decoded;

        // Update the user's verification status in the database
        db.query('UPDATE member SET email_verified = true WHERE id = ?', [userId], (err, result) => {
            if (err) {
                return res.status(500).send('Error verifying email.');
            }

            res.status(200).send('Email verified successfully. You can now log in.');
        });
    } catch (error) {
        res.status(400).send('Invalid or expired token.');
    }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Logs in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email for the user
 *               password:
 *                 type: string
 *                 description: Password for the user
 *             example:
 *               email: example@gmail.com
 *               password: Password123
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Sanitize input
    const sanitizedEmail = validator.normalizeEmail(validator.trim(email).toLowerCase()); // Sanitize email

    const sanitizedPassword = validator.trim(password);

    // Find the user in the database
    db.query('SELECT * FROM member WHERE email = ?', [sanitizedEmail], async (err, results) => {
        if (err) {
            return res.status(500).send('Error finding user');
        }

        if (results.length === 0) {
            return res.status(400).send('User not found');
        }

        const user = results[0];

        // Check if the user is verified
        if (!user.email_verified) {
            return res.status(400).send('Please verify your email before logging in.');
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(sanitizedPassword, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        // Create a JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    });
});

/**
 * @swagger
 * /api/auth/resend-verification:
 *   post:
 *     summary: Resends the email verification link if the previous one expired
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address to receive the verification link
 *             example:
 *               email: johndoe@example.com
 *     responses:
 *       200:
 *         description: A new verification link has been sent to the email address
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: A new verification link has been sent to your email.
 *       400:
 *         description: The email is already verified or the input is invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email is already verified.
 *       404:
 *         description: User not found with the provided email address
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error. Please try again later.
 */
router.post('/resend-verification', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send({ message: 'Email is required.' });
    }

    const query = 'SELECT * FROM member WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            return res.status(500).send('Error finding user');
        }

        if (!results.length) {
            return res.status(404).send({ message: 'User not found.' });
        }

        if (results[0].email_verified) {
            return res.status(400).send({ message: 'Email is already verified.' });
        }

        // Generate a new verification token (JWT) valid for a certain time (e.g., 1 hour)
        const token = jwt.sign({ id: results[0].id, email: results[0].email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Construct a verification link with the new token
        const verificationLink = `http://localhost:3000/api/auth/verify-email?token=${token}`;

        // Send a new verification email
        sendVerificationEmail(results[0].email, verificationLink)
            .then(() => {
                res.status(200).send({ message: 'A new verification link has been sent to your email.' });
            })
            .catch(() => {
                res.status(500).send({ message: 'Could not send link' });
            })


    });
});
module.exports = router;

