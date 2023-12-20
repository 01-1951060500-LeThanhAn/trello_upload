import mongoose from "mongoose";

const FileModelSchema = new mongoose.Schema(
  {
    pdf: String,
    title: String,
    cardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card",
    },
  },
  {
    collection: "PdfDetails",
  }
);

export default mongoose.model("PdfDetails", FileModelSchema);
