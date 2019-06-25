var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var methodOverride = require('method-override')
var path = require('path')
var app = express()
var PORT = process.env.PORT || 3000



// Config
mongoose.connect("mongodb://localhost:27017/restfultBlogApp", { useNewUrlParser: true })
app.set('view engine', "ejs")
// app.use(express.static(path.join(__dirname,'/public'))); // generate static files
app.use(express.static(__dirname + '/public'));
// app.use("/public",express.static('public'))

// app.use('/public', express.static(__dirname + '/public'))

// app.use('/static', express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({extended:true}))
app.use(methodOverride("_method"))


// Mongoose/Model Config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    content:String,
    created:{
        type:Date, 
        default:Date.now
    },
})
var blog = mongoose.model("Blog", blogSchema)



// Restful Route
//INdex Route
app.get("/", (req, res) => {
    res.redirect("/blogs")
})
app.get("/blogs", (req, res) => {
    blog.find({}, (err, blogs) => {
        if(err){
            console.log("ERRORS!!")
        } else {
            res.render("index", {blogs : blogs}) //passing the data that comes from the database
         }
    })
})


// New Route
app.get("/blog/create", (req, res) => {
    res.render("create_post")
})
app.post("/blogs", (req, res) => {
    //create blog
    blog.create(req.body.blog, (err, newBlog) => {
        if(err){
            res.render("create_post")
        } else{
            res.redirect("/blogs")
        }
    })
    //redirect to the index
})

//#Show oute
app.get("/blog/:id", (req, res) => {
    blog.findById(req.params.id, (err, foundBlog) => {
        if(err){
            res.redirect("/blogs")
        } else {
            res.render("post", {blog:foundBlog})
        }
    })
    // res.send(`Blog id: ${req.params.id}`)
    console.log(req.params.id)
})

// Edit Route
app.get("/blog/:id/edit", (req, res) => {
    blog.findById(req.params.id, (err, foundBlog) =>{
        if(err){
            res.redirect("/blogs")
        } else{
            res.render("edit", {blog:foundBlog})

        }
    })
})
//Update Route
app.put("/blog/:id", (req, res)=> {
    // res.send("Post Updated")
    blog.findByIdAndUpdate(req.params.id, req.body.blog, (err,updatedBlog)=> {
        if(err){
            res.redirect("/blogs")
        } else{
            res.redirect(`/blog/${req.params.id}`)
        }
    })
})


// DELETE ROUTE
app.delete("blog/:id", (req, res) => {
    // res.send("Delete Post")
    blog.findByIdAndRemove(re.params.id, (err) => {
        if(err){
            res.redirect("/blogs")
        } else{
            res.redirect("/blogs")
        }
    })
})


app.listen(PORT, process.env.IP, () => {
    console.log(`App is running on port ${PORT}`)
})