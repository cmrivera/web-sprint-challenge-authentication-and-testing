const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("./auth-model.js");
const secrets = require("../api/secrets.js");

//password test usename alexishill

// router.get("/", async (req, res, next) => {
// 	try {
// 		res.json(await Users.find())
// 	} catch(err) {
// 		next(err)
// 	}
// })

router.get("/", (req, res) => {
  res.status(200).json({ api: "working", dbenv: process.env.DB_ENV });
});

router.post("/register", (req, res) => {
  let user = req.body;

  const rounds = process.env.HASH_ROUNDS || 14;

  const hash = bcrypt.hashSync(user.password, rounds);

  user.password = hash;

  Users.add(user)
    .then((saved) => {
      res.status(201).json(saved);
    })
    .catch((error) => {
      res.status(500).json({ errorMessage: error.message });
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({ message: `Welcome ${user.username}`, token });
      } else {
        res
          .status(401)
          .json({ message: "Invalid username or password - no jokes for you" });
      }
    })
    .catch((error) => {
      res.status(500).json({ errorMessage: error.message });
    });
});

function generateToken(user) {
  const payload = {
    userId: user.id,
    username: user.username,
  };
  const secret = secrets.jwtSecret;
  const options = {
    expiresIn: "2h",
  };
  return jwt.sign(payload, secret, options);
}

module.exports = router;
