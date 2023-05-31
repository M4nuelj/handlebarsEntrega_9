const path = require('path');
const { fileURLToPath } = require('url');
const multer = require('multer');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

module.exports = __dirname;
module.exports.uploader = multer({ storage });