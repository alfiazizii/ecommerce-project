const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
  requireTitle: check('title')
    .trim()
    .isLength({ min: 5, max: 40 })
    .withMessage('Must be between 5 and 40 characters'),
  requirePrice: check('price')
    .trim()
    .toFloat()
    .isFloat({ min: 1 })
    .withMessage('Must be a number greater than 1'),
  requireEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid email')
    .custom(async email => {
      const existingUser = await usersRepo.getOneBy({ email });
      if (existingUser) {
        throw new Error('Email already in use');
      }
    }),
  requirePassword: check('password')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Must be between 6 and 20 characters'),
  requireConfirmPassword: check('confirmPassword')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Must be between 6 and 20 characters')
    .custom((confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password) {
        throw new Error('Password does not match');
      }
      return true;
    }),
  requireEmailExists: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must provide a valid email')
    .custom(async email => {
      const user = await usersRepo.getOneBy({ email });
      if (!user) {
        throw new Error('Email not found!');
      }
    }),
  requireValidPasswordForUser: check('password')
    .trim()
    .custom(async (password, { req }) => {
      const user = await usersRepo.getOneBy({ email: req.body.email });
      if (!user) {
        throw new Error('Invalid password');
      }

      const validPassword = await usersRepo.comparePasswords(
        user.password,
        password
      );
      if (!validPassword) {
        throw new Error('Invalid password');
      }
    })
};
