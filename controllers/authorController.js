const Author = require('../models/author');
const Book = require('../models/book');
const { body, validationResult } = require('express-validator');
const moment = require('moment');

// display list of all authors
exports.author_list = function(req, res, next) {
  Author.find()
    .sort({ family_name: 'asc' })
    .exec((err, list_authors) => {
      if (err) {
        return next(err);
      }

      res.render('author_list', {
        title: 'Author List',
        author_list: list_authors
      });
    });
};

// Display detail page of a specific author
exports.author_detail = async function(req, res, next) {
  try {
    const author = Author.findById(req.params.id);
    const author_books = Book.find({ author: req.params.id }, 'title summary');

    const results = {};
    results.author = await author;
    results.author_books = await author_books;

    if (results.author === null) {
      const err = new Error('Author not found');
      err.status = 404;
      return next(err);
    }

    res.render('author_detail', {
      title: 'Author Detail',
      author: results.author,
      author_books: results.author_books
    });
  } catch (err) {
    return next(err);
  }
};

// Display author create form on GET
exports.author_create_get = function(req, res) {
  res.render('author_form', { title: 'Create Author' });
};

// Handle author create on POST
exports.author_create_post = [
  body('first_name')
    .isLength({ min: 1 })
    .trim()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.')
    .escape(),
  body('family_name')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Family name must be specified')
    .isAlphanumeric()
    .withMessage('Family name has non-alphanumeric characters.')
    .escape(),
  body('date_of_birth', 'Invalid date of birth')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body('date_of_death', 'Invalid date of death')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.body.date_of_birth = moment(new Date(req.body.date_of_birth)).format(
        'YYYY-MM-DD'
      );
      req.body.date_of_death = moment(new Date(req.body.date_of_death)).format(
        'YYYY-MM-DD'
      );

      res.render('author_form', {
        title: 'Create Author',
        author: req.body,
        errors: errors.array()
      });
    } else {
      const author = new Author({ ...req.body });

      author.save((err) => {
        if (err) {
          return next(err);
        }

        res.redirect(author.url);
      });
    }
  }
];

// Display author delete form on GET
exports.author_delete_get = async function(req, res, err) {
  try {
    const author = Author.findById(req.params.id);
    const author_books = Book.find({ author: req.params.id });

    const results = { author: await author, author_books: await author_books };

    if (results.author === null) {
      res.redirect('/catalog/authors');
    }

    res.render('author_delete', { title: 'Delete Author', ...results });
  } catch (err) {
    return next(err);
  }
};

// Handle author delete on POST
exports.author_delete_post = async function(req, res, next) {
  try {
    const author = Author.findById(req.body.authorid);
    const author_books = Book.find({ author: req.body.authorid });

    const results = { author: await author, author_books: await author_books };

    if (results.author_books.length > 0) {
      res.render('author_delete', { title: 'Delete Author', ...results });
    } else {
      Author.findByIdAndRemove(req.body.authorid, (err) => {
        if (err) {
          return next(err);
        }

        res.redirect('/catalog/authors');
      });
    }
  } catch (err) {
    return next(err);
  }
};

// Display author update form on GET
exports.author_update_get = async function(req, res, next) {
  try {
    const author = await Author.findById(req.params.id);

    if (author === null) {
      const err = new Error('Author not found');
      err.status = 404;
      return next(err);
    }

    res.render('author_form', { title: 'Update Author', author });
  } catch (err) {
    return next(err);
  }
};

// Handle author update on POST
exports.author_update_post = [
  body('first_name')
    .isLength({ min: 1 })
    .trim()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.')
    .escape(),
  body('family_name')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Family name must be specified')
    .isAlphanumeric()
    .withMessage('Family name has non-alphanumeric characters.')
    .escape(),
  body('date_of_birth', 'Invalid date of birth')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body('date_of_death', 'Invalid date of death')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.body.date_of_birth = moment(new Date(req.body.date_of_birth)).format(
        'YYYY-MM-DD'
      );
      req.body.date_of_death = moment(new Date(req.body.date_of_death)).format(
        'YYYY-MM-DD'
      );

      res.render('author_form', {
        title: 'Update Author',
        author: req.body,
        errors: errors.array()
      });
    } else {
      const author = new Author({ ...req.body, _id: req.params.id });

      Author.findByIdAndUpdate(req.params.id, author, {}, (err, theauthor) => {
        if (err) {
          return next(err);
        }

        res.redirect(theauthor.url);
      });
    }
  }
];
