// middleware/multer.js
import multer from "multer";
import path from "path"; // ✅ Import path

// Configure Multer to store files in ./public
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public"); // save directly in public folder
  },
  filename: (req, file, cb) => {
    // Generate unique filename using path.extname
    const ext = path.extname(file.originalname);
    const name = file.fieldname + "-" + Date.now() + ext;
    cb(null, name);
  },
});

const upload = multer({ storage });

export default upload;
