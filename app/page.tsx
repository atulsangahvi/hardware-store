
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



