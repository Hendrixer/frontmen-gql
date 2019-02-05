import mongoose from 'mongoose'

const BookSchema = new mongoose.Schema({
  title: String,
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Author'
  }
})

const AuthorSchema = new mongoose.Schema({
  name: String
})

export const Book = mongoose.model('Book', BookSchema)
export const Author = mongoose.model('Author', AuthorSchema)
