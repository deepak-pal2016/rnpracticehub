/* eslint-disable no-unused-vars */
const uploadAudio = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('FILE:', req.file);

   const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({
      success: true,
      url: fileUrl,
    });
  } catch (err) {
    console.log('UPLOAD ERROR:', err);
    res.status(500).json({ message: 'Upload failed' });
  }
};

module.exports = { uploadAudio };
