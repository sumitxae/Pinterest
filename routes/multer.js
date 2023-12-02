const {v4: uuidv4} = require('uuid');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/uploads')
    },
    filename: function (req, file, cb) {
        const uniqueFileName = uuidv4();
      cb(null, uniqueFileName + path.extname(file.originalname));
    }
  })
  
  function fileFilter (req, file, cb) {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Fuck You!'))
  }

  const upload = multer({ storage, fileFilter})
  module.exports = upload;