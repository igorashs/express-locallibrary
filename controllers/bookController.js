const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookinstance');
const { body, validationResult } = require('express-validator');

exports.index = async function(req, res) {
  let counts = {};
  const error = null;

  try {
    const book_count = Book.countDocuments({});
    const book_instance_count = BookInstance.countDocuments({});
    const book_instance_available_count = BookInstance.countDocuments({
      status: 'Available'
    });
    const author_count = Author.countDocuments({});
    const genre_count = Genre.countDocuments({});

    counts.book_count = await book_count;
    counts.book_instance_count = await book_instance_count;
    counts.book_instance_available_count = await book_instance_available_count;
    counts.author_count = await author_count;
    counts.genre_count = await genre_count;
  } catch (err) {
    console.log(err);
    error = err;
  } finally {
    res.render('index', { title: 'Local Library Home', error, data: counts });
  }
};

// Display list of all books
exports.book_list = function(req, res, next) {
  Book.find({}, 'title author')
    .populate('author')
    .exec((err, list_books) => {
      if (err) {
        return next(err);
      }

      res.render('book_list', { title: 'Book List', book_list: list_books });
    });
};

// Display detail page for a specific book
exports.book_detail = async function(req, res, next) {
  try {
    const book = Book.findById(req.params.id)
      .populate('author')
      .populate('genre');

    const book_instances = BookInstance.find({ book: req.params.id });

    const results = {};
    results.book = await book;
    results.book_instances = await book_instances;

    if (results.book === null) {
      const err = new Error('Book not found');
      err.status = 404;
      return next(err);
    }

    res.render('book_detail', {
      title: results.book.title,
      book: results.book,
      book_instances: results.book_instances
    });
  } catch (err) {
    return next(err);
  }
};

// Display book create form on GET
exports.book_create_get = async function(req, res, next) {
  try {
    const authors = Author.find();
    const genres = Genre.find();

    const results = {};
    results.authors = await authors;
    results.genres = await genres;

    res.render('book_form', { title: 'Create Book', ...results });
  } catch (err) {
    return next(err);
  }
};

// Handle book create on POST
exports.book_create_post = [
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === 'undefined') {
        req.body.genre = [];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
    }

    next();
  },
  body('title', 'Title must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('author', 'Author must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('summary', 'Summary must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('isbn', 'ISBN must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('genre.*').escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    const book = new Book({ ...req.body });

    if (!errors.isEmpty()) {
      try {
        const authors = Author.find();
        const genres = Genre.find();

        const results = {};
        results.authors = await authors;
        results.genres = await genres;

        results.genres.forEach((genre) => {
          if (book.genre.indexOf(genre._id) > -1) {
            genre.checked = 'true';
          }
        });

        res.render('book_form', {
          title: 'Create Book',
          ...results,
          book,
          errors: errors.array()
        });
      } catch (err) {
        return next(err);
      }
    } else {
      book.save((err) => {
        if (err) {
          return next(err);
        }

        res.redirect(book.url);
      });
    }
  }
];

// Display book delete form on GET
exports.book_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST
exports.book_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET
exports.book_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST
exports.book_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Book update POST');
};
