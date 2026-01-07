# proyect_pokemon_search

Modificacion final:


1.API REST - Pokedex Backend

Este proyecto consiste en el desarrollo de una API RESTful para gestionar una base de datos de Pokémon (estilo Pokedex). El objetivo principal fue crear una arquitectura escalable, legible y seguir buenas prácticas de desarrollo backend.

--------------------------------------------------------------------

2.Tecnologías Utilizadas:

Lenguaje: JavaScript (Node.js)

Entorno y Core:

  a.Node.js: Entorno de ejecución para JavaScript.
  b.Express: Framework minimalista para crear el servidor y manejar las rutas.
  
  c.Nodemon: Herramienta de desarrollo para el reinicio automático del servidor ante cambios.
  
  d.Dotenv: Gestión de variables de entorno (protección de credenciales y claves secretas).
  
Base de Datos:
  
  a.MySQL (v8.0): Motor de base de datos relacional.
  
  b.mysql2: Cliente de conexión optimizado con soporte nativo para Promesas.
  
  c.Seguridad y Autenticación:
  
  d.Bcrypt: Librería para el hashing de contraseñas (garantiza que las claves no se guarden en texto plano).
  
  e.JsonWebToken (JWT): Generación y validación de tokens para manejo de sesiones seguras y rutas protegidas.
  
  f.Cors: Middleware para controlar los permisos de acceso (Cross-Origin Resource Sharing).
  
Manejo de Archivos:
  
  a.Multer: Middleware para la recepción y almacenamiento de imágenes (multipart/form-data).
  
Control de Versiones: 
   
   Git.

--------------------------------------------------------------------

3.Arquitectura del Proyecto:

  El proyecto sigue una estructura modular para separar responsabilidades, facilitar el mantenimiento y la escalabilidad:
  
a./config:

  connection.js: Configuración aislada de la conexión a la base de datos, separando credenciales de la lógica de negocio.
  
b./routes:

  crudRoutes.js: Contiene toda la lógica del ciclo de vida de los Pokémon (CRUD).
  
  userRoutes.js: Maneja la lógica de autenticación (Registro de usuarios e Inicio de Sesión).
  
c./middleware:
  
  Auth Middleware: Verifica la validez del JWT para proteger rutas privadas (asegura que solo usuarios logueados puedan realizar ciertas acciones).
  
  Upload Middleware: Configuración de Multer para recibir, validar y almacenar las imágenes en el servidor.
  
d./utils:
  
  fileHandler.js: Lógica auxiliar para el sistema de archivos. Se encarga de la limpieza automática (ej. eliminar la imagen antigua del servidor cuando un Pokémon es borrado o su imagen es actualizada) para evitar basura digital.
  
e./import:
  
  Módulo encargado de gestionar las tablas puente (relaciones muchos a muchos), asegurando que los datos complejos (como tipos de Pokémon o ubicaciones) se vinculen correctamente en la base de datos.
  
f.index.js:
  
  Punto de entrada principal. Integra todas las rutas, middlewares globales y configuraciones mediante app.use, manteniendo el archivo limpio y legible.
  
--------------------------------------------------------------------

4.Funcionalidades (CRUD):

El sistema gestiona el ciclo completo de los datos:

GET: Consulta de información (enfrenté y resolví retos lógicos en las queries complejas).

POST: Creación de nuevos registros, incluyendo la subida de imágenes, IDs de rareza y nombres.

PUT: Actualización de datos existentes.

DELETE: Eliminación de registros.

--------------------------------------------------------------------

5.Historial de Actualizaciones (Changelog)

Versión Inicial
Inicio del desarrollo enfocado en peticiones GET.

Configuración de la conexión a base de datos y estructura de carpetas (config y routes).

Enfoque en código limpio (Clean Code) para fines educativos.

Actualización: 27/11/2025 (Refactorización & Archivos)
 Mejora Crítica: Migración de la conexión de base de datos de Callbacks a Promesas. Esto permitió modernizar el código y prepararlo para escalabilidad futura.

Manejo de Imágenes: Implementación de Multer como middleware. Ahora el backend puede recibir, procesar y almacenar imágenes enviadas desde el frontend, vinculándolas a la base de datos junto con la información del Pokémon.

Actualización: 01/12/2025 (Finalización CRUD)
Corrección de Bugs: Solución de errores lógicos detectados en pruebas anteriores.

CRUD Completo: Implementación exitosa de los métodos DELETE (eliminar datos) y PUT (actualizar información).

El sistema se considera estable y listo para su uso en producción o integración con Frontend.

--------------------------------------------------------------------

Me enfrenté a muchos problemas de lógica, especialmente en las peticiones GET al inicio. Sin embargo, esto no impidió que culminara el proyecto. Aprendí de mis errores y descubrí formas de simplificar y ordenar el código, manteniendo siempre las buenas prácticas. Sinceramente, disfruté mucho el proceso.

--------------------------------------------------------------------

Configuración de la Base de Datos:

El proyecto incluye un archivo de respaldo (dump) autoconstruido que contiene toda la estructura de tablas y los datos iniciales necesarios para probar la API inmediatamente.

a. Ubicación del Archivo:
En la raíz del proyecto encontrarás una carpeta llamada: 📂 dumps/ Dentro de ella se encuentra el archivo SQL (ej. pokemon_backup.sql) listo para ser importado.

b. Pasos para Importar
Puedes utilizar cualquier cliente de MySQL (como MySQL Workbench, DBeaver, HeidiSQL) o la terminal.

MySQL Workbench (fue lo que yo usé):

Crea una nueva base de datos vacía (Schema) llamada pokemon_database.
Ve a Administration > Data Import/Restore.
Selecciona "Import from Self-Contained File" y busca el archivo dentro de la carpeta dumps.
Selecciona el esquema pokemon_database como destino.

Haz clic en Start Import.
(Se que ya deben saber estos pasos, pero es por si acaso.)