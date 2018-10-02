const { Exercise } = require('../models');

class ExercisesCtrl {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
  }

  async getAll(req, res) {
    const data = await Exercise.getExercises();
    const json = {
      data,
      total_count: data.length,
      per_page: data.length,
      page: 0,
    };
    res.status(data.length ? 200 : 204).send(json);
  }

  async get(req, res) {
    const data = await Exercise.getExercise(req.params.exerciseId);
    const json = {
      data,
    };
    res.status(data.length ? 200 : 204).send(json);
  }

  async create(req, res, next) {
    try {
      const data = await Exercise.createExercise(req.body);
      res.status(201).send(data);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    const id = req.params.exerciseId;
    console.log('update-ctrl');
    const data = await Exercise.getExercise(id);
    if (data.length === 0) {
      res.status(404).send(data);
    }
    let status;
    try {
      const updated = await Exercise.updateExercise(id, req.body);
      status = updated ? 200 : 409;
    } catch (err) {
      res.status(409);
      next(err);
    }
    res.status(status).send(data);
  }

  delete (req, res, next) {

  }
}

module.exports = new ExercisesCtrl();
