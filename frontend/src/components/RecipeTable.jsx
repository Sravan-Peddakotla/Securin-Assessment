import React, { useEffect, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Drawer, TextField, MenuItem, Select, FormControl, InputLabel, Pagination } from '@mui/material';
import Rating from 'react-rating-stars-component';
import { getRecipes, searchRecipes } from '../api.js';
import RecipeDrawer from './RecipeDrawer.jsx';

const operatorOptions = ['>=', '<=', '=', '>', '<'];

export default function RecipeTable() {
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('browse');

  const [title, setTitle] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [ratingOp, setRatingOp] = useState('>=');
  const [ratingVal, setRatingVal] = useState('');
  const [timeOp, setTimeOp] = useState('<=');
  const [timeVal, setTimeVal] = useState('');
  const [calOp, setCalOp] = useState('<=');
  const [calVal, setCalVal] = useState('');

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  useEffect(() => {
    if (mode === 'browse') {
      setLoading(true);
      getRecipes(page, limit)
        .then(res => {
          setRecipes(res.data.data || []);
          setTotal(res.data.total || 0);
        })
        .finally(() => setLoading(false));
    }
  }, [page, limit, mode]);

  function runSearch() {
    setLoading(true);
    const params = {};
    if (title) params.title = title;
    if (cuisine) params.cuisine = cuisine;
    if (ratingVal !== '') params.rating = `${ratingOp}${ratingVal}`;
    if (timeVal !== '') params.total_time = `${timeOp}${timeVal}`;
    if (calVal !== '') params.calories = `${calOp}${calVal}`;

    searchRecipes(params)
      .then(res => {
        const data = res.data.data || [];
        setRecipes(data);
        setTotal(data.length);
        setPage(1);
      })
      .finally(() => setLoading(false));
  }

  function clearSearch() {
    setTitle(''); setCuisine(''); setRatingVal(''); setTimeVal(''); setCalVal('');
    setMode('browse'); setPage(1);
  }

  return (
    <div className="space-y-4">
      <Paper className="p-4">
        <div className="grid md:grid-cols-5 gap-4">
          <TextField label="Title contains" value={title} onChange={e => setTitle(e.target.value)} size="small" />
          <TextField label="Cuisine (exact)" value={cuisine} onChange={e => setCuisine(e.target.value)} size="small" />

          <div className="flex gap-2 items-center">
            <FormControl size="small" className="w-24">
              <InputLabel>Rating</InputLabel>
              <Select label="Rating" value={ratingOp} onChange={e => setRatingOp(e.target.value)}>
                {operatorOptions.map(op => <MenuItem key={op} value={op}>{op}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField type="number" label="Value" value={ratingVal} onChange={e => setRatingVal(e.target.value)} size="small" className="w-28" />
          </div>

          <div className="flex gap-2 items-center">
            <FormControl size="small" className="w-24">
              <InputLabel>Total Time</InputLabel>
              <Select label="Total Time" value={timeOp} onChange={e => setTimeOp(e.target.value)}>
                {operatorOptions.map(op => <MenuItem key={op} value={op}>{op}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField type="number" label="mins" value={timeVal} onChange={e => setTimeVal(e.target.value)} size="small" className="w-28" />
          </div>

          <div className="flex gap-2 items-center">
            <FormControl size="small" className="w-24">
              <InputLabel>Calories</InputLabel>
              <Select label="Calories" value={calOp} onChange={e => setCalOp(e.target.value)}>
                {operatorOptions.map(op => <MenuItem key={op} value={op}>{op}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField type="number" label="kcal" value={calVal} onChange={e => setCalVal(e.target.value)} size="small" className="w-28" />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button className="px-3 py-2 bg-black text-white rounded" onClick={() => { setMode('search'); runSearch(); }}>Search</button>
          <button className="px-3 py-2 border rounded" onClick={clearSearch}>Clear</button>
        </div>
      </Paper>

      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Cuisine</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Total Time (min)</TableCell>
                <TableCell>Serves</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recipes.map((r, idx) => (
                <TableRow key={idx} hover className="cursor-pointer" onClick={() => setSelected(r)}>
                  <TableCell title={r.title} className="max-w-[250px] truncate">{r.title}</TableCell>
                  <TableCell>{r.cuisine || '-'}</TableCell>
                  <TableCell>
                    {typeof r.rating === 'number' ? (
                      <Rating value={r.rating} isHalf={true} edit={false} size={18} />
                    ) : '—'}
                  </TableCell>
                  <TableCell>{r.total_time ?? '—'}</TableCell>
                  <TableCell>{r.serves || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {!loading && recipes.length === 0 && (
          <div className="p-4 text-center text-gray-600">
            {mode === 'search' ? 'No results found' : 'No data available'}
          </div>
        )}
      </Paper>

      {mode === 'browse' && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Per page:</span>
            <Select size="small" value={limit} onChange={e => setLimit(Number(e.target.value))}>
              {[15, 20, 30, 40, 50].map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}
            </Select>
          </div>
          <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} />
          <span className="text-sm text-gray-600">Total: {total}</span>
        </div>
      )}

      <Drawer anchor="right" open={!!selected} onClose={() => setSelected(null)}>
        {selected && <RecipeDrawer recipe={selected} onClose={() => setSelected(null)} />}
      </Drawer>
    </div>
  );
}
