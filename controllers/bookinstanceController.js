const BookInstance = require('../models/bookinstance');
const Book = require('../models/book');
const { body, validationResult } = require('express-validator');

// Display list of all BookInstances
exports.bookinstance_list = function(req, res, next) {
  BookInstance.find()
    .populate('book')
    .exec((err, list_bookinstances) => {
      if (err) {
        return next(err);
      }

      res.render('bookinstance_list', {
        title: 'Book Instance List',
        bookinstance_list: list_bookinstances
      });
    });
};

//  Display detail page for a specific BookInstance
exports.bookinstance_detail = async function(req, res, next) {
  try {
    const bookinstance = await BookInstance.findById(req.params.id).populate(
      'book'
    );

    if (bookinstance === null) {
      const err = new Error('Book copy not found');
      err.status = 404;
      return next(err);
    }

    res.render('bookinstance_detail', {
      title: `Copy: ${bookinstance.book.title}`,
      bookinstance
    });
  } catch (err) {
    return next(err);
  }
};

// Display BookInstance create form on GET
exports.bookinstance_create_get = async function(req, res) {
  try {
    const books = await Book.find({}, 'title');

    res.render('bookinstance_form', {
      title: 'Create BookInstance',
      book_list: books
    });
  } catch (err) {
    return next(err);
  }
};

// Handle BookInstance create on POST
exports.bookinstance_create_post = [
  body('book', 'Book must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('imprint', 'Imprint must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('due_back', 'Invalid date')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body('status')
    .trim()
    .escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    const bookinstance = new BookInstance({ ...req.body });

    if (!errors.isEmpty()) {
      try {
        const books = await Book.find({}, 'title');

        res.render('bookinstance_form', {
          title: 'Create BookInstance',
          book_list: books,
          selected_book: bookinstance.book._id,
          errors: errors.array(),
          bookinstance
        });
      } catch (err) {
        if (err) {
          return next(err);
        }
      }
    } else {
      bookinstance.save((err) => {
        if (err) {
          return next(err);
        }

        res.redirect(bookinstance.url);
      });
    }
  }
];

// Display BookInstance delete form on GET
exports.bookinstance_delete_get = async function(req, res, next) {
  try {
    const bookinstance = await BookInstance.findById(req.params.id);

    if (bookinstance === null) {
      res.redirect('/catalog/bookinstances');
    }

    res.render('bookinstance_delete', {
      title: 'Delete Book Instance',
      bookinstance
    });
  } catch (err) {
    return next(err);
  }
};

// Handle BookInstance delete on POST
exports.bookinstance_delete_post = async function(req, res, next) {
  BookInstance.findByIdAndRemove(req.body.bookinstanceid, (err) => {
    if (err) {
      return next(err);
    }

    res.redirect('/catalog/bookinstances');
  });
};

// Display BookInstance update form on GET
exports.bookinstance_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle BookInstance update on POST
exports.bookinstance_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance update POST');
};
