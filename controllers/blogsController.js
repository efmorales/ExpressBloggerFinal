const Blog = require('../models/Blogs');

async function getAllBlogs(req, res) {

    //query blogs 
    try {
        const allBlogs = await Blog.find({});
        res.json({ blogs: allBlogs });
    } catch (e) {
        console.log(e);
    }
}

async function createOneBlog(req, res) {

    try {
        //parse out fields from POST request
        const title = req.body.title
        const text = req.body.text
        const author = req.body.author
        const categories = req.body.category
        const year = req.body.year;

        //pass fields to new Blog model 
        //notice how it's way more organized and does the type checking for us
        const newBlog = new Blog({
            title,
            text,
            author,
            categories,
            year
        });

        //check if the new blog is valid
        const isValid = await newBlog.validateSync();

        //if the new blog is not valid, return the error to the user
        if (isValid) {
            res.json({
                success: false,
                error: isValid
            });
            return;
        }

        //save our new entry to the database 
        const savedData = await newBlog.save();

        //return the successful request to the user 
        res.json({
            success: true,
            blogs: savedData
        });

    } catch (e) {
        console.log(typeof e);
        console.log(e);
        res.json({
            error: e.toString(),
        });
    }
}

// get one random blog
async function getOneBlog(req, res) {
    try {
        const randomBlog = await Blog.aggregate([{ $sample: { size: 1 } }]);
        res.json({ blogs: randomBlog });
    } catch (e) {
        console.log(e);
    }
}

//get one blog by id
async function getOneBlogById(req, res) {
    //checking if the parameter ID was passed in
    if (!req.params.id) {
        res.json({
            success: false,
            message: "The blog id must be provided in the url parameters",
        });
        return;
    }

    try {
        const blogPosts = await Blog.findOne({
            id: req.params.id,
        });
        res.json({
            success: true,
            post: blogPosts,
        });
    } catch (e) {
        console.log(e);
    }
}

// update one blog by title
async function updateOneBlog(req, res) {
    //checking if the parameter title was passed in
    if (!req.params.title) {
        res.json({
            success: false,
            message: "The blog title must be provided in the url parameters",
        });
        return;
    }

    try {
        const blogPosts = await Blog.findOneAndUpdate(
            { title: req.params.title },
            {
                $set: {
                    title: req.body.title,
                    text: req.body.text,
                    author: req.body.author,
                    year: req.body.year,
                    categories: req.body.categories,
                },
            },
            { new: true }
        );
        res.json({
            success: true,
            post: blogPosts,
        });
    } catch (e) {
        console.log(e);
    }
}

// delete one blog by title
async function deleteOneBlog(req, res) {
    //checking if the parameter title was passed in
    if (!req.params.title) {
        res.json({
            success: false,
            message: "The blog title must be provided in the url parameters",
        });
        return;
    }

    try {
        const blogPosts = await Blog.findOneAndDelete({
            title: req.params.title,
        });
        res.json({
            success: true,
            post: blogPosts,
        });
    } catch (e) {
        console.log(e);
    }
}




module.exports = {
    getAllBlogs,
    createOneBlog,
    getOneBlog,
    getOneBlogById,
    updateOneBlog,
    deleteOneBlog,
};