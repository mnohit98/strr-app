const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController.js');

/**
 * @swagger
 * tags:
 *   - name: Location
 *     description: API for managing activities
 */


/**
 * @swagger
 * /api/location/add:
 *   post:
 *     tags: [Location] 
 *     summary: Add a new location
 *     description: Add a new location with details like name, area code, and coordinates.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the location
 *               area_code:
 *                 type: string
 *                 description: Area code of the location
 *               latitude:
 *                 type: number
 *                 description: Latitude of the location
 *               longitude:
 *                 type: number
 *                 description: Longitude of the location
 *     responses:
 *       201:
 *         description: Location successfully created
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post('/add', locationController.addLocation);

/**
 * @swagger
 * /location/{latitude}/{longitude}:
 *   get:
  *     tags: [Location] 
 *     summary: Get location by coordinates
 *     description: Retrieve the location information based on the given latitude and longitude.
 *     parameters:
 *       - in: path
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitude of the location.
 *       - in: path
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitude of the location.
 *     responses:
 *       200:
 *         description: Location details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 state:
 *                   type: string
 *                 area_code:
 *                   type: string
 *       404:
 *         description: Location not found
 *       500:
 *         description: Internal server error
 */
router.get('/:latitude/:longitude', locationController.getLocationByCoords);

/**
 * @swagger
 * /api/location/{locationId}/tags:
 *   get:
 *     tags: [Location] 
 *     summary: Get activity tags by location
 *     description: Retrieve activity tags for a specific location.
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the location.
 *     responses:
 *       200:
 *         description: List of activity tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   tag_id:
 *                     type: string
 *                   tag_name:
 *                     type: string
 *       404:
 *         description: Location or tags not found
 *       500:
 *         description: Internal server error
 */
router.get('/:locationId/tags', locationController.getActivityTagsByLocation);

module.exports = router;
