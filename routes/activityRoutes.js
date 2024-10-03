const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController.js');

/**
 * @swagger
 * /api/activity/{clubId}/upcoming-meetups:
 *   get:
 *     tags: [Meetup]
 *     summary: Get upcoming meetups by club ID
 *     description: Retrieve a list of upcoming meetups for a specific club by its ID.
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         description: The ID of the club to retrieve upcoming meetups for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of upcoming meetups
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   activity_id:
 *                     type: string
 *                     description: Activity ID
 *                   activity_name:
 *                     type: string
 *                     description: Name of the activity
 *                   start_datetime:
 *                     type: string
 *                     format: date-time
 *                     description: Start date and time of the activity
 *                   end_datetime:
 *                     type: string
 *                     format: date-time
 *                     description: End date and time of the activity
 *                   venue:
 *                     type: string
 *                     description: Venue of the activity
 *                   about:
 *                     type: string
 *                     description: Description of the activity
 *                   fee:
 *                     type: number
 *                     format: double
 *                     description: Fee for the activity
 *                   payment_type:
 *                     type: integer
 *                     description: Payment type (1=postpaid, 2=prepaid, 3=free)
 *                   activity_photo_url:
 *                     type: string
 *                     description: URL of the activity photo
 *                   club_name:
 *                     type: string
 *                     description: Name of the club
 *                   club_reputation:
 *                     type: integer
 *                     description: Reputation of the club
 *       404:
 *         description: Club not found
 *       500:
 *         description: Internal server error
 */
router.get('/:clubId/upcoming-meetups', activityController.getUpcomingMeetups);

/**
 * @swagger
 * /api/activity/{clubId}/info:
 *   get:
 *     tags: [Club]
 *     summary: Get club information by club ID
 *     description: Retrieve detailed club information, including admins, members, and reputation by the club ID.
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         description: The ID of the club to retrieve information for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Club information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 club_id:
 *                   type: string
 *                   description: Club ID
 *                 club_name:
 *                   type: string
 *                   description: Name of the club
 *                 reputation:
 *                   type: integer
 *                   description: Reputation score of the club
 *                 admins:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Admin ID
 *                       name:
 *                         type: string
 *                         description: Name of the admin
 *                       email:
 *                         type: string
 *                         description: Email of the admin
 *                       contact_number:
 *                         type: string
 *                         description: Contact number of the admin
 *                 members:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Member ID
 *                       name:
 *                         type: string
 *                         description: Name of the member
 *                       joined_on:
 *                         type: string
 *                         format: date-time
 *                         description: Date the member joined the club
 *                 total_members:
 *                   type: integer
 *                   description: Total number of members in the club
 *                 active_members:
 *                   type: integer
 *                   description: Number of active members who joined in the last month
 *       404:
 *         description: Club not found
 *       500:
 *         description: Internal server error
 */
router.get('/:clubId/info', activityController.getClubInfo);

/**
 * @swagger
 * /api/activity/{locationId}/clubs:
 *   get:
 *     tags: [Club]
 *     summary: Get clubs by location ID
 *     description: Retrieve detailed information for clubs, including activity type, activity group, and club reputation by location ID.
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         description: The ID of the location to retrieve activities for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Activity information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 activity_id:
 *                   type: string
 *                   description: Activity ID
 *                 club_name:
 *                   type: string
 *                   description: Name of the club hosting the activity
 *                 reputation:
 *                   type: integer
 *                   description: Reputation score of the club
 *                 activityType:
 *                   type: string
 *                   description: Type of the activity
 *                 activityGroup:
 *                   type: string
 *                   description: Group the activity belongs to (e.g., sporty, cultural, adventure)
 *                 admins:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Admin ID
 *                       name:
 *                         type: string
 *                         description: Name of the admin
 *                       email:
 *                         type: string
 *                         description: Email of the admin
 *                       contact_number:
 *                         type: string
 *                         description: Contact number of the admin
 *                 members:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Member ID
 *                       name:
 *                         type: string
 *                         description: Name of the member
 *                       joined_on:
 *                         type: string
 *                         format: date-time
 *                         description: Date the member joined the club
 *                 total_members:
 *                   type: integer
 *                   description: Total number of members in the club
 *                 active_members:
 *                   type: integer
 *                   description: Number of active members who joined in the last month
 *       404:
 *         description: Activity not found
 *       500:
 *         description: Internal server error
 */
router.get('/:locationId/clubs', activityController.getClubsByLocation);

/**
 * @swagger
 * /api/activity/tags:
 *   get:
 *     tags: [Activity]
 *     summary: Get activity tags
 *     description: Retrieve detailed information for clubs, including activity type, activity group, and club reputation by location ID.
 *     parameters:
 *
 *     responses:
 *       200:
 *         description: Activity tags
 *         content:
 *           application/json:
 *             schema:
 *       404:
 *         description: Activity not found
 *       500:
 *         description: Internal server error
 */
router.get('/:locationId/clubs', activityController.getClubsByLocation);



module.exports = router;
