const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Task = require('../src/models/Task');

// Configuración para tests
beforeAll(async () => {
  // Conectar a una base de datos de prueba
  const testMongoURI = process.env.MONGODB_URI_TEST || 'mongodb+srv://jhosephzc_db_user:Password2025@clustertodo.8ac6xi0.mongodb.net/todo-app?retryWrites=true&w=majority&appName=ClusterTodo'; //URL debe estar en el .env
  await mongoose.connect(testMongoURI);
});

afterAll(async () => {
  // Limpiar y cerrar conexión
  await Task.deleteMany({});
  await mongoose.connection.close();
});

afterEach(async () => {
  // Limpiar datos despues de cada test
  await Task.deleteMany({});
});

describe('Tasks API', () => {
  
  // Test 1: Health Check
  describe('GET /', () => {
    it('debe devolver el mensaje de bienvenida', async () => {
      const res = await request(app).get('/');
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('API');
    });
  });

  // Test 2: Obtener tareas vacías
  describe('GET /api/tasks', () => {
    it('debe devolver una lista vacía inicialmente', async () => {
      const res = await request(app).get('/api/tasks');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(0);
      expect(res.body.data).toEqual([]);
    });
  });

  // Test 3: Crear una tarea
  describe('POST /api/tasks', () => {
    it('debe crear una nueva tarea exitosamente', async () => {
      const newTask = {
        title: 'Tarea de prueba',
        description: 'Esta es una descripción de prueba'
      };

      const res = await request(app)
        .post('/api/tasks')
        .send(newTask);
      
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.title).toBe(newTask.title);
      expect(res.body.data.description).toBe(newTask.description);
      expect(res.body.data.completed).toBe(false);
    });

    it('debe fallar al crear una tarea sin título', async () => {
      const newTask = {
        description: 'Solo descripción'
      };

      const res = await request(app)
        .post('/api/tasks')
        .send(newTask);
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('title');
    });
  });

  // Test 4: Actualizar una tarea
  describe('PUT /api/tasks/:id', () => {
    it('debe actualizar una tarea existente', async () => {
      // Crear una tarea primero
      const task = await Task.create({
        title: 'Tarea original',
        description: 'Descripción original'
      });

      const updates = {
        title: 'Tarea actualizada',
        completed: true
      };

      const res = await request(app)
        .put(`/api/tasks/${task._id}`)
        .send(updates);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(updates.title);
      expect(res.body.data.completed).toBe(true);
    });

    it('debe fallar con un ID inexistente', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const res = await request(app)
        .put(`/api/tasks/${fakeId}`)
        .send({ title: 'Actualización' });
      
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('No existe');
    });
  });

  // Test 5: Eliminar una tarea
  describe('DELETE /api/tasks/:id', () => {
    it('debe eliminar una tarea existente', async () => {
      // Crear una tarea primero
      const task = await Task.create({
        title: 'Tarea a eliminar',
        description: 'Esta tarea será eliminada'
      });

      const res = await request(app)
        .delete(`/api/tasks/${task._id}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('eliminada');

      // Verificar que ya no existe
      const deletedTask = await Task.findById(task._id);
      expect(deletedTask).toBeNull();
    });

    it('debe fallar con un ID inexistente', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const res = await request(app)
        .delete(`/api/tasks/${fakeId}`);
      
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});