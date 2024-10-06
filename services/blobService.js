const { Storage } = require('@google-cloud/storage');
const path = require('path');
const format = require('util').format;

const bucketName = process.env.GCLOUD_STORAGE_BUCKET;
const storage = new Storage({
  keyFilename: path.join(__dirname, process.env.GCLOUD_KEY_FILE),
  projectId: process.env.GCLOUD_PROJECT_ID,
});
const bucket = storage.bucket(bucketName);


const uploadImage = (file) => new Promise((resolve, reject) => {
  const fileBuffer = file.buffer;
  const fileName = file.originalname.replace(/ /g, "_"); 
  const blob = bucket.file(fileName);
  
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  blobStream.on('finish', () => {
    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    );
    resolve(publicUrl);
  });

  blobStream.on('error', (err) => {
    reject(`Unable to upload image, something went wrong: ${err.message}`);
  });

  blobStream.end(fileBuffer);
});

module.exports = { uploadImage };
