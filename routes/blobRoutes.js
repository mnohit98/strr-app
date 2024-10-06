const express = require('express');
const multer = require('multer');
const { uploadFile } = require('../controllers/blobController');

const router = express.Router();
const multerMid = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    })


/**
 * @swagger
 * /api/blob/image/uploads:
 *   post:
 *     tags: [BLOB]
 *     summary: Upload an image to blob storage
 *     description: Upload an image file to blob storage.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image upload successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: string
 *                   description: URL of the uploaded image
 *       500:
 *         description: Internal server error
 */
router.post('/image/uploads', multerMid.single('file'), uploadFile);

module.exports = router;