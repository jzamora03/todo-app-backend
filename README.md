# 📝 Todo App - Backend API

> API REST para gestión de tareas con Node.js, Express y MongoDB

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-success.svg)](https://www.mongodb.com/cloud/atlas)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

**🌐 Demo en vivo:** https://todo-app-backend-oj87.onrender.com

**⚠️ Nota importante:** El servidor usa el plan gratuito de Render, que se "duerme" después de 15 minutos de inactividad. La primera petición puede tardar ~30 segundos mientras el servidor "despierta", pero las siguientes son instantáneas. Esto es normal en el tier gratuito.

---

## 🚀 Inicio Rápido

### Opción 1: Usar la API en producción (sin instalación)

**Base URL:** `https://todo-app-backend-oj87.onrender.com`
```bash
# Obtener todas las tareas
curl https://todo-app-backend-oj87.onrender.com/api/tasks

# Crear una tarea
curl -X POST https://todo-app-backend-oj87.onrender.com/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Mi primera tarea","description":"Probar la API"}'
```

### Opción 2: Ejecutar localmente
```bash
# 1. Clonar el repositorio
git clone https://github.com/jzamora03/todo-app-backend.git
cd todo-app-backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tu MongoDB URI

# 4. Iniciar servidor
npm run dev
```

### Opción 3: Ejecutar con Docker
```bash
# Construir y ejecutar
docker build -t todo-app-backend .
docker run -p 5000:5000 --env-file .env todo-app-backend

# O usar Docker Compose
docker-compose up
```

---

## 📡 API Endpoints

**Base URL Local:** `http://localhost:5000/api`  
**Base URL Producción:** `https://todo-app-backend-oj87.onrender.com/api`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/tasks` | Obtener todas las tareas |
| `POST` | `/tasks` | Crear nueva tarea |
| `PUT` | `/tasks/:id` | Actualizar tarea |
| `DELETE` | `/tasks/:id` | Eliminar tarea |

### Ejemplos de Uso

#### 📥 Obtener todas las tareas
```bash
GET /api/tasks
```

**Respuesta:**
```json
{
  "success": true,
  "count": 2,
  "message": "2 tarea(s) encontrada(s)",
  "data": [
    {
      "_id": "675363a8e4b0c8a7d9f12345",
      "title": "Comprar leche",
      "description": "Ir al supermercado",
      "completed": false,
      "createdAt": "2025-12-06T10:30:00.000Z"
    }
  ]
}
```

#### ➕ Crear una tarea
```bash
POST /api/tasks
Content-Type: application/json

{
  "title": "Estudiar Node.js",
  "description": "Repasar Express y MongoDB"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Tarea creada exitosamente",
  "data": {
    "_id": "675363c1e4b0c8a7d9f12347",
    "title": "Estudiar Node.js",
    "description": "Repasar Express y MongoDB",
    "completed": false,
    "createdAt": "2025-12-06T12:00:00.000Z"
  }
}
```

#### ✏️ Actualizar una tarea
```bash
PUT /api/tasks/675363a8e4b0c8a7d9f12345
Content-Type: application/json

{
  "completed": true
}
```

#### 🗑️ Eliminar una tarea
```bash
DELETE /api/tasks/675363a8e4b0c8a7d9f12345
```

---

## 🧪 Probar con Postman

### 1. Importar colección

Descarga la colección de Postman: [[Todo App API.postman_collection.json](https://web.postman.co/workspace/My-Workspace~97868b8a-83ad-429d-8883-1710bf378974/collection/27355699-2f276c2c-89ab-4245-bf99-7b2ffde0acf8?sideView=agentMode)](./postman/)

O crea manualmente:

### 2. Configurar variables

En Postman, crea una variable de entorno:

- **Variable:** `base_url`
- **Valor Local:** `http://localhost:5000/api`
- **Valor Producción:** `https://todo-app-backend-oj87.onrender.com/api`

### 3. Requests básicos

**Obtener tareas:**
```
GET {{base_url}}/tasks
```

**Crear tarea:**
```
POST {{base_url}}/tasks
Body (raw JSON):
{
  "title": "Mi tarea",
  "description": "Descripción opcional"
}
```

**Actualizar tarea:**
```
PUT {{base_url}}/tasks/{TASK_ID}
Body (raw JSON):
{
  "completed": true
}
```

**Eliminar tarea:**
```
DELETE {{base_url}}/tasks/{TASK_ID}
```

---

## 🐳 Docker

### Construir y ejecutar
```bash
# Construir imagen
npm run docker:build

# Ejecutar contenedor
npm run docker:run

# Ver logs
npm run docker:logs

# Detener
npm run docker:stop
```

### Con Docker Compose
```bash
# Levantar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

### Comandos manuales
```bash
# Construir
docker build -t todo-app-backend .

# Ejecutar
docker run -d -p 5000:5000 --env-file .env todo-app-backend

# Ver logs
docker logs -f todo-backend
```

---

## 🧪 Testing
```bash
# Ejecutar tests una vez
npm run test:once

# Ejecutar tests en modo watch
npm test
```

**13 tests incluidos:**
- ✅ Health check
- ✅ CRUD completo
- ✅ Validaciones
- ✅ Manejo de errores

---

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm start` | Iniciar en producción |
| `npm run dev` | Iniciar en desarrollo (hot-reload) |
| `npm test` | Ejecutar tests en modo watch |
| `npm run test:once` | Ejecutar tests una vez |
| `npm run docker:build` | Construir imagen Docker |
| `npm run docker:run` | Ejecutar contenedor |
| `npm run compose:up` | Docker Compose up |

---

## 🔐 Variables de entorno

Crea un archivo `.env`:
```env
PORT=5000
MONGODB_URI=tu_connection_string_aqui
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

## 📁 Estructura del proyecto
```
todo-app-backend/
├── src/
│   ├── config/
│   │   └── database.js       # Configuración MongoDB
│   ├── controllers/
│   │   └── taskController.js # Lógica de negocio
│   ├── models/
│   │   └── Task.js           # Modelo de datos
│   ├── routes/
│   │   └── taskRoutes.js     # Rutas de la API
│   └── app.js                # Configuración Express
├── __tests__/
│   └── tasks.test.js         # Tests
├── Dockerfile                # Docker config
├── docker-compose.yml        # Docker Compose
├── package.json              # Dependencias
└── server.js                 # Entry point
```

---
