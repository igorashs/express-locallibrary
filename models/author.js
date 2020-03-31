const mongoose = require('mongoose');
const moment = require('moment');

const { Schema } = mongoose;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, max: 100 },
  family_name: { type: String, required: true, max: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date }
});

AuthorSchema.virtual('name').get(function() {
  let fullname = '';

  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }

  return fullname;
});

AuthorSchema.virtual('lifespan').get(function() {
  return (
    this.date_of_death.getYear() - this.date_of_birth.getYear()
  ).toString();
});

AuthorSchema.virtual('url').get(function() {
  return `/catalog/author/${this._id}`;
});

AuthorSchema.virtual('date_of_birth_formatted').get(function() {
  return this.date_of_birth
    ? moment(this.date_of_birth).format('YYYY-MM-DD')
    : '';
});

AuthorSchema.virtual('date_of_death_formatted').get(function() {
  return this.date_of_death
    ? moment(this.date_of_death).format('YYYY-MM-DD')
    : '';
});

AuthorSchema.virtual('lifespan_formatted').get(function() {
  const birth = this.date_of_birth_formatted;
  const death = this.date_of_death_formatted;

  if (!birth && !death) {
    return '';
  }

  return `${birth ? birth : '...'} - ${death ? death : '...'}`;
});

module.exports = mongoose.model('Author', AuthorSchema);
