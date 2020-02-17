const express = require('express');
const bodyParser = require('body-parser');
const usersRepo = require('./repositories/users');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="Email"/>
            <input name="password" placeholder="Password"/>
            <input name="confirmPassword" placeholder="Confirm Password"/>
            <button>Sign Up</button>
        </form>
    </div>
  `);
});

app.post('/', async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  const existingUser = await usersRepo.getOneBy({ email });
  if (existingUser) {
    return res.send('Email already in use');
  }

  if (password !== confirmPassword) {
    return res.send('Passwords must match');
  }

  res.send('Account created!');
});

app.listen(3000, () => {
  console.log('Listening');
});
