"use client";
import { useEffect, useMemo, useState } from "react";
import { endpoints, ApiError } from "@/lib/api";
type Order = Awaited<ReturnType<typeof endpoints.practiceOrders>>[number];
type Ledger = Awaited<ReturnType<typeof endpoints.practiceLedger>>[number];
type Account = NonNullable<Awaited<ReturnType<typeof endpoints.practiceAccount>>>;
type Quote = Awaited<ReturnType<typeof endpoints.practiceQuote>>;
export default function PracticePage() {
 const [account,setAccount]=useState<Account|null>(null),[orders,setOrders]=useState<Order[]>([]),[ledger,setLedger]=useState<Ledger[]>([]),[quote,setQuote]=useState<Quote|null>(null);
 const [symbol,setSymbol]=useState("EURUSD"),[lot,setLot]=useState("0.10"),[busy,setBusy]=useState(false),[error,setError]=useState<string|null>(null);
 async function refresh(){const [a,o,l]=await Promise.all([endpoints.practiceAccount(),endpoints.practiceOrders(),endpoints.practiceLedger()]);setAccount(a);setOrders(o);setLedger(l);}
 useEffect(()=>{void Promise.resolve().then(refresh).catch(()=>setError("Unable to load practice trading."));},[]);
 useEffect(()=>{void Promise.all([endpoints.practiceQuote(symbol),endpoints.practiceHistory(symbol)]).then(([q,h])=>{setQuote(q);setHistory(h);}).catch(()=>{setQuote(null);setHistory([]);});},[symbol]);
 async function act(fn:()=>Promise<unknown>){setBusy(true);setError(null);try{await fn();await refresh();}catch(e){setError(e instanceof ApiError?String(e.detail):"Practice action failed.");}finally{setBusy(false);}}
 const closed=orders.filter(o=>o.status==="closed"),open=orders.filter(o=>o.status==="open");
 const realized=useMemo(()=>closed.reduce((n,o)=>n+Number(o.realized_pnl??0),0),[closed]);
 const wins=closed.filter(o=>Number(o.realized_pnl??0)>0).length,winRate=closed.length?Math.round(wins/closed.length*100):0;
 return <section className="px-4 md:px-8 py-10 max-w-7xl mx-auto space-y-8">
  <div className="glass-strong rounded-3xl p-8 space-y-3"><h1 className="text-3xl md:text-5xl font-bold">SAGZFX Practice Trading</h1><p style={{color:"var(--text-secondary)"}}>Virtual money only. Reference rates are educational mid-market data, not broker bid/ask prices and not real-time execution.</p>{error&&<p className="text-red-600 font-semibold">{error}</p>}</div>
  {!account?<button disabled={busy} onClick={()=>act(endpoints.createPracticeAccount)} className="px-6 py-3 rounded-xl brand-gradient text-white font-semibold">Activate Free $10,000 Practice Account</button>:<>
   <div className="grid grid-cols-2 md:grid-cols-5 gap-4"><Stat label="Balance" value={"USD "+Number(account.balance).toLocaleString()}/><Stat label="Open Positions" value={String(open.length)}/><Stat label="Closed Trades" value={String(closed.length)}/><Stat label="Realized P/L" value={"$"+realized.toFixed(2)}/><Stat label="Win Rate" value={winRate+"%"}/></div>
   <div className="rounded-2xl overflow-hidden border bg-slate-950 text-slate-100" style={{borderColor:"#273244"}}>
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-800">
          <div><div className="text-xs text-slate-400">SAGZFX PRACTICE · REFERENCE MARKET</div><div className="text-2xl font-bold">{symbol.slice(0,3)}/{symbol.slice(3)} <span className="text-base text-slate-400">{quote?.rate ?? "—"}</span></div></div>
          <div className="flex gap-2">{["EURUSD","GBPUSD","AUDUSD"].map(s=><button key={s} onClick={()=>setSymbol(s)} className={`px-3 py-2 rounded-lg text-sm ${symbol===s?"bg-slate-700":"bg-slate-900"}`}>{s.slice(0,3)}/{s.slice(3)}</button>)}</div>
        </div>
        <div className="grid lg:grid-cols-[1fr_280px]">
          <div className="p-4 min-w-0">
            <div className="flex gap-2 mb-3 text-xs text-slate-400"><span>1D reference candles</span><span>·</span><span>{quote?.provider ?? "Reference feed"}</span><span>·</span><span>{quote?.rate_date ?? "—"}</span></div>
            <MarketChart points={history}/>
          </div>
          <div className="border-t lg:border-t-0 lg:border-l border-slate-800 p-5 space-y-5">
            <div><div className="text-xs text-slate-400">Virtual balance</div><div className="text-2xl font-bold">${Number(account.balance).toLocaleString()}</div></div>
            <label className="block"><span className="text-xs text-slate-400">Lot size</span><input value={lot} onChange={e=>setLot(e.target.value)} type="number" min="0.01" max="10" step="0.01" className="mt-1 w-full rounded-lg bg-slate-900 border border-slate-700 p-3 text-white"/></label>
            <div className="grid grid-cols-2 gap-3">
              <button disabled={busy||!quote} onClick={()=>act(()=>endpoints.openPracticeOrder(symbol,"sell",lot))} className="py-4 rounded-xl bg-red-600 disabled:opacity-40 font-bold">SELL</button>
              <button disabled={busy||!quote} onClick={()=>act(()=>endpoints.openPracticeOrder(symbol,"buy",lot))} className="py-4 rounded-xl bg-emerald-600 disabled:opacity-40 font-bold">BUY</button>
            </div>
            <div className="text-xs text-slate-400 leading-5">Educational virtual fill at the displayed dated reference rate. Not broker bid/ask or real-time execution.</div>
          </div>
        </div>
      </div>

      <div className="glass rounded-3xl p-6 space-y-5"><div className="flex flex-wrap gap-3 items-end">
    <label className="space-y-1"><span className="text-xs">Pair</span><select value={symbol} onChange={e=>setSymbol(e.target.value)} className="block border rounded-lg p-3 bg-white"><option>EURUSD</option><option>GBPUSD</option><option>AUDUSD</option></select></label>
    <label className="space-y-1"><span className="text-xs">Lot size</span><input value={lot} onChange={e=>setLot(e.target.value)} type="number" min="0.01" max="10" step="0.01" className="block border rounded-lg p-3 bg-white w-32"/></label>
    <button disabled={busy} onClick={()=>act(()=>endpoints.openPracticeOrder(symbol,"buy",lot))} className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold">Buy</button>
    <button disabled={busy} onClick={()=>act(()=>endpoints.openPracticeOrder(symbol,"sell",lot))} className="px-6 py-3 rounded-xl bg-red-600 text-white font-bold">Sell</button></div>
    {quote&&<div className="rounded-xl border p-4"><b>{quote.symbol}: {quote.rate}</b> · {quote.provider} · rate date {quote.rate_date}<p className="text-xs mt-1" style={{color:"var(--text-muted)"}}>{quote.disclaimer}</p></div>}
   </div>
   <TradeTable title="Open Positions" orders={open} closeOrder={id=>act(()=>endpoints.closePracticeOrder(id))} busy={busy}/>
   <TradeTable title="Trade History" orders={closed} busy={busy}/>
   <div className="glass rounded-3xl p-6 space-y-4"><div className="flex justify-between items-center"><h2 className="text-2xl font-bold">Account Ledger</h2><button disabled={busy} onClick={()=>act(endpoints.resetPracticeAccount)} className="px-4 py-2 rounded-xl border font-semibold">Reset to $10,000</button></div>
    <div className="space-y-2">{ledger.map(e=><div key={e.entry_id} className="flex flex-wrap justify-between gap-2 border-b py-2 text-sm"><span>{e.entry_type.replaceAll("_"," ")} · {e.note??""}</span><span>{(Number(e.amount)>=0?"+":"")+"$"+Number(e.amount).toFixed(2)+" → $"+Number(e.balance_after).toFixed(2)}</span></div>)}</div>
   </div></>}
 </section>;
}
function Stat({label,value}:{label:string,value:string}){return <div className="glass rounded-xl p-4"><div className="text-xs uppercase" style={{color:"var(--text-muted)"}}>{label}</div><div className="text-xl font-bold">{value}</div></div>}
function TradeTable({title,orders,closeOrder,busy}:{title:string,orders:Order[],closeOrder?:(id:string)=>void,busy:boolean}){return <div className="glass rounded-3xl p-6 overflow-x-auto"><h2 className="text-2xl font-bold mb-4">{title}</h2>{orders.length===0?<p style={{color:"var(--text-muted)"}}>No {title.toLowerCase()} yet.</p>:<table className="w-full text-sm"><thead><tr className="text-left"><th>Pair</th><th>Side</th><th>Lot</th><th>Entry</th><th>Close</th><th>P/L</th><th>Reference date</th>{closeOrder&&<th/>}</tr></thead><tbody>{orders.map(o=><tr key={o.order_id} className="border-t"><td className="py-3">{o.symbol}</td><td>{o.side}</td><td>{o.lot_size}</td><td>{o.fill_price??"—"}</td><td>{o.close_price??"—"}</td><td>{o.realized_pnl==null?"—":"$"+Number(o.realized_pnl).toFixed(2)}</td><td>{o.quote_date??"—"}</td>{closeOrder&&<td><button disabled={busy} onClick={()=>closeOrder(o.order_id)} className="px-3 py-1 rounded-lg border font-semibold">Close</button></td>}</tr>)}</tbody></table>}</div>}
