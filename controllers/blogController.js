import blogModel from "../models/blogModel.js";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const createBlog = async (req, res) => {
    try {
        const { eventId, title, content, blogImage } = req.body;

        const result = await cloudinary.uploader.upload(blogImage);

        const blog = await blogModel.create({
            eventId,
            title,
            content,
            date: new Date(),
            imageUrl: result.secure_url
        });

        await blog.save();

        res.status(201).json(blog);

        fs.unlink(blogImage, (err) => {
            if (err) throw new Error(err);
        });
    } catch (error) {
        res.status(500);
        throw new Error(error);
    }
}

const getBlogs = async (req, res) => {
    try {
        const blogs = await blogModel.find().populate('eventId');
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500);
        throw new Error(error);
    }
}

const getBlogById = async (req, res) => {
    try {
        const blog = await blogModel.findById(req.params.id).populate('eventId');
        res.status(200).json(blog);
    } catch (error) {
        res.status(500);
        throw new Error(error);
    }
}

const updateBlog = async (req, res) => {
    try {
        const blog = await blogModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        
        if (!blog) {
            res.status(404);
            throw new Error('Blog not found');
        }

        res.status(200).json(blog);
    } catch (error) {
        res.status(500);
        throw new Error(error);
    }
}

const deleteBlog = async (req, res) => {
    try {
        const blog = await blogModel.findByIdAndDelete(req.params.id);
        res.status(200).json(blog);
    } catch (error) {
        res.status(500);
        throw new Error(error);
    }
}

export default { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog };
