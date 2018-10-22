const { Calendar, ResponseMaker } = require('../models');

// FIXME Falta documentacion en todos los metodos
// FIXME Todos los metodos asincronos a base de datos deberian manejar
// los errores a traves de un try-catch

class CalendarCtrl {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
    this.addRoutine = this.addRoutine.bind(this);
    this.removeRoutine = this.removeRoutine.bind(this);
    this.type = 'calendar';
  }

  async getAll(req, res, next) {
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;
    try {
      const data = await Calendar.getAll(page);

      if (data.length === 0) {
        return res.status(204)
          .send(ResponseMaker.noContent(this.type));
      }
      return res.send(ResponseMaker.paginated(page, this.type, data));
    } catch (err) {
      return next(err);
    }
  }

  async get(req, res, next) {
    const id = req.params.calendarId;
    try {
      const calendar = await Calendar.get(id);
      if (calendar.length === 0) {
        return res.status(404)
          .send(ResponseMaker.notFound(this.type, { id }));
      }
      return res.send(ResponseMaker.ok('Found', this.type, calendar));
    } catch (err) {
      return next(err);
    }
  }

  async create(req, res, next) {
    try {
      const data = await Calendar.create(req.body);
      if (data.length !== 0) {
        return res.status(201)
          .send(ResponseMaker.created(this.type, data));
      }
      return res.status(409)
        .send(ResponseMaker.conflict(this.type, data));
    } catch (err) {
      // res.status(409).send(`Insert error: ${e.duplicated.message}`);
      return next(err);
    }
  }

  async delete(req, res, next) {
    const id = req.params.calendarId;
    try {
      const data = await Calendar.get(id);

      if (data.length === 0) {
        return res.status(404)
          .send(ResponseMaker.notFound(this.type, { id }));
      }

      const deleted = await data.delete();

      if (deleted) {
        return res.status(200)
          .send(ResponseMaker.ok('Deleted', this.type, { id }));
      }
      return res.status(409)
        .send(ResponseMaker.conflict(this.type, req.body));
    } catch (err) {
      return next(err);
    }
  }

  async update(req, res, next) {
    const id = req.params.calendarId;
    try {
      const data = await Calendar.get(id);

      if (data.length === 0) {
        return res.status(404)
          .send(ResponseMaker.notFound(this.type, { id }));
      }

      const updated = await data.update(req.body);
      if (updated) {
        return res.status(200)
          .send(ResponseMaker.ok('Updated', this.type, { ...data, ...req.body }));
      }
      return res.status(409)
        .send(ResponseMaker.conflict(this.type, req.body));
    } catch (err) {
      return next(err);
    }
  }

  async addRoutine(req, res, next) {
    const { calendarId } = req.params;
    try {
      const calendar = await Calendar.get(calendarId);
      if (calendar.length === 0) {
        return res.status(404)
          .send(ResponseMaker.notFound(this.type, { id: calendarId }));
      }
      const added = await calendar.addRoutine(req.body);
      if (added) {
        return res.status(201)
          .send(ResponseMaker.created('routines_calendars', {
            calendarId: calendar.id,
            ...req.body,
          }));
      }
      return res.status(409)
        .send(ResponseMaker.conflict('routines_calendars', req.body));
    } catch (err) {
      return next(err);
    }
  }

  async removeRoutine(req, res, next) {
    const { calendarId } = req.params;
    try {
      const calendar = await Calendar.get(calendarId);
      if (calendar.length === 0) {
        return res.status(404)
          .send(ResponseMaker.notFound(this.type, { id: calendarId }));
      }
      const deleted = await calendar.removeRoutine(req.body);
      if (deleted) {
        return res.status(200)
          .send(ResponseMaker.ok('Deleted', 'routines_calendars', req.body));
      }
      return res.status(404)
        .send(ResponseMaker.notFound('routines_calendars', req.body));
    } catch (err) {
      return next(err);
    }
  }
}
module.exports = new CalendarCtrl();