import express from 'express';
import blogController from '../controllers/blogController.js';
import multer from 'multer';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/add', protect, upload.single('image'), blogController.    createBlog);
router.get('/', blogController.getBlogs);
router.get('/:id', blogController.getBlogById);
router.put('/:id', protect, upload.single('image'), blogController.updateBlog);
router.delete('/:id', protect, blogController.deleteBlog);

export default router;

