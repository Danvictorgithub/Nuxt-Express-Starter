const { z } = require("zod");
const { prisma } = require("../../db/prisma");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
exports.create = async (req, res) => {
  const bodySchema = z.object({
    username: z.string().min(4),
    password: z.string().min(8),
  });
  const result = bodySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  req.body.username = req.body.username.toLowerCase();
  const user = await prisma.user.findFirst({
    where: { username: req.body.username.toLowerCase() },
  });
  if (user) {
    return res.status(400).json({ error: "Username already exists" });
  }
  // Encrypts Password
  req.body.password = await bcrypt.hash(
    req.body.password,
    parseInt(process.env.SALT_ROUNDS) || 10
  );

  const newUser = await prisma.user.create({
    data: req.body,
  });
  return res.json(newUser);
};

exports.findAll = async (req, res) => {
  return res.json(await prisma.user.findMany());
};
exports.findOne = async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({ where: { id: +id } });
  if (!user) {
    return res.status(404).json({ message: "User Not Found" });
  }
  return res.json(user);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({ where: { id: +id } });
  if (!user) {
    return res.status(404).json({ message: "User Not Found" });
  }
  const bodySchema = z.object({
    username: z.string().min(4),
    password: z.string().min(8),
  });
  req.body.username = req.body.username.toLowerCase();
  // Encrypts Password
  req.body.password = await bcrypt.hash(
    req.body.password,
    parseInt(process.env.SALT_ROUNDS) || 10
  );
  const result = bodySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  const userWithSameUsername = await prisma.user.findUnique({
    where: { username: req.body.username.toLowerCase() },
  });
  if (userWithSameUsername) {
    return res.status(400).json({ error: "Username already exists" });
  }
  const updatedUser = await prisma.user.update({
    where: { id: +id },
    data: req.body,
  });
  return res.json(updatedUser);
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({ where: { id: +id } });
  if (!user) {
    return res.status(404).json({ message: "User Not Found" });
  }
  const deletedUser = await prisma.user.delete({ where: { id: +id } });
  return res.json(deletedUser);
};

exports.signin = async (req, res) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    // session is set to false since API is used for authentication
    // remember passport.ts return value patterns?  this is how it used in passport.authenticate

    // if (!user) {
    //     // Pattern if the authentication form is wrong, the third parameter indicates what is the message
    //     { return done(null, false, { message: "Incorrect username or password" }); }
    // }
    // // Patter if the authentication is correct, the third parameter indicates what is the message
    // return done(null, user, { message: "Logged In Successful" });

    if (err || !user) {
      return res.status(400).json({
        message: "Invalid Password",
        user: user,
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      jwt.sign({ user }, process.env.JWT_SECRET || "secret", (err, token) => {
        if (err) {
          return res.status(400).json({
            message: "Something is not right",
          });
        }
        return res.status(200).json({ user, access_token: token });
      });
    });
  })(req, res);
};
