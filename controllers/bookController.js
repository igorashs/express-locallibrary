const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookinstance');

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
exports.book_create_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Book create GET');
};

// Handle book create on POST
exports.book_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Book create POST');
};

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
