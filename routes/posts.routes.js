const router = require("express").Router();
const Post = require("../models/Post.model");
const uploader = require("../middleware/cloudinary.config");




router.get("/posts", async (req, res) => {
  console.log(req.session);
  try {
    const posts = await Post.find({ userId: req.session.userId });
    res.render("Posts", { posts, currentUser: req.user });
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).send("Error retrieving posts");
  }
});

router.get("/create", (req, res) => {
  res.render("posts/new-post");
});


router.post("/posts/create", uploader.single("image"), async (req, res) => {
  const { location, title, comment } = req.body;
  const payload = { location, title, comment, userId: req.session.userId};
  if (req.file) {
    payload.image = req.file.path;
  }

  try { 
    const newPost = await Post.create(payload);
    res.redirect("/posts");
  } catch (error) {
    console.error("Error creating post:", error);
    res.render("posts/new-post", {
      errorMessage: "There was an error creating a new post. Please try again.",
    });
  }
});

router.post("/posts/:postId/delete", async (req, res) => {
  const postId = req.params.postId;

  try {
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (deletedPost.image) {
      // Lógica para excluir a imagem do Cloudinary
      // ...
    }

    res.redirect("/posts");
  } catch (error) {
    console.error("Error deleting post:", error);
    res.redirect("/posts");
  }
});

router.get("/posts/:postId/update", async (req, res) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);
    res.render("update", { post });
  } catch (error) {
    console.error("Error retrieving post for update:", error);
    res.redirect("/posts");
  }
});

router.post("/posts/:postId/update", uploader.single("image"), async (req, res) => {
  const postId = req.params.postId;
  const { title, comment, location } = req.body;
  let payload = { title, comment, location };

  if (req.file) {
    payload.image = req.file.path;
    console.log(req.file.path);

    const previousPost = await Post.findById(postId);
    if (previousPost.image) {
      // Lógica para excluir a imagem anterior do Cloudinary
      // ...
    }
  } else {
    // Caso a imagem não seja enviada, mantenha o valor atual do campo image no banco de dados
    const existingPost = await Post.findById(postId);
    payload.image = existingPost.image;
  }

  try {
    await Post.findByIdAndUpdate(postId, payload);
    res.redirect("/posts");
  } catch (error) {
    console.error("Error updating post:", error);
    res.redirect("/posts");
  }
});


// Rota para criar um novo post
router.get('/new-post', (req, res) => {
  res.render('new-post');
});

router.post('/new-post', async (req, res) => {
  try {
    const { location, description, comment, image } = req.body;
    const post = new Post ({ location, description,  comment, image });

    await post.save();
    res.redirect('/posts');
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).send('Error creating post');
  }
});



module.exports = router;