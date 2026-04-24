# Vortyx Backend
 
API REST para la aplicación Vortyx — colección personal de juegos y películas.
 
## Stack
 
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcryptjs
- celebrate / Joi (validación)
- Winston (logs)
## Instalación
 
```bash
npm install
cp .env.example .env
# Edita .env con tus valores
npm run dev
```
 
## Variables de entorno
 
| Variable | Descripción |
|---|---|
| `MONGO_URI` | URI de conexión a MongoDB |
| `JWT_SECRET` | Clave secreta para firmar JWT |
| `PORT` | Puerto del servidor (default: 3000) |
| `NODE_ENV` | `development` o `production` |
 
## Endpoints
 
### Autenticación (públicos)
 
```
POST /signup   → Crear cuenta { name, email, password }
POST /signin   → Iniciar sesión { email, password } → { token }
```
 
### Usuarios (protegidos)
 
```
GET /users/me  → Datos del usuario autenticado
```
 
### Juegos (protegidos)
 
```
GET    /games              → Colección de juegos del usuario
POST   /games              → Agregar juego { rawg_id, title, genre, platform, status, imageUrl, playtime }
PATCH  /games/:gameId      → Actualizar estado { status }
DELETE /games/:gameId      → Eliminar juego
```
 
### Películas y series (protegidos)
 
```
GET    /movies             → Colección de películas/series del usuario
POST   /movies             → Agregar item { tmdb_id, title, genre, type, status, imageUrl }
PATCH  /movies/:movieId    → Actualizar estado { status }
DELETE /movies/:movieId    → Eliminar item
```
 
### Búsqueda indexada ⭐ (protegido)
 
```
GET /search?q=query  → Búsqueda en colección personal con índices de texto MongoDB
```
 
Devuelve `{ games: [...], movies: [...] }` ordenados por relevancia (`textScore`).
 
## Estados válidos
 
`playing` · `completed` · `backlog` · `dropped`
 
## Dominio público
 
> Se actualizará cuando esté desplegado en Google Cloud
