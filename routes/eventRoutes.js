import express from 'express';
import eventController from '../controllers/eventController.js';
import multer from 'multer';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.post('/create', protect, upload.single('image'), eventController.createEvent);
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);
router.put('/:id', protect, upload.single('image'), eventController.updateEvent);
router.delete('/:id', protect, eventController.deleteEvent);

export default router;