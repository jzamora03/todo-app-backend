const Task = require('../models/Task');
const mongoose = require('mongoose');

// ============================================
// Obtener todas las tareas
// ============================================
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      message: tasks.length === 0 
        ? 'No hay tareas registradas' 
        : `${tasks.length} tarea(s) encontrada(s)`,
      data: tasks
    });
  } catch (error) {
    console.error('Error en getTasks:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cargar las tareas'
    });
  }
};

// ============================================
// Crear una nueva tarea
// ============================================
const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validación del título
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El campo "title" es requerido'
      });
    }

    // Validación de longitud
    if (title.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'El título no puede tener más de 100 caracteres'
      });
    }

    if (description && description.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'La descripción no puede tener más de 500 caracteres'
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : ''
    });

    res.status(201).json({
      success: true,
      message: 'Tarea creada exitosamente',
      data: task
    });
  } catch (error) {
    console.error('Error en createTask:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la tarea'
    });
  }
};

// ============================================
// Actualizar una tarea existente
// ============================================
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'El ID proporcionado no es válido'
      });
    }

    // Validar que no esté vacío el body
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Debes enviar al menos un campo para actualizar'
      });
    }

    // Validaciones de los campos
    if (updates.title !== undefined) {
      if (!updates.title || updates.title.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'El título no puede estar vacío'
        });
      }
      if (updates.title.length > 100) {
        return res.status(400).json({
          success: false,
          message: 'El título no puede tener más de 100 caracteres'
        });
      }
      updates.title = updates.title.trim();
    }

    if (updates.description !== undefined) {
      if (updates.description.length > 500) {
        return res.status(400).json({
          success: false,
          message: 'La descripción no puede tener más de 500 caracteres'
        });
      }
      updates.description = updates.description.trim();
    }

    if (updates.completed !== undefined && typeof updates.completed !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'El campo "completed" debe ser true o false'
      });
    }

    const task = await Task.findByIdAndUpdate(
      id,
      updates,
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'No existe el ID que intentas actualizar'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tarea actualizada exitosamente',
      data: task
    });
  } catch (error) {
    console.error('Error en updateTask:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'El ID proporcionado no es válido'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al actualizar la tarea'
    });
  }
};

// ============================================
// Eliminar una tarea
// ============================================
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'El ID proporcionado no es válido'
      });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'No existe el ID que intentas eliminar'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tarea eliminada exitosamente',
      data: {
        id: task._id,
        title: task.title
      }
    });
  } catch (error) {
    console.error('Error en deleteTask:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'El ID proporcionado no es válido'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al eliminar la tarea'
    });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};