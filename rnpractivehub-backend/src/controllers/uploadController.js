/* eslint-disable no-unused-vars */

const path = require("path");
const uploadAudio = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('FILE:', req.file);

    const folderName = path.basename(req.file.destination);
    const fileUrl = `${req.protocol}://${req.get(
      'host',
    )}/uploads/${folderName}/${req.file.filename}`;
    res.status(200).json({
      success: true,
      url: fileUrl,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      size: req.file.size,
    });
  } catch (err) {
    console.log('UPLOAD ERROR:', err);
    res.status(500).json({ message: 'Upload failed' });
  }
};

module.exports = { uploadAudio };
