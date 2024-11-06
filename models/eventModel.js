import mongoose, { Schema, model, Types } from "mongoose";

const eventSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: String },
    isFree: { type: Boolean },
    imageUrl: { type: String },
    startDateTime: {type: Date},
    endDateTime: {type: Date},
    url: { type: String },
    date: { type: Date },
    venue: { type: String },
    location: { type: String },
    organizerId: { type: Types.ObjectId, ref: 'Organizer' },
    category: {
        _id: { type: String },
        name: { type: String }
    },
    isFeatured: {
        type: Boolean,
        required: false
    }
});

export default mongoose.model('Event', eventSchema);