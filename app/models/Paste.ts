import mongoose from "mongoose"

const PasteSchema = new mongoose.Schema({
  code: String,
  info: String,
})

export default mongoose.models.Paste || mongoose.model("Paste", PasteSchema)