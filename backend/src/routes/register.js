import express from "express";
const router = express.Router();

router.post("/register", (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  res.status(201).json({
    user_id: 1234,
    name,
    email,
    phone,
  });
});

export default router;
