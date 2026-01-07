import mysql from "mysql2/promise";
import "dotenv/config";

// Aqui nos conectamos a la base de datos de mysql a la que queremos acceder
let connection;

try {
  connection = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  console.log("CONEXION EXITOSA");
} catch (err) {
  console.error("ERROR AL CONECTARSE A LA BASE DE DATOS:", err);
  process.exit(1);
}

// Hacemos la validacion de conexion, si la conexion falla nos lanzara un error, si la conexion es valida nos arrojara a la consola un "CONEXION EXITOSA";

export default connection;
