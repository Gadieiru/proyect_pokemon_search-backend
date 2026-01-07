// Consejo: siempre al importar agregar tambien la extension del archivo, ej: import connection from "./pokemonGet/config/00_connection"; => mal;     import connection from "./pokemonGet/config/00_connection.js"; => agrega el .js
import 'dotenv/config';
import express from "express";
import cors from "cors";
import listRarityRouter from "./pokemonGet/CRUDroutes/01_list_rarity.js";
import listTypesRouter from "./pokemonGet/CRUDroutes/02_list_types.js";
import listLocationRouter from "./pokemonGet/CRUDroutes/03_list_location.js";
import crudPokemonRouter from "./pokemonGet/CRUDroutes/04_crud_pokemon.js";
import pokemonRoutes from "./pokemonGet/routes/01_pokemon.js";
import UserRoutes from "./pokemonGet/UsersRoutes/01_users.js"

const app = express();
app.use(express.json());

app.use(cors());
app.use(express.static('static'));

app.get("/", (req, res) => {
  res.send("API de pokedex Lista");
});

app.use('/pokemons', express.static('static/pokemons'));

app.use("/pokemon/search", pokemonRoutes);

app.use("/rarity", listRarityRouter);
app.use("/type", listTypesRouter);
app.use("/location", listLocationRouter);

app.use("/crud", crudPokemonRouter);

app.use("/users", UserRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Escuchando en el puerto ${port}...`));