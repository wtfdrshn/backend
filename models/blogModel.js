import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
    },
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    imageUrl: {
        type: String,
        required: [true, 'Please add an image']
    },
    content: {
        type: String,
        required: [true, 'Please add some content']
    },
    date: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true
}    
);

export default mongoose.model('Blog', blogSchema);