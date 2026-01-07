import express from "express";
import connection from "../config/00_connection.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await connection.query(
      "SELECT rarity_id AS id, rarity_name AS name FROM pokemon_database.rarity"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

export default router;
