const Author = require('../models/author');
const Book = require('../models/book');

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
  res.send('NOT IMPLEMENTED: Author create GET');
};

// Handle author create on POST
exports.author_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Author create POST');
};

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
