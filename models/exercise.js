const db = require('../db');

class Exercise {
  constructor({
    id, name, difficulty, executionTime, trainingType, bodyPart,
  }) {
    this.id = id;
    this.name = name;
    this.difficulty = difficulty;
    this.executionTime = executionTime;
    this.trainingType = trainingType;
    this.bodyPart = bodyPart;
  }

  static async getAll() {
    const data = await db.getAll('v_exercises');
    const response = [];
    data.forEach((row) => {
      response.push(new Exercise(row));
    });
    return response;
  }

  static async get(exerciseId) {
    const data = await db.get('v_exercises', exerciseId);
    return data.length !== 0 ? new Exercise(data[0]) : [];
  }

  static async create({
    name, difficulty, executionTime, trainingType, bodyPart,
  }) {
    let response;
    try {
      response = await db.insert('exercises', {
        name, difficulty, executionTime, trainingType, bodyPart,
      });
    } catch (err) {
      throw err;
    }

    const id = response.insertId;
    if (id > 0) {
      return new Exercise({
        id, difficulty, executionTime, trainingType, bodyPart,
      });
    }
    return [];
  }

  static async update(exerciseId, fields) {
    let res;
    try {
      res = await db.update('exercises', fields, exerciseId);
    } catch (err) {
      throw err;
    }
    return res.affectedRows > 0;
  }

  static delete(exerciseId) {

  }
}

module.exports = Exercise;