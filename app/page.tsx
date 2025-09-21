'use client';
import React, { useMemo, useState } from "react";
import { ShoppingCart, Filter, IndianRupee, Plus, Minus, Trash2, Search } from "lucide-react";

// ---------- Mock supplier catalog (you'd replace this with API/CSV ingests) ----------
const SUPPLIER_ITEMS = [
  { id: "m6-bolt-25", name: "Hex Bolt M6 x 25 (8.8)", category: "Fasteners", brand: "Generic", supplier: "SupplierA", supplierPrice: 6.2, uom: "pc", stock: 1200, mpn: "HB-M6-25-8.8" },
  { id: "m6-nylock", name: "Nylock Nut M6 (Zinc)", category: "Fasteners", brand: "Generic", supplier: "SupplierA", supplierPrice: 3.1, uom: "pc", stock: 1800, mpn: "NN-M6-Z" },
  { id: "cable-tie-200x4.8", name: "Cable Tie 200mm x 4.8mm (UV)", category: "Electrical", brand: "TyRap", supplier: "SupplierB", supplierPrice: 115.0, uom: "pack(100)", stock: 95, mpn: "CT-200-UV" },
  { id: "mc4-connector", name: "MC4 Solar Connector Pair", category: "Electrical", brand: "Stäubli-compatible", supplier: "SupplierC", supplierPrice: 89.0, uom: "pair", stock: 250, mpn: "MC4-Pair" },
  { id: "mccb-63a", name: "MCCB 3P 63A 25kA", category: "Switchgear", brand: "SwitchCo", supplier: "SupplierD", supplierPrice: 1680.0, uom: "pc", stock: 42, mpn: "MCCB-63A-3P" },
  { id: "din-rail-1m", name: "DIN Rail G-Profile 1m", category: "Electrical", brand: "RailCo", supplier: "SupplierB", supplierPrice: 145.0, uom: "pc", stock: 320, mpn: "DIN-G-1M" },
  { id: "relay-24v", name: "Control Relay 24VDC 2CO", category: "Automation", brand: "Relatron", supplier: "SupplierE", supplierPrice: 220.0, uom: "pc", stock: 70, mpn: "RELAY-24V-2CO" },
  { id: "bearing-6204zz", name: "Deep Groove Ball Bearing 6204ZZ", category: "Rotary", brand: "BearPro", supplier: "SupplierF", supplierPrice: 95.0, uom: "pc", stock: 210, mpn: "6204ZZ" },
];

// ---------- Margin rules (editable per category/brand) ----------
const DEFAULT_MARGIN_RULES = [
  { scope: "category", key: "Fasteners", marginPct: 25 },
  { scope: "category", key: "Electrical", marginPct: 30 },
  { scope: "category", key: "Automation", marginPct: 28 },
  { scope: "category", key: "Switchgear", marginPct: 22 },
  { scope: "category", key: "Rotary", marginPct: 18 },
  { scope: "brand", key: "SwitchCo", marginPct: 15 }, // brand override example
  { scope: "global", key: "*", marginPct: 20 },
];

function applyMargin(price: number, item: any, rules: any[]) {
  // Priority: brand > category > global
  const brandRule = rules.find(r => r.scope === "brand" && r.key === item.brand);
  const catRule = rules.find(r => r.scope === "category" && r.key === item.category);
  const globalRule = rules.find(r => r.scope === "global");
  const pct = brandRule?.marginPct ?? catRule?.marginPct ?? globalRule?.marginPct ?? 20;
  return +(price * (1 + pct / 100)).toFixed(2);
}

function inr(n: number) {
  return n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });
}

export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [marginRules, setMarginRules] = useState(DEFAULT_MARGIN_RULES);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [openCart, setOpenCart] = useState(false);

  const categories = useMemo(() => ["All", ...Array.from(new Set(SUPPLIER_ITEMS.map(i => i.category)))], []);

  const shownItems = SUPPLIER_ITEMS.filter(i =>
    (category === "All" || i.category === category) &&
    (query.trim() === "" || (i.name + i.mpn + i.brand).toLowerCase().includes(query.toLowerCase()))
  );

  const pricedItems = shownItems.map(i => ({
    ...i,
    listPrice: applyMargin(i.supplierPrice, i, marginRules),
  }));

  const subtotal = Object.entries(cart).reduce((acc, [id, qty]) => {
    const item = SUPPLIER_ITEMS.find(i => i.id === id);
    if (!item) return acc;
    const listPrice = applyMargin(item.supplierPrice, item, marginRules);
    return acc + listPrice * qty;
  }, 0);

  const gst = +(subtotal * 0.18).toFixed(2); // 18% placeholder; replace with HSN-specific rate
  const total = +(subtotal + gst).toFixed(2);

  function addToCart(id: string) {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setOpenCart(true);
  }
  function removeFromCart(id: string) {
    setCart(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="text-2xl font-extrabold tracking-tight">HardwareHub</div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 border rounded-xl px-3 py-2 bg-slate-100">
              <Search size={18} />
              <input
                className="bg-transparent outline-none w-72"
                placeholder="Search MPN, name, brand…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setOpenCart(!openCart)}
              className="relative inline-flex items-center gap-2 rounded-xl px-3 py-2 border shadow-sm hover:shadow bg-white"
            >
              <ShoppingCart size={18} />
              <span>Cart</span>
              {Object.keys(cart).length > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-indigo-600 text-white rounded-full px-2 py-0.5">
                  {Object.keys(cart).length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter size={18} />
          <select
            className="border rounded-xl px-3 py-2 bg-white"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="md:hidden flex-1">
          <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-white">
            <Search size={18} />
            <input
              className="bg-transparent outline-none w-full"
              placeholder="Search MPN, name, brand…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="ml-auto text-sm text-slate-600">
          Prices include your margin. Taxes shown at checkout. INR only.
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-24 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {pricedItems.map(item => (
          <article key={item.id} className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition p-4 flex flex-col">
            <div className="flex-1">
              <div className="text-sm text-slate-500">{item.brand} · {item.category}</div>
              <h3 className="text-base font-semibold leading-snug mt-1">{item.name}</h3>
              <div className="text-xs text-slate-500 mt-0.5">MPN: {item.mpn}</div>
              <div className="text-xs text-slate-500">UoM: {item.uom} | Stock: {item.stock}</div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-lg font-bold inline-flex items-center gap-1">
                <IndianRupee size={16} /> {item.listPrice.toLocaleString("en-IN")}
              </div>
              <button
                onClick={() => addToCart(item.id)}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <Plus size={16} /> Add
              </button>
            </div>
            <div className="text-xs text-slate-500 mt-2">Supplier: {item.supplier} · Cost: {inr(item.supplierPrice)}</div>
          </article>
        ))}
      </main>

      {/* Cart Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl border-l transition-transform duration-300 ${openCart ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="font-semibold">Your Cart</div>
          <button className="text-slate-500" onClick={() => setOpenCart(false)}>Close</button>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto h-[calc(100%-200px)]">
          {Object.keys(cart).length === 0 && (
            <div className="text-sm text-slate-500">Cart is empty.</div>
          )}
          {Object.entries(cart).map(([id, qty]) => {
            const item = SUPPLIER_ITEMS.find(i => i.id === id);
            if (!item) return null;
            const listPrice = applyMargin(item.supplierPrice, item, marginRules);
            return (
              <div key={id} className="flex items-center gap-3 border rounded-xl p-3">
                <div className="flex-1">
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs text-slate-500">{item.uom} · {inr(listPrice)} each</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 border rounded-xl" onClick={() => setCart(prev => ({ ...prev, [id]: Math.max(1, (prev[id]||1) - 1) }))}><Minus size={14} /></button>
                  <div className="w-8 text-center text-sm">{qty as number}</div>
                  <button className="p-2 border rounded-xl" onClick={() => setCart(prev => ({ ...prev, [id]: (prev[id]||0) + 1 }))}><Plus size={14} /></button>
                  <button className="p-2 border rounded-xl" onClick={() => removeFromCart(id)}><Trash2 size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-4 border-t space-y-1">
          <div className="flex justify-between text-sm"><span>Subtotal</span><span>{inr(subtotal)}</span></div>
          <div className="flex justify-between text-sm"><span>GST (placeholder 18%)</span><span>{inr(gst)}</span></div>
          <div className="flex justify-between text-base font-semibold"><span>Total</span><span>{inr(total)}</span></div>
          <button className="w-full mt-2 rounded-xl px-4 py-3 bg-emerald-600 text-white font-medium hover:bg-emerald-700">
            Continue to Checkout (Razorpay/UPI placeholder)
          </button>
          <div className="text-[11px] text-slate-500 mt-1">Checkout button is a placeholder — integrate Razorpay/PayU/Cashfree SDK for live payments.</div>
        </div>
      </div>

      {/* Margin Rule Editor */}
      <section className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white border shadow-2xl rounded-2xl w-[95%] md:w-[860px] max-h-[60vh] overflow-hidden">
        <details open>
          <summary className="px-4 py-3 cursor-pointer text-sm font-semibold bg-slate-100 border-b">Pricing Rules (Margin) — click to expand</summary>
          <div className="p-4 overflow-y-auto max-h-[45vh]">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2">Scope</th>
                  <th>Key</th>
                  <th>Margin %</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {marginRules.map((r, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="py-2">
                      <select
                        className="border rounded-lg px-2 py-1 bg-white"
                        value={r.scope}
                        onChange={(e) => {
                          const v = e.target.value as any;
                          setMarginRules(marginRules.map((x, i) => i===idx? {...x, scope: v}: x));
                        }}
                      >
                        <option value="global">global</option>
                        <option value="category">category</option>
                        <option value="brand">brand</option>
                      </select>
                    </td>
                    <td>
                      <input
                        className="border rounded-lg px-2 py-1 w-40"
                        value={r.key}
                        onChange={(e) => setMarginRules(marginRules.map((x, i) => i===idx? {...x, key: e.target.value}: x))}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="1"
                        className="border rounded-lg px-2 py-1 w-24"
                        value={r.marginPct}
                        onChange={(e) => setMarginRules(marginRules.map((x, i) => i===idx? {...x, marginPct: parseFloat(e.target.value)||0}: x))}
                      />
                    </td>
                    <td>
                      <button
                        className="text-xs px-3 py-1 border rounded-lg"
                        onClick={() => setMarginRules(rules => rules.filter((_, i) => i !== idx))}
                      >Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="mt-3 inline-flex items-center gap-2 px-3 py-2 border rounded-xl"
              onClick={() => setMarginRules(rules => [...rules, { scope: "category", key: "New", marginPct: 20 }])}
            >
              <Plus size={16}/> Add Rule
            </button>
            <p className="text-[11px] text-slate-500 mt-2">Brand overrides beat category; category beats global. Import HSN-specific GST in backend for accuracy.</p>
          </div>
        </details>
      </section>

      {/* Footer */}
      <footer className="mt-16 border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8 text-sm text-slate-600">
          <div className="font-semibold">Policies</div>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>Returns & Warranty</li>
            <li>Shipping & Delivery</li>
            <li>GST Invoicing & HSN Codes</li>
            <li>Terms of Service & Privacy</li>
          </ul>
          <div className="mt-3 text-xs">© {new Date().getFullYear()} HardwareHub — Demo storefront. Replace mock data with your catalog feed.</div>
        </div>
      </footer>
    </div>
  );
}
