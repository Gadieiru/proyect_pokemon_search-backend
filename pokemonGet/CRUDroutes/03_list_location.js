import express from "express";
import connection from "../config/00_connection.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await connection.query(
      "SELECT location_id AS id, location_name AS name FROM pokemon_database.location"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});
export default router;
