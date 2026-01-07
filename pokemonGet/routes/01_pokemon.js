import express from "express";
import connection from "../config/00_connection.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { name } = req.query; // Acceso vía: /search?name=pika

  if (!name) return res.status(400).json({ error: "Falta el nombre" });

  try {
    // Una sola consulta para traer TODO lo relacionado al Pokémon
    const query = `
      SELECT 
        p.pokemon_id, 
        p.pokemon_name, 
        p.pokemon_img,
        p.initial_happiness,
        p.capture_rate,
        r.rarity_name,
        GROUP_CONCAT(DISTINCT t.type_name SEPARATOR '/ ') AS types,
        GROUP_CONCAT(DISTINCT l.location_name SEPARATOR ', ') AS locations
      FROM pokemon_database.pokemon p
      LEFT JOIN rarity r ON p.rarity_id = r.rarity_id
      LEFT JOIN pokemon_types pt ON p.pokemon_id = pt.pokemon_id
      LEFT JOIN types t ON pt.types_id = t.types_id
      LEFT JOIN pokemon_location pl ON p.pokemon_id = pl.pokemon_id
      LEFT JOIN location l ON pl.location_id = l.location_id
      WHERE p.pokemon_name LIKE ?
      GROUP BY p.pokemon_id
      ORDER BY 
        CASE 
          WHEN p.pokemon_name = ? THEN 1 
          WHEN p.pokemon_name LIKE ? THEN 2 
          ELSE 3 
        END, 
        p.pokemon_name ASC
    `;

    const [rows] = await connection.execute(query, [
      `%${name}%`,
      name,
      `${name}%`
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No se encontró ningún Pokémon" });
    }

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;
