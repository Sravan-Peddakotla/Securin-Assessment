import React from 'react';
import RecipeTable from './components/RecipeTable.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Recipe Browser</h1>
        <RecipeTable />
      </div>
    </div>
  );
}
