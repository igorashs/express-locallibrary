const Genre = require('../models/genre');
const Book = require('../models/book');
const { body, validationResult } = require('express-validator');

// Display list of all Genre
exports.genre_list = function(req, res, next) {
  Genre.find()
    .sort({ name: 'asc' })
    .exec((err, list_genres) => {
      if (err) {
        return next(err);
      }

      res.render('genre_list', {
        title: 'Genre List',
        genre_list: list_genres
      });
    });
};

//  Display detail page for a specific Genre
exports.genre_detail = async function(req, res, next) {
  try {
    const genre = Genre.findById(req.params.id);
    const genre_books = Book.find({ genre: req.params.id });

    const results = {};
    results.genre = await genre;
    results.genre_books = await genre_books;

    if (results.genre === null) {
      const err = new Error('Genre not found');
      err.status = 404;
      return next(err);
    }

    res.render('genre_detail', {
      title: 'Genre Detail',
      genre: results.genre,
      genre_books: results.genre_books
    });
  } catch (err) {
    return next(err);
  }
};

// Display Genre create form on GET
exports.genre_create_get = function(req, res) {
  res.render('genre_form', { title: 'Create Genre' });
};

// Handle Genre create on POST
exports.genre_create_post = [
  body('name', 'Genre name required')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      res.render('genre_form', {
        title: 'Create Genre',
        genre,
        errors: errors.array()
      });
    } else {
      Genre.findOne({ name: req.body.name }).exec((err, found_genre) => {
        if (err) {
          return next(err);
        }

        if (found_genre) {
          res.redirect(found_genre.url);
        } else {
          genre.save((err) => {
            if (err) {
              return next(err);
            }

            res.redirect(genre.url);
          });
        }
      });
    }
  }
];

// Display Genre delete form on GET
exports.genre_delete_get = async function(req, res, next) {
  try {
    const genre = Genre.findById(req.params.id);
    const books = Book.find({ genre: req.params.id });

    const results = {
      genre: await genre,
      books: await books
    };

    if (results.genre === null) {
      res.redirect('/catalog/genres');
    }

    res.render('genre_delete', { title: 'Delete Genre', ...results });
  } catch (err) {
    return next(err);
  }
};

// Handle Genre delete on POST
exports.genre_delete_post = async function(req, res, next) {
  try {
    const genre = Genre.findById(req.body.genreid);
    const books = Book.find({ genre: [req.params.id] });

    const results = {
      genre: await genre,
      books: await books
    };

    if (results.books.length > 0) {
      res.render('genre_delete', { title: 'Delete Genre', ...results });
    } else {
      Genre.findByIdAndRemove(req.body.genreid, (err) => {
        if (err) {
          return next(err);
        }

        res.redirect('/catalog/genres');
      });
    }
  } catch (err) {
    return next(err);
  }
};

// Display Genre update form on GET
exports.genre_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST
exports.genre_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre update POST');
};
