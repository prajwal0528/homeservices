const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { sendEmail, emailTemplates } = require('../utils/email');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Mobile number';
      return res.status(400).json({ success: false, message: `${field} already registered` });
    }

    const user = await User.create({ name, email, mobile, password });

    // Send welcome email (non-blocking)
    const { subject, html } = emailTemplates.welcome(user);
    sendEmail({ to: user.email, subject, html });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Check for hardcoded admin
    if (email === 'admin' && password === 'admin@123') {
      return res.json({
        success: true,
        message: 'Admin login successful',
        token: 'admin-hardcoded-token',
        user: {
          _id: 'admin',
          name: 'Admin',
          email: 'admin@homeservices.com',
          role: 'admin'
        }
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Your account has been deactivated. Contact support.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        avatar: user.avatar,
        address: user.address,
        city: user.city
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    if (req.user.role === 'admin' && req.user._id === 'admin') {
      return res.json({ success: true, user: req.user });
    }
    const user = await User.findById(req.user._id).populate('savedServices', 'name category price image rating');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user data' });
  }
};

// @desc    Update profile
// @route   PUT /api/auth/update-profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, mobile, address, city, notificationSettings } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, mobile, address, city, notificationSettings },
      { new: true, runValidators: true }
    );
    res.json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating profile' });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error changing password' });
  }
};

// @desc    Toggle saved service
// @route   POST /api/auth/save-service/:serviceId
// @access  Private
exports.toggleSavedService = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const serviceId = req.params.serviceId;
    const idx = user.savedServices.indexOf(serviceId);

    if (idx > -1) {
      user.savedServices.splice(idx, 1);
      await user.save();
      return res.json({ success: true, message: 'Service removed from favorites', saved: false });
    } else {
      user.savedServices.push(serviceId);
      await user.save();
      return res.json({ success: true, message: 'Service saved to favorites', saved: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error toggling saved service' });
  }
};
