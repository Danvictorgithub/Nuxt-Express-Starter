const { prisma } = require("../../db/prisma");
const { z } = require("zod");
exports.findAll = async (req, res) => {
  return res.json(await prisma.message.findMany());
};
exports.findOne = async (req, res) => {
  const { id } = req.params;

  const message = await prisma.message.findUnique({ where: { id: +id } });
  if (!message) {
    return res.status(404).json({ message: "Message Not Found" });
  }
  return res.json(message);
};

exports.create = async (req, res) => {
  const bodySchema = z.object({
    content: z
      .string()
      .min(4, { message: "Must be 4 or more characters long" }),
  });
  const result = bodySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  const newMessage = await prisma.message.create({
    data: req.body,
  });
  return res.json(newMessage);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const message = await prisma.message.findUnique({ where: { id: +id } });
  if (!message) {
    return res.status(404).json({ message: "Message Not Found" });
  }
  const bodySchema = z.object({
    content: z
      .string()
      .min(4, { message: "Must be 4 or more characters long" }),
  });
  const result = bodySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  const updatedMessage = await prisma.message.update({
    where: { id: +id },
    data: req.body,
  });
  return res.json(updatedMessage);
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  const message = await prisma.message.findUnique({ where: { id: +id } });
  if (!message) {
    return res.status(404).json({ message: "Message Not Found" });
  }
  const deletedMessage = await prisma.message.delete({ where: { id: +id } });
  return res.json(deletedMessage);
};
