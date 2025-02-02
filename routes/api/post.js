const express = require('express');
const router = express.Router();
const Post = require('../../modals/Post');
const { check, validationResult } = require('express-validator');
const auth = require('../../Middleware/auth');
const Profile = require('../../modals/Profile');
const User = require('../../modals/User');
//@route POST api/posts
//@desc Create a post
//@access value private

router.post(
  '/',
  [auth, check('text', 'text is required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server Error');
    }
  }
);
//@route GET api/posts
//@desc Get all post
//@access value private

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server Error');
  }
});

//@route GET api/posts/:id
//@desc Get  post by id for individual posts
//@access value private

router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send({ msg: 'post not found' });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'post not found' });
    }
    res.status(500).send('server Error');
  }
});

//@route DELETE api/posts/:id
//@desc Delete A POST
//@access value private

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //check on the user
    if (!post) {
      return res.status(404).send({ msg: 'post not found' });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not Authorized ' });
    }
    await post.remove();
    res.json('Post removed');
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'post not found' });
    }
    res.status(500).send('server Error');
  }
});

//@route Put api/posts/like/:id
//@desc Like A POST
//@access value private

router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //check if the post has already been liked
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: 'post already liked' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/posts/unlike/:id
// @desc     Unlike a post
// @access   Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has not yet been liked
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    // remove the like
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    return res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route POST api/posts/comment/:id
//@desc comment on a post
//@access value private

router.post(
  '/comment/:id',
  [auth, check('text', 'text is required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };
      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server Error');
    }
  }
);

//@route Delete api/posts/comment/:id/:comment_id
//@desc Delete a comment
//@access value private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //pullout comment
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );
    //Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exists' });
    }
    //check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const removeIndex = post.comments
      .map(comment => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    return res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server Error');
  }
});
module.exports = router;
