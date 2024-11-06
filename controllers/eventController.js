import eventModel from '../models/eventModel.js';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

const createEvent = async (req, res) => {
    try {
        const event = await eventModel.create(req.body);
        const image = req.file.path;
        
        const result = await cloudinary.uploader.upload(image);
        event.image = result.secure_url;
        await event.save();
        
        res.status(201).json(event);
        fs.unlink(image, (err) => {
            if (err) throw new Error(err);
        });
    } catch (error) {
        res.status(500);
        throw new Error(error);
    }
}

const getEvents = async (req, res) => {
    try {
        const events = await eventModel.find().populate('organizerId');
        res.status(200).json(events);
    } catch (error) {
        res.status(500);
        throw new Error(error);
    }
}

const getEventById = async (req, res) => {  
    try {
        const event = await eventModel.findById(req.params.id).populate('organizerId');
        
        if (!event) {
            res.status(404);
            throw new Error('Event not found');
        }

        res.status(200).json(event);
    } catch (error) {
        res.status(500);
        throw new Error(error);
    }
}

const updateEvent = async (req, res) => {
    try {
        const event = await eventModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        const image = req.file.path;
        
        const result = await cloudinary.uploader.upload(image);
        event.image = result.secure_url;
        await event.save();
       
        if (!event) {
            res.status(404);
            throw new Error('Event not found');
        }

        res.status(200).json(event);

        fs.unlink(image, (err) => {
            if (err) throw new Error(err);
        });
    } catch (error) {
        res.status(500);
        throw new Error(error);
    }
}

const deleteEvent = async (req, res) => {
    try {
        const event = await eventModel.findByIdAndDelete(req.params.id);

        if (!event) {
            res.status(404);
            throw new Error('Event not found');
        }

        await cloudinary.uploader.destroy(event.image);

        res.status(200).json(event);
    } catch (error) {
        res.status(500);
        throw new Error(error);
    }
}

export default { createEvent, getEvents, getEventById, updateEvent, deleteEvent };

