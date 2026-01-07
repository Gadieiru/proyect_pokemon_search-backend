import connection from "../pokemonGet/config/00_connection.js";

export async function insertPokemonTypes(pokemonId, typeIds) {
  if (!Array.isArray(typeIds) || typeIds.length === 0) {
    return;
  }

  const values = typeIds.map((tid) => [pokemonId, tid]);

  await connection.query(
    "INSERT INTO pokemon_database.pokemon_types (pokemon_id, types_id) VALUES ?",
    [values] 
  );
}

export async function insertPokemonLocations(pokemonId, locationIds) {
  if (!Array.isArray(locationIds) || locationIds.length === 0) {
    return;
  }

  const values = locationIds.map((lid) => [pokemonId, lid]);

  await connection.query(
    "INSERT INTO pokemon_database.pokemon_location (pokemon_id, location_id) VALUES ?",
    [values]
  );
}
