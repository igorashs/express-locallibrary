const Author = require('../models/author');
const Book = require('../models/book');
const validator = require('express-validator');

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
  validator
    .body('first_name')
    .isLength({ min: 1 })
    .trim()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.')
    .escape(),
  validator
    .body('family_name')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Family name must be specified')
    .isAlphanumeric()
    .withMessage('Family name has non-alphanumeric characters.')
    .escape(),
  validator
    .body('date_of_birth', 'Invalid date of birth')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  validator
    .body('date_of_death', 'Invalid date of death')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  (req, res, next) => {
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      res.render('author_form', {
        title: 'Create Author',
        author: req.body,
        errors: errors.array()
      });
    } else {
      const author = new Author(
        ({ first_name, family_name, date_of_birth, date_of_death } = req.body)
      );

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
exports.author_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle author delete on POST
exports.author_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display author update form on GET
exports.author_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle author update on POST
exports.author_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Author update POST');
};
