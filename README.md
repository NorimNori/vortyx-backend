# Vortyx — Backend

API REST para la aplicación Vortyx — colección personal de juegos y películas.

🌐 **[api.windy.gammavortex.com](https://api.windy.gammavortex.com)**

---

## Descripción

Backend del proyecto final del Bootcamp de Desarrollo Web de TripleTen. Provee autenticación con JWT y endpoints para que los usuarios gestionen su colección personal de videojuegos, películas y series. Incluye búsqueda indexada unificada con índices de texto de MongoDB.

---

## Stack tecnológico

| Tecnología | Uso |
|---|---|
| Node.js + Express | Servidor y API REST |
| MongoDB + Mongoose | Base de datos y ODM |
| JWT + bcryptjs | Autenticación y hash de contraseñas |
| celebrate / Joi | Validación de request body, params y query |
| Winston + express-winston | Logs de requests y errores en JSON |

---

## Estructura del proyecto

```
vortyx-backend/
├── app.js                ← Express + middlewares + rutas
├── server.js             ← Punto de entrada
├── models/
│   ├── user.js           ← Esquema User con findUserByCredentials
│   ├── game.js           ← Esquema Game con índice de texto ⭐
│   └── movie.js          ← Esquema Movie con índice de texto ⭐
├── controllers/
│   ├── auth.js           ← signup / signin
│   ├── users.js          ← GET /users/me
│   ├── games.js          ← CRUD colección de juegos
│   ├── movies.js         ← CRUD colección de películas/series
│   └── search.js         ← Búsqueda indexada unificada ⭐
├── routes/
│   ├── auth.js           ← Rutas públicas con validación celebrate
│   ├── users.js
│   ├── games.js
│   ├── movies.js
│   └── search.js
├── middlewares/
│   ├── auth.js           ← Validación JWT en rutas protegidas
│   └── errorHandler.js   ← Manejador centralizado de errores
├── errors/
│   └── index.js          ← Clases: BadRequest, Unauthorized, Forbidden, NotFound, Conflict
├── logs/                 ← request.log y error.log (no en repositorio)
├── .env.example
├── .gitignore
├── .editorconfig
└── .eslintrc
```

---

## Instalación local

```bash
# 1. Clona el repositorio
git clone https://github.com/tu-usuario/vortyx-backend.git
cd vortyx-backend

# 2. Instala dependencias
npm install

# 3. Configura las variables de entorno
cp .env.example .env
# Edita .env con tus valores

# 4. Crea la carpeta de logs
mkdir logs

# 5. Inicia en modo desarrollo
npm run dev
```

---

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `MONGO_URI` | URI de conexión a MongoDB | `mongodb://localhost:27017/vortyx` |
| `JWT_SECRET` | Clave secreta para firmar JWT | Mínimo 32 caracteres aleatorios |
| `PORT` | Puerto del servidor | `3001` |
| `NODE_ENV` | Entorno de ejecución | `development` / `production` |

> ⚠️ El archivo `.env` solo existe en el servidor de producción. Nunca se sube al repositorio.

---

## Scripts

```bash
npm run dev    # Desarrollo con hot reload (nodemon)
npm start      # Producción sin hot reload (node)
```

---

## Endpoints

### Autenticación — rutas públicas

```
POST /signup
Body: { name, email, password }
Respuesta 201: { _id, name, email }

POST /signin
Body: { email, password }
Respuesta 200: { token }
```

### Usuarios — protegidos 🔒

```
GET /users/me
Respuesta 200: { _id, name, email, createdAt }
```

### Juegos — protegidos 🔒

```
GET    /games
Respuesta 200: [ { _id, rawg_id, title, genre, platform, status, imageUrl, playtime, createdAt } ]

POST   /games
Body: { rawg_id, title, genre, platform, status, imageUrl, playtime }
Respuesta 201: { ...game }

PATCH  /games/:gameId
Body: { status }
Respuesta 200: { ...game actualizado }

DELETE /games/:gameId
Respuesta 200: { message: "Juego eliminado correctamente" }
```

### Películas y series — protegidos 🔒

```
GET    /movies
Respuesta 200: [ { _id, tmdb_id, title, genre, type, status, imageUrl, createdAt } ]

POST   /movies
Body: { tmdb_id, title, genre, type, status, imageUrl }
       type: "movie" | "series"
Respuesta 201: { ...movie }

PATCH  /movies/:movieId
Body: { status }
Respuesta 200: { ...movie actualizado }

DELETE /movies/:movieId
Respuesta 200: { message: "Item eliminado correctamente" }
```

### Búsqueda indexada ⭐ — protegido 🔒

```
GET /search?q=query

Respuesta 200: {
  games: [ { ...game, score: 1.1 } ],   ← ordenados por relevancia
  movies: [ { ...movie, score: 0.9 } ]
}
```

Implementada con `$text` + `$meta textScore` de MongoDB sobre índices de texto en los campos `title` y `genre` de ambas colecciones. Las búsquedas de `Game` y `Movie` se ejecutan en paralelo con `Promise.all`.

---

## Estados válidos

Los campos `status` de juegos y películas aceptan estos valores:

| Valor | Descripción |
|---|---|
| `playing` | Jugando / viendo actualmente |
| `completed` | Completado |
| `backlog` | Pendiente de jugar/ver |
| `dropped` | Abandonado |

---

## Códigos de respuesta

| Código | Situación |
|---|---|
| `200` | OK |
| `201` | Creado correctamente |
| `400` | Datos inválidos en el body o parámetros |
| `401` | Sin token o token inválido/expirado |
| `403` | Token válido pero sin permisos sobre el recurso |
| `404` | Recurso no encontrado |
| `409` | Conflicto — email ya registrado |
| `500` | Error interno del servidor |

---

## Seguridad

- Las contraseñas se almacenan con hash `bcrypt` (10 salt rounds)
- Los tokens JWT expiran en 7 días
- El campo `password` tiene `select: false` — nunca se devuelve en consultas
- El campo `owner` tiene `select: false` — nunca se expone al cliente
- Los usuarios solo pueden modificar o eliminar sus propios recursos (verificación de `owner` antes de cada operación)
- Validación de todos los inputs con `celebrate/Joi` antes de llegar al controlador

---

## Logs

En producción se generan dos archivos de log en formato JSON:

- `logs/request.log` — todas las solicitudes entrantes
- `logs/error.log` — todos los errores devueltos por la API

Estos archivos no se incluyen en el repositorio.

---

## Dominio público

🌐 **[api.windy.gammavortex.com](https://api.windy.gammavortex.com)**

Desplegado en Google Cloud con certificado SSL. Accesible vía HTTPS.

---

## Frontend

Este backend da servicio al frontend de Vortyx.

🔗 **App:** [windy.gammavortex.com](https://windy.gammavortex.com)
📁 **Repositorio:** [github.com/tu-usuario/vortyx-frontend](https://github.com/tu-usuario/vortyx-frontend)

---

## Créditos

Proyecto final — Bootcamp Desarrollo Web — [TripleTen](https://tripleten.com)
