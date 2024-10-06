const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const db = require('../config/db.config');

/**
 * @swagger
 * tags:
 *   - name: Activity
 *     description: API for managing Activity
 */

/**
 * @swagger
 * /api/activity/{clubId}/upcoming-meetups:
 *   get:
 *     tags: [Activity]
 *     summary: Get upcoming meetups by club ID
 *     description: Retrieve a list of upcoming meetups for a specific club by its ID.
 *     security:
 *       - BearerAuth: []
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
router.get('/:clubId/upcoming', activityController.getUpcomingMeetups);

/**
 * @swagger
 * /api/activity/{activity_id}/join:
 *   get:
 *     summary: Join an activity by ID
 *     tags: [Activity]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: activity_id
 *         required: true
 *         description: The ID of the activity to join.
 *         schema:
 *           type: integer
 *           example: 5
 *       - in: query
 *         name: member_id
 *         required: true
 *         description: The ID of the member who is joining the activity.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully joined the activity
 *       400:
 *         description: Bad request if the activity ID or member ID is missing or invalid
 *       500:
 *         description: Error joining the activity
 */
router.get('/:activity_id/join', async (req, res) => {
    const { activity_id } = req.params;
    const {member_id } = req.body;
    db.query(`
        INSERT IGNORE INTO Activity_Member (member_id, activity_id)
        VALUES (?, ?);
        `, [member_id, activity_id], async (err) => {
        if(err) {
            return res.status(500).send('Error');
        }
        return  res.status(200).send('Joined Activity');
    });
});

/**
 * @swagger
 * /{activity_id}/leave:
 *   get:
 *     summary: Leave an activity by ID
 *     tags: [Activity]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: activity_id
 *         required: true
 *         description: The ID of the activity to leave.
 *         schema:
 *           type: integer
 *           example: 5
 *       - in: query
 *         name: member_id
 *         required: true
 *         description: The ID of the member who is leaving the activity.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully left the activity
 *       400:
 *         description: Bad request if the activity ID or member ID is missing or invalid
 *       500:
 *         description: Error leaving the activity
 */
router.get('/:activity_id/leave', async (req, res) => {
    const { activity_id } = req.params;
    const {member_id } = req.body;
    db.query(`
        DELETE FROM Activity_Member
        WHERE activity_id = ? AND member_id = ?;
        `, [activity_id, member_id], async (err) => {
        if(err) {
            return res.status(500).send('Error');
        }
        return  res.status(200).send('Joined Activity');
    });
});

/**
 * @swagger
 * /create:
 *   post:
 *     summary: Create a new activity
 *     tags: [Activity]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Yoga Class"
 *               location_id:
 *                 type: integer
 *                 example: 1
 *               club_id:
 *                 type: integer
 *                 example: 2
 *               description:
 *                 type: string
 *                 example: "A relaxing yoga class."
 *               start_datetime:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-10-07T10:00:00Z"
 *               end_datetime:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-10-07T12:00:00Z"
 *               total_seats:
 *                 type: integer
 *                 example: 20
 *               venue:
 *                 type: string
 *                 example: "Community Center"
 *               about:
 *                 type: string
 *                 example: "An engaging community yoga experience."
 *               fee:
 *                 type: number
 *                 format: float
 *                 example: 15.00
 *               is_paid:
 *                 type: boolean
 *                 example: true
 *               activity_photo_url:
 *                 type: string
 *                 example: "http://example.com/photo.jpg"
 *               venue_url:
 *                 type: string
 *                 example: "http://example.com/venue"
 *               member_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Successfully created the activity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Bad request if the input data is invalid
 *       500:
 *         description: Error creating the activity
 */
router.post('/create', async (req, res) => {
    let { name, location_id, club_id, description, start_datetime, end_datetime, total_seats, venue, about, fee, is_paid, activity_photo_url, venue_url, member_id } = req.body;
    db.query(`
        START TRANSTACTION;
        INSERT INTO activities (
            name, 
            location_id, 
            club_id, 
            description, 
            start_datetime, 
            end_datetime, 
            total_seats, 
            venue, 
            about, 
            fee, 
            is_paid, 
            activity_photo_url, 
            venue_url
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        );
        SELECT LAST_INSERT_ID() AS id;
        COMMIT;
            `,
    [name, location_id, activity_tag_id, club_id, description, start_datetime, end_datetime, total_seats, venue, about, fee, is_paid, activity_photo_url, venue_url],
        async (err, result) => {
            if(err) {
                return res.status(500).send('Error creating activity');
            }
            return res.status(200).send({id: result.id});
        });
});

/**
 * @swagger
 * /{activity_id}/update:
 *   post:
 *     summary: Update an existing activity by ID
 *     tags: [Activity]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: activity_id
 *         required: true
 *         description: The ID of the activity to update.
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Yoga Class"
 *               location_id:
 *                 type: integer
 *                 example: 2
 *               description:
 *                 type: string
 *                 example: "An updated description for the yoga class."
 *               start_datetime:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-10-08T10:00:00Z"
 *               end_datetime:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-10-08T12:00:00Z"
 *               total_seats:
 *                 type: integer
 *                 example: 25
 *               venue:
 *                 type: string
 *                 example: "Community Center"
 *               about:
 *                 type: string
 *                 example: "Join us for an updated yoga experience."
 *               activity_photo_url:
 *                 type: string
 *                 example: "http://example.com/updated_photo.jpg"
 *               venue_url:
 *                 type: string
 *                 example: "http://example.com/updated_venue"
 *     responses:
 *       200:
 *         description: Successfully updated the activity
 *       400:
 *         description: Bad request if the input data is invalid
 *       500:
 *         description: Error updating the activity
 */
router.post('/:activity_id/update', async (req, res) => {
    const { activity_id } = req.params;
    let { name, location_id, description, start_datetime, end_datetime, total_seats, venue, about, activity_photo_url, venue_url, member_id } = req.body;

    db.query(`
    UPDATE Activity
            SET
                name = COALESCE(@name, ?),
                location_id = COALESCE(@location_id, ?),
                description = COALESCE(@description, ?),
                start_datetime = COALESCE(@start_datetime, ?),
                end_datetime = COALESCE(@end_datetime, ?),
                total_seats = COALESCE(@total_seats, ?),
                venue = COALESCE(@venue, ?),
                about = COALESCE(@about, ?),
                activity_photo_url = COALESCE(@activity_photo_url, ?),
                venue_url = COALESCE(@venue_url, ?)
            WHERE id = ?;
    `,[name, location_id, description, start_datetime, end_datetime, total_seats, venue, about, activity_photo_url, venue_url, activity_id], async (err) => {
        if(err) {
            return res.status(500).send('Error updating activity');
        }
        return res.status(200).send('Updated');
    });
});

/**
 * @swagger
 * /{activity_id}/cancel:
 *   get:
 *     summary: Cancel an activity by ID
 *     tags: [Activity]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: activity_id
 *         required: true
 *         description: The ID of the activity to cancel.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully cancelled the activity
 *       400:
 *         description: Bad request if the input data is invalid
 *       500:
 *         description: Error cancelling the activity
 */
router.get('/:activity_id/cancel', async (req, res) => {
   const { activity_id }  = req.params;
   db.query(
       `
       UPDATE activity
        SET is_cancelled = false
        WHERE activity_id = ?;
       `
   [activity_id], (err) => {
           if(err) {
               return res.status(500).send('Error cancelling activity');
           }
           return res.status(200).send('Cancelled');
       });
});

module.exports = router;