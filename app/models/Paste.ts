import mongoose from "mongoose"

const PasteSchema = new mongoose.Schema({
  code: String,
  info: String,
  language: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 7 // ลบใน 7 วัน
  }
})

export default mongoose.models.Paste || mongoose.model("Paste", PasteSchema)
