const Author = require('../models/author');

// display list of all authors
exports.author_list = function(req, res) {
  res.send('NOT IMPLEMENTED: Author list');
};

// Display detail page of a specific author
exports.author_detail = function(req, res) {
  res.send(`NOT IMPLEMENTED: Author detail: ${req.params.id}`);
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
