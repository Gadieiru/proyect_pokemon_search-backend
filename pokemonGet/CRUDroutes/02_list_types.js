import express from "express";
import connection from "../config/00_connection.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await connection.query(
      "SELECT types_id AS id, type_name AS name FROM pokemon_database.types"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

export default router;
