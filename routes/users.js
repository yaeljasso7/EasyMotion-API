const router = require('express').Router();
const { usersCtrl } = require('../controllers');
const middlewares = require('../middlewares');
const { auth } = require('../middlewares');

router.get('/', auth.isLogin, usersCtrl.getAll);

router.post('/login', usersCtrl.addToken);

router.post('/hola', (req, res) => {
  console.log(req.session);
  res.send('hola');
});

router.get('/:userId', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    params: {
      userId: 'number',
    },
  });
}, usersCtrl.get);

router.post('/', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    body: {
      name: 'word,required',
      mail: 'email,required',
      mobile: 'iscellphone',
      height: 'isHeight,required',
      weight: 'isWeight,required',
    },
  });
}, usersCtrl.create);

router.put('/:userId', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    params: {
      userId: 'number',
    },
    body: {
      mobile: 'iscellphone',
      height: 'isHeight',
      weight: 'isWeight',
    },
  });
}, usersCtrl.update);

router.delete('/:userId', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    params: {
      userId: 'number',
    },
  });
}, usersCtrl.delete);

router.post('/:userId/calendars', [(req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    params: {
      userId: 'number',
    },
    body: {
      calendarId: 'number',
    },
  });
}, (req, res, next) => {
  middlewares.reference.validate(req, res, next, {
    body: {
      calendarId: 'Calendar',
    },
  });
}], usersCtrl.addCalendar);

router.delete('/:userId/calendars', [(req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    params: {
      userId: 'number',
    },
    body: {
      calendarId: 'number',
    },
  });
}, (req, res, next) => {
  middlewares.reference.validate(req, res, next, {
    body: {
      calendarId: 'Calendar',
    },
  });
}], usersCtrl.removeCalendar);

router.get('/:userId/calendars', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    params: {
      userId: 'number',
    },
  });
}, usersCtrl.getCalendars);

router.get('/:userId/progress', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    params: {
      userId: 'number',
    },
  });
}, usersCtrl.getProgress);

router.post('/:userId/progress', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    params: {
      userId: 'number',
    },
    body: {
      weight: 'number,isWeight',
      height: 'number,isHeight',
    },
  });
}, usersCtrl.addProgress);

module.exports = router;
