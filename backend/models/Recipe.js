import mongoose from 'mongoose';

const NutrientsSchema = new mongoose.Schema({
  calories: Number,
  carbohydrateContent: Number,
  cholesterolContent: Number,
  fiberContent: Number,
  proteinContent: Number,
  saturatedFatContent: Number,
  sodiumContent: Number,
  sugarContent: Number,
  fatContent: Number,
}, { _id: false });

const RecipeSchema = new mongoose.Schema({
  cuisine: { type: String, index: true },
  title: { type: String, required: true, index: 'text' },
  rating: { type: Number, index: true },
  prep_time: Number,
  cook_time: Number,
  total_time: Number,
  description: String,
  nutrients: NutrientsSchema,
  serves: String,
}, { timestamps: true });

RecipeSchema.index({ rating: -1, total_time: 1 });

export default mongoose.model('Recipe', RecipeSchema);
