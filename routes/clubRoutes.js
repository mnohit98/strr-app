const express = require('express');
const activityController = require("../controllers/activityController.js");
const router = express.Router();
const db = require('../../config/db.config');
const validator = require('validator');

/**
 * @swagger
 * tags:
 *   - name: Club
 *     description: API for managing Clubs
 */

/**
 * @swagger
 * /api/club/create-club:
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
 *                 type: string
 *                 description: Frequently asked questions for the club.
 *                 example: "What should I bring?"
 *               activity_tag_id:
 *                 type: integer
 *                 description: The ID of the activity tag associated with the club.
 *                 example: 1
 *               meetup_info:
 *                 type: string
 *                 description: Information about meetups for the club.
 *                 example: "Weekly meetings every Saturday"
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
 *               member_id:
 *                 type: integer
 *                 description: The ID of the member creating the club.
 *                 example: 5
 *     responses:
 *       200:
 *         description: Successfully created club
 *       400:
 *         description: Name and member_id are required
 *       500:
 *         description: Error creating club
 */
router.post('/create-club', async (req, res) => {
    let { name, faqs, activity_tag_id, meetup_info, about, location_id, dp_url, member_id } = req.body;
    db.query(`
            START TRANSACTION;
            INSERT INTO club (name, admin_ids, faqs, dp_url, activity_tag_id, meetup_info, about, location_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            SET @last_inserted_id = LAST_INSERT_ID();
            UPDATE member
            SET meta = JSON_MERGE_PATCH(meta, JSON_OBJECT('admin', JSON_OBJECT('club_ids', JSON_ARRAY(?))))
            WHERE id = @last_inserted_id;
            COMMIT;
        `,
        [name, [member_id], faqs, dp_url, activity_tag_id, meetup_info, about, location_id, member_id],
        (err) => {
            if(err) {
                return res.status(500).send('Error creating club');
            }
            return  res.status(200).send('Successfully created club');
        });
});

/**
 * @swagger
 * /api/club/{club_id}/approve-club:
 *   get:
 *     summary: Approve a club by ID
 *     tags: [Club]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clubId
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
router.get('/:club_id/approve-club', async (req, res) => {
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
 * /api/club/{club_id}/update-club:
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
 *                 type: string
 *                 description: Updated frequently asked questions for the club.
 *                 example: "What should I wear?"
 *               activity_tag_id:
 *                 type: integer
 *                 description: The new ID of the activity tag associated with the club.
 *                 example: 2
 *               meetup_info:
 *                 type: string
 *                 description: Updated information about meetups for the club.
 *                 example: "Weekly meetings every Sunday"
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
router.post('/:club_id/update-club', async (req, res) => {
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
        [name, faqs, dp_url, activity_tag_id, meetup_info, about, location_id, is_active, club_id],
        (err) => {
            if(err) {
                return res.status(500).send('Error updating club');
            }
            return  res.status(200).send('Successfully updated club');
        });
});

/**
 * @swagger
 * /{club_id}/deactivate:
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
   WHERE club_id = ?;
   `, [club_id], (err) => {
       if(err) {
           return res.status(500).send('Error deactivating club');
       }
       return res.status(200).send('Cancelled');
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