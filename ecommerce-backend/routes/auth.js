const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// ==========================
// HARDCODED ADMIN CREDENTIALS
// ==========================
// Change these to whatever you want. This account does NOT need to
// exist in the database — it's checked before the DB lookup below.
const HARDCODED_ADMIN_EMAIL = 'admin@example.com';
const HARDCODED_ADMIN_PASSWORD = 'admin123';

// ==========================
// SIGNUP
// ==========================
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        message: 'Please provide name, email and password.'
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Email already registered.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'USER'
      }
    });

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: 'Internal server error.',
      error: error.message
    });
  }
});

// ==========================
// LOGIN
// ==========================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide email and password.'
      });
    }

    // ==========================
    // HARDCODED ADMIN CHECK
    // ==========================
    // If the submitted credentials match the hardcoded admin account,
    // skip the database lookup entirely and issue a real signed JWT
    // with role: "ADMIN". This token behaves exactly like a DB-issued
    // one, so every existing auth/admin-protected route (products,
    // categories, orders, etc.) keeps working with no other changes.
    if (email === HARDCODED_ADMIN_EMAIL && password === HARDCODED_ADMIN_PASSWORD) {
      const token = jwt.sign(
        {
          userId: 0,
          role: 'ADMIN'
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        message: 'Login successful.',
        token,
        user: {
          id: 0,
          name: 'Admin',
          email: HARDCODED_ADMIN_EMAIL,
          role: 'ADMIN'
        }
      });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password.'
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: 'Internal server error.',
      error: error.message
    });
  }
});

// ==========================
// GET CURRENT USER
// ==========================
router.get('/me', auth, async (req, res) => {
  try {
    if (req.user.userId === 0) {
      return res.json({ id: 0, name: 'Admin', email: HARDCODED_ADMIN_EMAIL, role: 'ADMIN' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// ==========================
// UPDATE ACCOUNT DETAILS (name, email, password)
// ==========================
router.put('/me', auth, async (req, res) => {
  try {
    if (req.user.userId === 0) {
      return res.status(400).json({ message: 'Admin account cannot be edited here.' });
    }

    const { name, email, currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to set a new password.' });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect.' });
      }
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: updateData
    });

    res.json({
      message: 'Account updated successfully.',
      user: { id: updated.id, name: updated.name, email: updated.email, role: updated.role }
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') return res.status(400).json({ message: 'Email already in use.' });
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
