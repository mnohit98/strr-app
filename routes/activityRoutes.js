const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController.js');

/**
 * @swagger
 * tags:
 *   - name: Activity
 *     description: API for managing activities
 */


/**
 * @swagger
 * /api/activity/{locationId}:
 *   get:
*     tags: [Activity] 
 *     summary: Get activities by location
 *     description: Retrieve a list of activities available at a given location.
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         description: The ID of the location to get activities for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of activities for the specified location
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Activity ID
 *                   name:
 *                     type: string
 *                     description: Activity name
 *                   description:
 *                     type: string
 *                     description: Details of the activity
 *       404:
 *         description: Location not found
 *       500:
 *         description: Internal server error
 */
router.get('/:locationId', activityController.getActivitiesByLocation);

/**
 * @swagger
 * /api/activity/details/{activityId}:
 *   get:
*     tags: [Activity]
 *     summary: Get activity details
 *     description: Retrieve the details of a specific activity by its ID.
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         description: The ID of the activity to retrieve details for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Activity details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Activity ID
 *                 name:
 *                   type: string
 *                   description: Activity name
 *                 description:
 *                   type: string
 *                   description: Full details of the activity
 *                 location:
 *                   type: string
 *                   description: Location of the activity
 *                 time:
 *                   type: string
 *                   description: Time of the activity
 *       404:
 *         description: Activity not found
 *       500:
 *         description: Internal server error
 */
router.get('/details/:activityId', activityController.getActivityDetails);

module.exports = router;


module.exports = router;
