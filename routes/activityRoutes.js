const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const db = require('../config/db.config');
const { jsTimestampToMysqlUTC } = require('../utils/common');
/**
 * @swagger
 * tags:
 *   - name: Activity
 *     description: API for managing Activity
 */

/**
 * @swagger
 * /api/activity/{clubId}/upcoming:
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
 * /api/activity/{club_id}/all:
 *   get:
 *     summary: Get all activities for a specific club
 *     tags: [Activity]
 *     parameters:
 *       - in: path
 *         name: club_id
 *         required: true
 *         description: The ID of the club to retrieve activities for.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved all activities for the club
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The ID of the activity.
 *                         example: 1
 *
 */
router.get('/:club_id/all', async (req, res) => {
    let { club_id } = req.params;
    club_id = parseInt(club_id);
    try {
        const [results] = await db.promise().query(`
        select * from activity where club_id = ?;
        `, [club_id]);
        return res.status(200).send({results});
    } catch (err) {
        return res.status(500).send({message: 'Error'});
    }
});

/**
 * @swagger
 * /api/activity/{activity_id}/info:
 *   get:
 *     summary: Get activity information by ID
 *     tags: [Activity]
 *     parameters:
 *       - in: path
 *         name: activity_id
 *         required: true
 *         description: The ID of the activity to retrieve information for.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved activity information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the activity.
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: The name of the activity.
 *                   example: "Yoga Class"
 *                 location_id:
 *                   type: integer
 *                   description: The ID of the location associated with the activity.
 *                   example: 2
 *                 club_id:
 *                   type: integer
 *                   description: The ID of the club associated with the activity.
 *                   example: 11
 *                 description:
 *                   type: string
 *                   description: A description of the activity.
 *                   example: "A relaxing yoga class."
 *                 start_datetime:
 *                   type: string
 *                   format: date-time
 *                   description: The start date and time of the activity.
 *                   example: "2024-10-07T10:00:00Z"
 *                 end_datetime:
 *                   type: string
 *                   format: date-time
 *                   description: The end date and time of the activity.
 *                   example: "2024-10-07T12:00:00Z"
 *                 total_seats:
 *                   type: integer
 *                   description: The total number of seats available for the activity.
 *                   example: 20
 *                 venue:
 *                   type: string
 *                   description: The venue of the activity.
 *                   example: "Community Center"
 *                 about:
 *                   type: string
 *                   description: Additional information about the activity.
 *                   example: "An engaging community yoga experience."
 *                 fee:
 *                   type: integer
 *                   description: The fee for participating in the activity.
 *                   example: 15
 *                 payment_type:
 *                   type: integer
 *                   description: The type of payment accepted (e.g., cash, online).
 *                   example: 1
 *                 activity_photo_url:
 *                   type: string
 *                   description: URL for the activity's photo.
 *                   example: "http://example.com/photo.jpg"
 *                 venue_url:
 *                   type: string
 *                   description: URL for the venue's information.
 *                   example: "http://example.com/venue"
 *       404:
 *         description: Activity not found
 *       500:
 *         description: Error retrieving activity information
 */
router.get('/:activity_id/info', async (req, res) => {
    let { activity_id } = req.params;
    activity_id = parseInt(activity_id);
    try {
        const [results] = await db.promise().query(`
        select * from activity where id = ?;
        `, [activity_id]);
        return res.status(200).send({...results[0]});
    } catch (err) {
        return res.status(500).send({message: 'Error'});
    }
});

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
    const member_id = req.member_id;
    try {
        // Execute both the insert and update in a single query
        await db.promise().query(`
            INSERT INTO Activity_Member (member_id, activity_id)
            VALUES (?, ?);
            
            UPDATE Activity
            SET filled_seats = filled_seats + 1
            WHERE id = ?;
        `, [member_id, activity_id, activity_id]);

        return res.status(200).send('Joined Activity');
    } catch (err) {
        return res.status(500).send('Error joining activity');
    }
});

/**
 * @swagger
 * /api/activity/{activity_id}/leave:
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
    const member_id = req.member_id;
    try {
        // Check if the record exists
        const [results] = await db.promise().query(`
            SELECT * FROM Activity_Member
            WHERE activity_id = ? AND member_id = ?;
        `, [activity_id, member_id]);

        // If the record does not exist
        if (results.length === 0) {
            return res.status(404).send('Record does not exist');
        }

        // Proceed to delete the record
        await db.promise().query(`
            DELETE FROM Activity_Member
            WHERE activity_id = ? AND member_id = ?;
            UPDATE Activity
                SET filled_seats = filled_seats - 1
            WHERE id = ?;
        `, [activity_id, member_id, activity_id]);

        return res.status(200).send('Successfully left the activity');
    } catch (err) {
        return res.status(500).send('Error processing request');
    }
});

/**
 * @swagger
 * /api/activity/create:
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
 *               payment_type:
 *                 type: int
 *                 example: 1
 *               activity_photo_url:
 *                 type: string
 *                 example: "http://example.com/photo.jpg"
 *               venue_url:
 *                 type: string
 *                 example: "http://example.com/venue"
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
    let { name, location_id, club_id, description, start_datetime, end_datetime, total_seats, venue, about, fee, payment_type, activity_photo_url, venue_url } = req.body;
    start_datetime = jsTimestampToMysqlUTC(start_datetime);
    end_datetime = jsTimestampToMysqlUTC(end_datetime);
    const connection = db.promise(); // Create a promise connection

    try {
        const [insertResult] = await connection.query(`
            INSERT INTO activity (
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
                payment_type, 
                activity_photo_url, 
                venue_url
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `, [name, location_id, club_id, description, start_datetime, end_datetime, total_seats, venue, about, fee, payment_type, activity_photo_url, venue_url]);

        const insertedId = insertResult.insertId;

        return res.status(200).send({ id: insertedId });

    } catch (error) {
        console.error('Error creating activity:', error);
        return res.status(500).send('Error creating activity');
    }
});

/**
 * @swagger
 * /api/activity/{activity_id}/update:
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
    let { name, location_id, description, start_datetime, end_datetime, total_seats, venue, about, activity_photo_url, venue_url } = req.body;
    start_datetime = jsTimestampToMysqlUTC(start_datetime);
    end_datetime = jsTimestampToMysqlUTC(end_datetime);
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
 * /api/activity/{activity_id}/cancel:
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
   let { activity_id }  = req.params;
   activity_id = parseInt(activity_id);
   db.query(
       `UPDATE activity
        SET is_cancelled = 1
        WHERE id = ?;`,
   [activity_id], (err) => {
           if(err) {
               return res.status(500).send('Error cancelling activity');
           }
           return res.status(200).send('Cancelled');
       });
});

module.exports = router;