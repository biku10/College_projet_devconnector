const express = require('express');
const router = express.Router();
const auth = require('../../Middleware/auth');
const Profile = require('../../modals/Profile');
const User = require('../../modals/User');
//@route GET api/profile/me
//@desc get current users profile
//@access value Private

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'there is no profile for user' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
