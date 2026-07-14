const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = path.join(__dirname, "../uploads/others");

    if (file.mimetype.startsWith("image/")) {
      uploadPath = path.join(__dirname, "../uploads/images");
    } else if (file.mimetype.startsWith("video/")) {
      uploadPath = path.join(__dirname, "../uploads/videos");
    } else if (file.mimetype.startsWith("audio/")) {
      uploadPath = path.join(__dirname, "../uploads/audio");
    } else {
      uploadPath = path.join(__dirname, "../uploads/docs");
    }

    // Folder exist na ho to create kar do
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB
  },
});

module.exports = upload;