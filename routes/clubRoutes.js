const express = require('express');
const activityController = require("../controllers/activityController.js");
const router = express.Router();
const db = require('../config/db.config');

/**
 * @swagger
 * tags:
 *   - name: Club
 *     description: API for managing Clubs
 */

/**
 * @swagger
 * /api/club/create:
 *   post:
 *     summary: Create a new club
 *     tags: [Club]
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
 *                 description: The name of the club.
 *                 example: "Yoga Club"
 *               faqs:
 *                 type: array
 *                 description: Frequently asked questions for the club.
 *                 items:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: string
 *                       description: The question being asked.
 *                       example: "What should I bring?"
 *                     answer:
 *                       type: string
 *                       description: The answer to the question.
 *                       example: "You should bring your own equipment."
 *               activity_tag_id:
 *                 type: integer
 *                 description: The ID of the activity tag associated with the club.
 *                 example: 1
 *               meetup_info:
 *                 type: array
 *                 description: Information about meetups for the club.
 *                 items:
 *                   type: object
 *                   properties:
 *                     meetup_dp:
 *                       type: string
 *                       format: uri
 *                       description: URL for the meetup display picture.
 *                       example: "http://example.com/dp1"
 *                     meetup_days:
 *                       type: array
 *                       items:
 *                          type: integer
 *                       description: String representation of the days the meetup occurs (e.g., "[6]" for Saturday).
 *                       example: [6, 5]
 *                     meetup_place:
 *                       type: string
 *                       description: The location of the meetup.
 *                       example: "Cricket Ground"
 *                     meetup_timing:
 *                       type: object
 *                       description: Timing information for the meetup.
 *                       properties:
 *                         startTime:
 *                           type: object
 *                           properties:
 *                             hours:
 *                               type: integer
 *                               description: Hour of the start time.
 *                               example: 10
 *                             minutes:
 *                               type: integer
 *                               description: Minutes of the start time.
 *                               example: 0
 *                         endTime:
 *                           type: object
 *                           properties:
 *                             hours:
 *                               type: integer
 *                               description: Hour of the end time.
 *                               example: 12
 *                             minutes:
 *                               type: integer
 *                               description: Minutes of the end time.
 *                               example: 0
 *                     meetup_location_url:
 *                       type: string
 *                       format: uri
 *                       description: URL for the meetup location.
 *                       example: "http://example.com/location1"
 *               about:
 *                 type: string
 *                 description: About the club.
 *                 example: "A club for yoga enthusiasts"
 *               location_id:
 *                 type: integer
 *                 description: The ID of the location for the club.
 *                 example: 2
 *               dp_url:
 *                 type: string
 *                 description: URL for the club's display picture.
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       200:
 *         description: Successfully created club
 *       400:
 *         description: Name and member_id are required
 *       500:
 *         description: Error creating club
 */
router.post('/create', async (req, res) => {
    let { name, faqs, activity_tag_id, meetup_info, about, location_id, dp_url } = req.body;
    let member_id = req.member_id;

    try {
        // Start the transaction
        await db.promise().query('START TRANSACTION');

        // First, insert into the club table
        const [insertResult] = await db.promise().query(
            `INSERT INTO club (name, admin_ids, faqs, dp_url, activity_tag_id, meetup_info, about, location_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, JSON.stringify([member_id]), JSON.stringify(faqs), dp_url, activity_tag_id, JSON.stringify(meetup_info), about, location_id]
        );

        const last_inserted_id = insertResult.insertId;

        // Then, update the member table using the inserted club ID
        await db.promise().query(
            `UPDATE member
             SET meta = JSON_MERGE_PATCH(meta, JSON_OBJECT('admin', JSON_OBJECT('club_ids', JSON_ARRAY(?))))
             WHERE id = ?`,
            [last_inserted_id, member_id]
        );

        // Commit the transaction if everything went well
        await db.promise().query('COMMIT');

        // Return the last inserted club ID
        return res.status(200).send({ id: last_inserted_id });

    } catch (err) {
        // Rollback transaction in case of an error
        await db.promise().query('ROLLBACK');
        return res.status(500).send('Error processing request');
    }

});

/**
 * @swagger
 * /api/club/{club_id}/approve:
 *   get:
 *     summary: Approve a club by ID
 *     tags: [Club]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: club_id
 *         required: true
 *         description: The ID of the club to be approved.
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Successfully activated and approved the club
 *       400:
 *         description: Bad request if the club ID is missing or invalid
 *       500:
 *         description: Error approving the club
 */
router.get('/:club_id/approve', async (req, res) => {
    let {club_id} = req.params;
    db.query(`UPDATE Club SET is_approved = true, is_active = true WHERE id = ?;`,
        [club_id], async (err) => {
            if(err) {
                return res.status(500).send('Error');
            }
            return  res.status(200).send('Activated and approved club');
        })
});

/**
 * @swagger
 * /api/club/{club_id}/update:
 *   post:
 *     summary: Update a club by ID
 *     tags: [Club]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: club_id
 *         required: true
 *         description: The ID of the club to be updated.
 *         schema:
 *           type: integer
 *           example: 10
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the club.
 *                 example: "Updated Yoga Club"
 *               faqs:
 *                 type: array
 *                 description: Updated frequently asked questions for the club.
 *                 items:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: string
 *                       description: The question being asked.
 *                       example: "What should I wear?"
 *                     answer:
 *                       type: string
 *                       description: The answer to the question.
 *                       example: "You should wear comfortable clothing."
 *               activity_tag_id:
 *                 type: integer
 *                 description: The new ID of the activity tag associated with the club.
 *                 example: 2
 *               meetup_info:
 *                 type: array
 *                 description: Updated information about meetups for the club.
 *                 items:
 *                   type: object
 *                   properties:
 *                     meetup_dp:
 *                       type: string
 *                       format: uri
 *                       description: URL for the meetup display picture.
 *                       example: "http://example.com/new_dp.jpg"
 *                     meetup_days:
 *                       type: string
 *                       description: String representation of the days the meetup occurs (e.g., "[6]" for Sunday).
 *                       example: "[6]"
 *                     meetup_place:
 *                       type: string
 *                       description: The location of the meetup.
 *                       example: "Yoga Studio"
 *                     meetup_timing:
 *                       type: object
 *                       description: Timing information for the meetup.
 *                       properties:
 *                         startTime:
 *                           type: object
 *                           properties:
 *                             hours:
 *                               type: integer
 *                               description: Hour of the start time.
 *                               example: 10
 *                             minutes:
 *                               type: integer
 *                               description: Minutes of the start time.
 *                               example: 0
 *                         endTime:
 *                           type: object
 *                           properties:
 *                             hours:
 *                               type: integer
 *                               description: Hour of the end time.
 *                               example: 12
 *                             minutes:
 *                               type: integer
 *                               description: Minutes of the end time.
 *                               example: 0
 *                     meetup_location_url:
 *                       type: string
 *                       format: uri
 *                       description: URL for the meetup location.
 *                       example: "http://example.com/new_location"
 *               about:
 *                 type: string
 *                 description: Updated about section for the club.
 *                 example: "A club for experienced yoga practitioners"
 *               location_id:
 *                 type: integer
 *                 description: The new ID of the location for the club.
 *                 example: 3
 *               dp_url:
 *                 type: string
 *                 description: Updated URL for the club's display picture.
 *                 example: "https://example.com/new_image.jpg"
 *     responses:
 *       200:
 *         description: Successfully updated the club
 *       400:
 *         description: Bad request if the club ID is missing or invalid
 *       500:
 *         description: Error updating the club
 */
router.post('/:club_id/update', async (req, res) => {
    let { name, faqs, activity_tag_id, meetup_info, about, location_id, dp_url } = req.body;
    let { club_id } = req.params;
    db.query(`
            UPDATE Club
            SET
                name = COALESCE(@name, ?),
                faqs = COALESCE(@faqs, ?),
                dp_url = COALESCE(@dp_url, ?),
                activity_tag_id = COALESCE(@activity_tag_id, ?),
                meetup_info = COALESCE(@meetup_info, ?),
                about = COALESCE(@about, ?),
                location_id = COALESCE(@location_id, ?)
            WHERE id = ?;

        `,
        [name, JSON.stringify(faqs), dp_url, activity_tag_id, JSON.stringify(meetup_info), about, location_id, club_id],
        (err) => {
            if(err) {
                return res.status(500).send('Error updating club');
            }
            return  res.status(200).send('Successfully updated club');
        });
});

/**
 * @swagger
 * /api/club/{club_id}/deactivate:
 *   get:
 *     summary: Deactivate a club by ID
 *     tags: [Club]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: club_id
 *         required: true
 *         description: The ID of the club to be deactivated.
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Successfully deactivated the club
 *       400:
 *         description: Bad request if the club ID is missing or invalid
 *       500:
 *         description: Error deactivating the club
 */
router.get('/:club_id/deactivate', async (req, res) => {
   let { club_id } = req.params;
   db.query(`
   UPDATE club
   SET is_active = false
   WHERE id = ?;
   `, [club_id], (err) => {
       if(err) {
           return res.status(500).send('Error deactivating club');
       }
       return res.status(200).send('Deactivated club');
   });
});

/**
 * @swagger
 * /api/club/{locationId}/clubs:
 *   get:
 *     tags: [Club]
 *     summary: Get clubs by location ID
 *     description: Retrieve detailed information for clubs, including activity type, activity group, and club reputation by location ID.
 *     security:
 *       - BearerAuth: []
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
 * /api/club/{clubId}/info:
 *   get:
 *     tags: [Club]
 *     summary: Get club information by club ID
 *     description: Retrieve detailed club information, including admins, members, and reputation by the club ID.
 *     security:
 *       - BearerAuth: []
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
 * /api/club/{club_id}/join:
 *   get:
 *     summary: Join a club
 *     description: Allows a member to join a specified club by adding them to the Club_Member table and updating the member count in the Club table.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: club_id
 *         in: path
 *         required: true
 *         description: The ID of the club to join.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully joined the club.
 *       500:
 *         description: Error joining the club.
 *     tags: [Club]
 */
router.get('/:club_id/join', async (req, res) => {
    let { club_id } = req.params;
    club_id = parseInt(club_id);
    const member_id = req.member_id;
    try {
        // Start a transaction
        await db.promise().query('START TRANSACTION');

        // First query: Insert the member
        await db.promise().query(`
      INSERT INTO Club_Member (member_id, club_id)
      VALUES (?, ?);
    `, [member_id, club_id]);

        // Second query: Update the club member count
        await db.promise().query(`
      UPDATE Club
      SET m_count = m_count + 1
      WHERE id = ?;
    `, [club_id]);

    await db.promise().query('COMMIT');

    return res.status(200).send({ message: "Successfully joined the club" });

    } catch (err) {
        // Rollback the transaction in case of an error
        await db.promise().query('ROLLBACK');
        return res.status(500).send({ error: "Error adding member to club" });
    }
});

/**
 * @swagger
 * /api/club/{club_id}/leave:
 *   get:
 *     summary: Leave a club
 *     description: Allows a member to leave a specified club by removing them from the Club_Member table and updating the member count in the Club table.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: club_id
 *         in: path
 *         required: true
 *         description: The ID of the club to leave.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully left the club.
 *       404:
 *         description: Record does not exist (the member is not part of the club).
 *       500:
 *         description: Error processing request.
 *     tags: [Club]
 */
router.get('/:club_id/leave', async (req, res) => {
    let { club_id } = req.params;
    club_id = parseInt(club_id);
    const member_id = req.member_id;
    try {
        // Check if the record exists
        const [results] = await db.promise().query(`
            SELECT * FROM Club_Member
            WHERE club_id = ? AND member_id = ?;
        `, [club_id, member_id]);

        // If the record does not exist
        if (results.length === 0) {
            return res.status(404).send('Record does not exist');
        }

        // Proceed to delete the record
        await db.promise().query(`
            DELETE FROM Club_Member
            WHERE club_id = ? AND member_id = ?;
            UPDATE Club
                SET m_count = m_count - 1
            WHERE id = ?;
        `, [club_id, member_id, club_id]);

        return res.status(200).send('Successfully left the club');
    } catch (err) {
        return res.status(500).send('Error processing request');
    }
});


/**
 * @swagger
 * /api/club/{club_id}/add-admin:
 *   post:
 *     summary: Add a member to the club's admin list if the member is not already present
 *     tags: [Club]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: club_id
 *         required: true
 *         description: The ID of the club to update.
 *         schema:
 *           type: integer
 *           example: 11
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               member_id:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Successfully added the member to the club's admin list if not already present
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *       400:
 *         description: Bad request, missing or invalid parameters
 *       500:
 *         description: Server error when updating the club
 */
router.post('/:club_id/add-admin', async (req, res) => {
    const { member_id } = req.body;
    let { club_id } = req.params;
    club_id = parseInt(club_id);
    try {
        await db.promise().query(`UPDATE club
            SET admin_ids = JSON_ARRAY_APPEND(admin_ids, '$', ?)
            WHERE id = ?
            AND NOT JSON_CONTAINS(admin_ids, CAST(? AS JSON), '$')`, [member_id, club_id, member_id]);
        return res.status(200).json({'message': 'Success'});
    } catch (err) {
        return res.status(500).json({'message': 'Error'});
    }
});

/**
 * @swagger
 * /api/club/{club_id}/remove-admin:
 *   post:
 *     summary: Remove a member from the club's admin list
 *     tags: [Club]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: club_id
 *         required: true
 *         description: The ID of the club from which to remove the admin.
 *         schema:
 *           type: integer
 *           example: 11
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               member_id:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Successfully removed the member from the club's admin list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *       400:
 *         description: Bad request, missing or invalid parameters
 *       500:
 *         description: Server error when removing the member from the club
 */
router.post('/:club_id/remove-admin', async (req, res) => {
    const { member_id } = req.body;
    let { club_id } = req.params;
    club_id = parseInt(club_id);


    try {
        let [result] = await db.promise().query(
            `select admin_ids from club where id = ?`, [club_id]
        );
        if(!(result && result.length > 0)) {
            throw new Error();
        }
        let admin_ids = result[0].admin_ids;
        const member_index = admin_ids.indexOf(member_id);
        if(member_index == -1) {
            throw new Error('Already removed');
        } else if(member_index == 0) {
            throw new Error('Cannot remove');
        } else {
            admin_ids = [...admin_ids.slice(0, member_index), ...admin_ids.slice(member_index+1)];
            await db.promise().query(`
             update club set admin_ids = ? where id = ?;
            `, [JSON.stringify(admin_ids), club_id]);
        }
        return res.status(200).json({'message': 'Success'});
    } catch (err) {
        return res.status(500).json({'message': 'Error'});
    }
});

/**
 * @swagger
 * /api/club/activity-tags:
 *   get:
 *     tags: [Club]
 *     summary: Get all activity tags
 *     security:
 *       - BearerAuth: []
 *     description: Retrieve tag info.
 *     responses:
 *       200:
 *         description: Activity information
 *       404:
 *         description: Activity not found
 *       500:
 *         description: Internal server error
 */
router.get('/activity-tags', activityController.getActivityTags);

module.exports = router;