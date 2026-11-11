// Tvorba prvků přes DOM API: text vždy jako textNode, události jen jako funkce.
export function el(tag, props = {}, ...deti) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k.startsWith("on")) {
      if (typeof v === "function") e.addEventListener(k.slice(2), v);
      continue;
    }
    if (k === "class") e.className = String(v);
    else if (v === true) e.setAttribute(k, "");
    else if (v !== false && v != null) e.setAttribute(k, String(v));
  }
  for (const d of deti.flat()) e.append(d instanceof Node ? d : document.createTextNode(String(d)));
  return e;
}

export function vymen(koren, ...deti) {
  koren.replaceChildren(...deti.flat());
}
