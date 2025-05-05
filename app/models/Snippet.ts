import mongoose from 'mongoose'

const SnippetSchema = new mongoose.Schema({
  code: String,
  info: String,
}, { timestamps: true })

export default mongoose.models.Snippet || mongoose.model('Snippet', SnippetSchema)
