import React, { useState } from 'react';

export default function RecipeDrawer({ recipe, onClose }) {
  const [expandTimes, setExpandTimes] = useState(false);
  const n = recipe.nutrients || {};

  return (
    <div className="w-[420px] p-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{recipe.title}</h2>
          <p className="text-gray-600">{recipe.cuisine || '—'}</p>
        </div>
        <button className="text-sm text-gray-500" onClick={onClose}>Close</button>
      </div>

      <div className="mt-4 space-y-2">
        <div>
          <div className="text-sm text-gray-500">Description</div>
          <div className="text-gray-800 whitespace-pre-wrap">{recipe.description || '—'}</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-sm text-gray-500">Total Time</div>
            <div>{recipe.total_time ?? '—'} min</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Serves</div>
            <div>{recipe.serves || '—'}</div>
          </div>
        </div>

        <button className="text-sm underline" onClick={() => setExpandTimes(v => !v)}>
          {expandTimes ? 'Hide prep/cook time' : 'Show prep/cook time'}
        </button>
        {expandTimes && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-sm text-gray-500">Prep Time</div>
              <div>{recipe.prep_time ?? '—'} min</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Cook Time</div>
              <div>{recipe.cook_time ?? '—'} min</div>
            </div>
          </div>
        )}

        <div className="mt-2">
          <div className="text-sm text-gray-500 mb-1">Nutrients</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                {[
                  ['calories', n.calories],
                  ['carbohydrateContent', n.carbohydrateContent],
                  ['cholesterolContent', n.cholesterolContent],
                  ['fiberContent', n.fiberContent],
                  ['proteinContent', n.proteinContent],
                  ['saturatedFatContent', n.saturatedFatContent],
                  ['sodiumContent', n.sodiumContent],
                  ['sugarContent', n.sugarContent],
                  ['fatContent', n.fatContent],
                ].map(([k, v]) => (
                  <tr key={k} className="border-b last:border-b-0">
                    <td className="py-1 pr-2 text-gray-600">{k}</td>
                    <td className="py-1">{v ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
