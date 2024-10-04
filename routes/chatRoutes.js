const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController.js');
const socketIO = require('socket.io');
const {SentChatMessage} = require("../models/chatModel");
const chatService = require("../services/chatService.js");


/**
 * @swagger
 * tags:
 *   - name: Chat
 *     description: API for managing chat
 */

const chatSocket = (server) => {
    let io = socketIO(server);

    // Define your socket events here
    io.on('connection', (socket) => {
        console.log(`A user connected: ${socket.id} ${socket.memberId}`);

        socket.on('open-club-chat', (msg) => {
            socket.join(msg.clubId);
            console.log(`User opened chat: ${msg.clubId} ${socket.memberId}`);
        });

        socket.on('close-club-chat', (msg) => {
            socket.leave(msg.clubId);
            console.log(`User closed chat: ${msg.clubId} ${socket.memberId}`);
        });

        socket.on('send-message', async (msg) => {
            const { memberId, clubId, messageText } = msg;
            const sentAt = (Date.now() - Date.now() % 1000)/1000;
            const sentChatMessage = new SentChatMessage(memberId, clubId, messageText, sentAt);
            const chatMsg = await chatService.broadcastMessageToClub(sentChatMessage);
            console.log('Message stored to db: ', msg);
            io.to(msg.clubId).emit('receive-message', {
                id: socket.id,
                message: chatMsg
            });
        });
    });
};

/**
 * @swagger
 * /api/chat/send-message:
 *   post:
 *     tags: [Chat]
 *     summary: Send a chat message
 *     security:
 *       - BearerAuth: []
 *     description: Endpoint to send a chat message from a member to a club
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               memberId:
 *                 type: string
 *                 description: The ID of the member sending the message
 *                 example: "12345"
 *               clubId:
 *                 type: string
 *                 description: The ID of the club receiving the message
 *                 example: "67890"
 *               messageText:
 *                 type: string
 *                 description: The text content of the message
 *                 example: "Hello, everyone!"
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 messageId:
 *                   type: string
 *                   description: ID of the sent message
 *                   example: "abc123"
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid request payload"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post('/send-message', chatController.broadcastChatMessageToClub);

/**
 * @swagger
 * /api/chat/get-history:
 *   post:
 *     tags: [Chat]
 *     summary: Get chat history
 *     security:
 *       - BearerAuth: []
 *     description: Fetches the chat history of a specific club before a given timestamp
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clubId:
 *                 type: string
 *                 description: The ID of the club for which chat history is being fetched
 *                 example: "67890"
 *               sentBefore:
 *                 type: integer
 *                 format: int64
 *                 description: Fetch messages sent before this timestamp
 *                 example: 1696348496
 *     responses:
 *       200:
 *         description: Array of chat messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   message_id:
 *                     type: string
 *                     description: Unique ID of the message
 *                     example: "msg123"
 *                   member_id:
 *                     type: string
 *                     description: ID of the member who sent the message
 *                     example: "mem456"
 *                   name:
 *                     type: string
 *                     description: Name of the member who sent the message
 *                     example: "John Doe"
 *                   message_text:
 *                     type: string
 *                     description: The text content of the message
 *                     example: "Hey, how's everyone?"
 *                   sent_at:
 *                     type: integer
 *                     format: int64
 *                     description: Timestamp when the message was sent
 *                     example: 1696348496
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid request payload"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post('/get-history', chatController.getChatHistoryForClub);



module.exports = {chatRoutes: router, chatSocket};