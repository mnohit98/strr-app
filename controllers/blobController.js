const { uploadImage } = require('../services/blobService.js');

const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const imageUrl = await uploadImage(req.file);

    res.status(200).json({
      message: "Upload was successful",
      data: imageUrl,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: 'Internal server error!',
    });
    next(error);
  }
};

module.exports = { uploadFile };
