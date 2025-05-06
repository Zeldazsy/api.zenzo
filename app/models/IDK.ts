import mongoose from "mongoose"

const PasteSchema = new mongoose.Schema({
  code: String,
  info: String,
  createdAt: { type: Date, default: Date.now },
})


export default mongoose.models.Paste || mongoose.model("Paste", PasteSchema)
