const router = require('express').Router();
const { blogCtrl } = require('../controllers');
const mw = require('../middlewares');

router.get('/', [(req, res, next) => {
  mw.validator.validate(req, res, next, {
    query: {
      page: 'number',
      author: 'word',
      title: 'word',
      category: 'word',
      sort: 'word',
      order: 'order',
    },
  });
}, (req, res, next) => {
  mw.filter.validate(req, res, next, 'Blog');
}], blogCtrl.getAll);

router.get('/:blogId', (req, res, next) => {
  mw.validator.validate(req, res, next, {
    params: {
      blogId: 'number',
    },
  });
}, blogCtrl.get);

router.use('/', [mw.auth.haveSession,
  (req, res, next) => {
    mw.auth.havePermission(req, res, next, 'manageBlogs');
  }]);


router.post('/', [(req, res, next) => {
  mw.validator.validate(req, res, next, {
    body: {
      author: 'word,required',
      data: 'required',
      category: 'number,required',
      title: 'word,required',
    },
  });
}, (req, res, next) => {
  mw.reference.validate(req, res, next, {
    body: {
      category: 'categoryBlog',
    },
  });
}], blogCtrl.create);

router.put('/:blogId', [(req, res, next) => {
  mw.validator.validate(req, res, next, {
    body: {
      author: 'word',
      category: 'number',
      title: 'word',
    },
    params: {
      blogId: 'number',
    },
  });
}, (req, res, next) => {
  mw.reference.validate(req, res, next, {
    body: {
      category: 'categoryBlog',
    },
  });
}], blogCtrl.update);

router.delete('/:blogId', (req, res, next) => {
  mw.validator.validate(req, res, next, {
    params: {
      blogId: 'number',
    },
  });
}, blogCtrl.delete);

module.exports = router;
