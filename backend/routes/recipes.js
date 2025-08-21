import express from 'express';
import Recipe from '../models/Recipe.js';

const router = express.Router();

function parseNumericFilter(input) {
  if (input == null || input === '') return null;
  const m = String(input).match(/^\s*(<=|>=|=|<|>)?\s*(-?\d+(?:\.\d+)?)\s*$/);
  if (!m) return null;
  const [, op = '=', valueStr] = m;
  const value = Number(valueStr);
  if (Number.isNaN(value)) return null;
  const map = { '=': '$eq', '<=': '$lte', '>=': '$gte', '<': '$lt', '>': '$gt' };
  return { [map[op]]: value };
}

router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Recipe.find({}).sort({ rating: -1 }).skip(skip).limit(limit).lean(),
      Recipe.countDocuments({})
    ]);

    res.json({ page, limit, total, data });
  } catch (err) {
    next(err);
  }
});

router.get('/search', async (req, res, next) => {
  try {
    const { calories, title, cuisine, total_time, rating } = req.query;
    const query = {};

    const calFilter = parseNumericFilter(calories);
    if (calFilter) query['nutrients.calories'] = calFilter;

    const timeFilter = parseNumericFilter(total_time);
    if (timeFilter) query.total_time = timeFilter;

    const ratingFilter = parseNumericFilter(rating);
    if (ratingFilter) query.rating = ratingFilter;

    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    if (cuisine) {
      query.cuisine = cuisine;
    }

    const data = await Recipe.find(query).collation({ locale: 'en', strength: 2 }).limit(200).lean();
    res.json({ data });
  } catch (err) {
    next(err);
  }
});

export default router;
