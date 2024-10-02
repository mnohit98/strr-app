const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: API for managing activities
 */


/**
 * @swagger
 * /api/user/admin/{adminId}:
 *   get:
  *     tags: [User] 
 *     summary: Get admin details
 *     description: Retrieve the details of an admin by their ID.
 *     parameters:
 *       - in: path
 *         name: adminId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the admin.
 *     responses:
 *       200:
 *         description: Admin details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */
router.get('/admin/:adminId', userController.getAdminDetails);

/**
 * @swagger
 * /api/user/member/{memberId}:
 *   get:
   *     tags: [User] 
 *     summary: Get member details
 *     description: Retrieve the details of a member by their ID.
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the member.
 *     responses:
 *       200:
 *         description: Member details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: Member not found
 *       500:
 *         description: Internal server error
 */
router.get('/member/:memberId', userController.getMemberDetails);

module.exports = router;
