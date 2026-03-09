import { useState, useCallback } from 'react';
import { useAction, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

interface Item { item: string; quantity: number; essential: boolean; }
interface Category { name: string; items: Item[]; }
interface PackResult { destination: string; categories: Category[]; tips: string[]; }

function PackPage() {
  const [dest, setDest] = useState(''); const [start, setStart] = useState(''); const [end, setEnd] = useState(''); const [activities, setActivities] = useState('');
  const [loading, setLoading] = useState(false); const [result, setResult] = useState<PackResult | null>(null);
  const generate = useAction(api.ai.generateList); const save = useMutation(api.functions.saveList);

  const handleGenerate = useCallback(async () => {
    if (!dest.trim() || !start || !end) return; setLoading(true);
    try {
      const r = await generate({ destination: dest.trim(), startDate: start, endDate: end, activities: activities || undefined }); setResult(r); await save({ ...r, activities: activities || undefined });
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [dest, start, end, activities, generate, save]);

  return (
    <div className="mc"><div className="pg">
      <h1 className="title">Smart <span className="a">Packing</span> List</h1>
      <p className="sub">Enter your destination and dates — get an AI-curated packing list with essential items.</p>
      <div className="row">
        <input className="inp" value={dest} onChange={e => setDest(e.target.value)} placeholder="Destination (e.g. Tokyo, Japan)" />
      </div>
      <div className="row">
        <input className="inp" type="date" value={start} onChange={e => setStart(e.target.value)} />
        <input className="inp" type="date" value={end} onChange={e => setEnd(e.target.value)} />
      </div>
      <input className="inp" value={activities} onChange={e => setActivities(e.target.value)} placeholder="Activities (optional): hiking, business meetings, beach..." />
      <button className="btn" disabled={!dest.trim() || !start || !end || loading} onClick={handleGenerate}>{loading ? '⏳ Packing...' : '🧳 Generate List'}</button>
      {loading && <div className="ld"><span /><span /><span /></div>}
      {result && !loading && <>
        {result.categories.map((cat, i) => (
          <div key={i} className="catg">
            <div className="catg-name">{cat.name}</div>
            {cat.items.map((item, j) => (
              <div key={j} className="item-row">
                <span className={item.essential ? 'item-essential' : ''}>{item.essential ? '⭐ ' : ''}{item.item}</span>
                <span className="item-qty">×{item.quantity}</span>
              </div>
            ))}
          </div>
        ))}
        {result.tips?.length > 0 && <div className="tips"><strong>💡 Tips:</strong><br />{result.tips.map((t, i) => <div key={i}>• {t}</div>)}</div>}
      </>}
    </div></div>
  );
}

function App() {
  return (<BrowserRouter><div className="app">
    <header className="hdr"><a href="/"><span style={{ fontSize: '1.5rem' }}>🧳</span><div><h1>PackingList</h1></div></a></header>
    <Routes><Route path="/" element={<PackPage />} /></Routes>
    <footer className="ftr">© {new Date().getFullYear()} PackingList — An AVS Media App.</footer>
  </div></BrowserRouter>);
}
export default App;
