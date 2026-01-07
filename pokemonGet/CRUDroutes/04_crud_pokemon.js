import express from "express";
import connection from "../config/00_connection.js";
import upload from "../middleware/01_upload.js";
import verifyToken from "../middleware/02_auth.js";
import { deleteFile } from "../utils/fileHandler.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await connection.execute(
      "SELECT p.pokemon_id, p.pokemon_name, p.initial_happiness, p.rarity_id, r.rarity_name, GROUP_CONCAT(DISTINCT t.type_name) AS types, GROUP_CONCAT(DISTINCT l.location_name) AS location, GROUP_CONCAT(DISTINCT t.types_id) AS type_ids, GROUP_CONCAT(DISTINCT l.location_id) AS location_ids, p.pokemon_img FROM pokemon_database.pokemon p JOIN rarity r ON p.rarity_id = r.rarity_id LEFT JOIN pokemon_types pt ON p.pokemon_id = pt.pokemon_id LEFT JOIN types t ON pt.types_id = t.types_id LEFT JOIN pokemon_location pl ON p.pokemon_id = pl.pokemon_id LEFT JOIN location l ON pl.location_id = l.location_id GROUP BY p.pokemon_id;"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener Pokémon:", err);
    return res.status(500).json({ error: "Error en la base de datos" });
  }
});

router.post(
  "/",
  verifyToken,
  upload.single("pokemon_img"),
  async (req, res) => {
    const { pokemon_name, rarity_id } = req.body;

    const pokemon_img = req.file ? `/pokemons/${req.file.filename}` : null;

    if (!pokemon_name || !rarity_id) {
      if (pokemon_img) await deleteFile(pokemon_img);
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    try {
      const [result] = await connection.execute(
        "INSERT INTO pokemon_database.pokemon (pokemon_name, rarity_id, pokemon_img) VALUES (?, ?, ?)",
        [pokemon_name, rarity_id, pokemon_img]
      );

      const newId = result.insertId;
      const typeIds = JSON.parse(req.body.type_id || "[]");
      const locationIds = JSON.parse(req.body.location_id || "[]");

      if (typeIds.length > 0) {
        const typeValues = typeIds.map((tid) => [newId, tid]);
        await connection.query(
          "INSERT INTO pokemon_database.pokemon_types (pokemon_id, types_id) VALUES ?",
          [typeValues]
        );
      }

      if (locationIds.length > 0) {
        const locationValues = locationIds.map((lid) => [newId, lid]);
        await connection.query(
          "INSERT INTO pokemon_database.pokemon_location (pokemon_id, location_id) VALUES ?",
          [locationValues]
        );
      }

      res.status(201).json({ id: newId, message: "Pokemon creado" });
    } catch (err) {
      if (pokemon_img) await deleteFile(pokemon_img);
      console.error("Error al insertar Pokemon", err);
      res.status(500).json({ error: "Error del servidor " });
    }
  }
);

router.put(
  "/:id",
  verifyToken,
  upload.single("pokemon_img"),
  async (req, res) => {
    const { id } = req.params;
    const { pokemon_name, rarity_id } = req.body;
    const pokemon_img = req.file ? `/pokemons/${req.file.filename}` : null;

    if (!pokemon_name || !rarity_id) {
      if (pokemon_img) await deleteFile(pokemon_img);
      return res
        .status(400)
        .json({ error: "Faltan campos obligatorios para la actualización" });
    }

    try {
      const [rows] = await connection.execute(
        "SELECT pokemon_img FROM pokemon_database.pokemon WHERE pokemon_id = ?",
        [id]
      );

      const imagen_vieja = rows[0]?.pokemon_img;

      let sql =
        "UPDATE pokemon_database.pokemon SET pokemon_name = ?, rarity_id = ?";
      let params = [pokemon_name, rarity_id];

      if (pokemon_img) {
        sql += ", pokemon_img = ?";
        params.push(pokemon_img);
      }
      sql += " WHERE pokemon_id = ?";
      params.push(id);

      const [result] = await connection.execute(sql, params);

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: `No se encontró el Pokémon con ID ${id}` });
      }

      await connection.execute(
        "DELETE FROM pokemon_database.pokemon_types WHERE pokemon_id = ?",
        [id]
      );

      await connection.execute(
        "DELETE FROM pokemon_database.pokemon_location WHERE pokemon_id = ?",
        [id]
      );

      const typeIds = JSON.parse(req.body.type_id || "[]");
      const locationIds = JSON.parse(req.body.location_id || "[]");

      if (typeIds.length > 0) {
        const typeValues = typeIds.map((tid) => [id, tid]);
        await connection.query(
          "INSERT INTO pokemon_database.pokemon_types (pokemon_id, types_id) VALUES ?",
          [typeValues]
        );
      }

      if (locationIds.length > 0) {
        const locationValues = locationIds.map((lid) => [id, lid]);
        await connection.query(
          "INSERT INTO pokemon_database.pokemon_location (pokemon_id, location_id) VALUES ?",
          [locationValues]
        );
      }

      if (pokemon_img && imagen_vieja) {
        await deleteFile(imagen_vieja);
      }

      res
        .status(200)
        .json({ id: Number(id), message: "Actualizado correctamente" });
    } catch (err) {
      console.error(`Error al actualizar Pokémon con ID ${id}:`, err);
      res
        .status(500)
        .json({ error: "Error del servidor al actualizar el Pokémon." });
    }
  }
);

router.delete("/:id", verifyToken, async (req, res) => {
  const id = req.params.id;

  try {
    const [rows] = await connection.execute(
      "SELECT pokemon_img FROM pokemon_database.pokemon WHERE pokemon_id = ?",
      [id]
    );
    const imagenABorrar = rows[0]?.pokemon_img;

    await connection.execute(
      "DELETE FROM pokemon_database.pokemon_types WHERE pokemon_id = ?",
      [id]
    );

    await connection.execute(
      "DELETE FROM pokemon_database.pokemon_location WHERE pokemon_id = ?",
      [id]
    );

    const query = "DELETE FROM pokemon_database.pokemon WHERE pokemon_id = ?";
    const [result] = await connection.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: `No se encontró el Pokémon con ID ${id} para eliminar.`,
      });
    }

    if (imagenABorrar) {
      await deleteFile(imagenABorrar);
    }

    res.status(204).send();
  } catch (err) {
    console.error(`Error al eliminar Pokémon con ID ${id}:`, err);
    res
      .status(500)
      .json({ error: "Error del servidor al eliminar el Pokémon." });
  }
});

export default router;
