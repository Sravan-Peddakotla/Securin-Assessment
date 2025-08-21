import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Recipe from '../models/Recipe.js';

const INPUT_PATH = process.env.JSON_PATH || path.resolve('../../US_recipes.json');

function toNullIfNaN(x) {
  if (x === null || x === undefined) return null;
  const n = Number(x);
  return Number.isNaN(n) ? null : n;
}

function cleanRecipe(r) {
  return {
    cuisine: r.cuisine ?? null,
    title: r.title || 'Untitled',
    rating: toNullIfNaN(r.rating),
    prep_time: toNullIfNaN(r.prep_time),
    cook_time: toNullIfNaN(r.cook_time),
    total_time: toNullIfNaN(r.total_time),
    description: r.description ?? null,
    nutrients: r.nutrients ? {
      calories: toNullIfNaN(r.nutrients.calories),
      carbohydrateContent: toNullIfNaN(r.nutrients.carbohydrateContent),
      cholesterolContent: toNullIfNaN(r.nutrients.cholesterolContent),
      fiberContent: toNullIfNaN(r.nutrients.fiberContent),
      proteinContent: toNullIfNaN(r.nutrients.proteinContent),
      saturatedFatContent: toNullIfNaN(r.nutrients.saturatedFatContent),
      sodiumContent: toNullIfNaN(r.nutrients.sodiumContent),
      sugarContent: toNullIfNaN(r.nutrients.sugarContent),
      fatContent: toNullIfNaN(r.nutrients.fatContent),
    } : undefined,
    serves: r.serves ?? null,
  };
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const raw = fs.readFileSync(INPUT_PATH, 'utf-8');
  const json = JSON.parse(raw);
  const list = Array.isArray(json) ? json : Object.values(json);
  const cleaned = list.map(cleanRecipe);

  await Recipe.deleteMany({});
  const result = await Recipe.insertMany(cleaned, { ordered: false });
  console.log(`Inserted ${result.length} recipes`);

  await Recipe.syncIndexes();
  await mongoose.disconnect();
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
