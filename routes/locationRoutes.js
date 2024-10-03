const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController.js');

/**
 * @swagger
 * tags:
 *   - name: Location
 *     description: API for managing location
 */

/**
 * @swagger
 * /api/location/all:
 *   get:
  *     tags: [Location] 
 *     summary: Get All locations
 *     description: Retrieve all location information.
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
router.get('/all', locationController.getAllLocation);

module.exports = router;
