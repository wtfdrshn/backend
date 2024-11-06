import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ticketType: {
        type: String,
        required: true,
        enum: ['free', 'paid']
    },
    seatNumber: {
        type: String,
        required: true
    }
});

export default mongoose.model('Ticket', ticketSchema);
