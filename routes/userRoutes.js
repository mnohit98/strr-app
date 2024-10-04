const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');


/**
 * @swagger
 * /api/user/member/{memberId}/clubs:
 *   get:
 *     tags: [Member]
 *     summary: Get clubs for a member
 *     security:
 *       - BearerAuth: []
 *     description: Retrieve a list of clubs that a member belongs to by their member ID.
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the member.
 *     responses:
 *       200:
 *         description: List of clubs the member belongs to
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   club_id:
 *                     type: string
 *                   club_name:
 *                     type: string
 *                   reputation:
 *                     type: integer
 *                   meetup_places:
 *                     type: string
 *                   meetup_timings:
 *                     type: string
 *                   faqs:
 *                     type: object
 *                     additionalProperties:
 *                       type: string
 *                   dp_url:
 *                     type: string
 *                   activity_tag_id:
 *                     type: string
 *       404:
 *         description: Member not found or no clubs associated
 *       500:
 *         description: Internal server error
 */
router.get('/member/:memberId/clubs', userController.getClubsByMemberId);


module.exports = router;
