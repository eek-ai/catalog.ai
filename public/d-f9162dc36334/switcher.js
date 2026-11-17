// Design switcher: a thin bar on top of every variant page.
// Rendered in a shadow root so the variants' own CSS can't restyle it (and vice versa).
(() => {
  const DESIGNS = [
    ["v04.html", "04", "Основа", true],
    ["m01.html", "M1", "Без героя"],
    ["m02.html", "M2", "Рядок-заголовок"],
    ["m03.html", "M3", "Тонкий банер"],
    ["m04.html", "M4", "Пошук-герой"],
    ["m05.html", "M5", "Інфо в панелі"],
    ["m06.html", "M6", "Вибір замість героя"],
    ["m07.html", "M7", "Хлібні крихти"],
    ["m08.html", "M8", "Липка шапка"],
    ["m09.html", "M9", "Картка «Що це?»"],
    ["m10.html", "M10", "Темна шапка"],
  ];
  const file = location.pathname.split("/").pop() || "v04.html";
  const current = Math.max(0, DESIGNS.findIndex(([href]) => href === file));
  const hrefAt = (i) => DESIGNS[(i + DESIGNS.length) % DESIGNS.length][0];

  const host = document.createElement("div");
  host.style.cssText = "all:initial;display:block;position:relative;z-index:1";
  const root = host.attachShadow({ mode: "open" });
  root.innerHTML = `
    <style>
      :host{all:initial}
      nav{display:flex;align-items:center;gap:12px;height:44px;padding:0 16px;box-sizing:border-box;
          background:#111317;color:#e8eaee;font:500 13px/1 system-ui,-apple-system,"Segoe UI",sans-serif}
      .label{color:#8b919c;white-space:nowrap;flex:none}
      .list{display:flex;gap:4px;overflow-x:auto;scrollbar-width:none;flex:1;min-width:0}
      .list::-webkit-scrollbar{display:none}
      a{color:inherit;text-decoration:none;white-space:nowrap;padding:7px 10px;border-radius:6px;flex:none}
      a:hover{background:#262a31}
      a.on{background:#e8eaee;color:#111317}
      a b{font-weight:700;margin-right:5px}
      a .star{color:#f5c518;margin-left:4px}
      a.on .star{color:#b8860b}
      .arrows{display:flex;gap:4px;flex:none}
      .arrows a{padding:7px 9px;background:#1d2026}
      @media (max-width:1400px){.label{display:none}}
      @media (max-width:720px){.label{display:none} a span.name{display:none} a b{margin-right:0}}
    </style>
    <nav aria-label="Дизайни">
      <span class="label">Дизайни:</span>
      <div class="list">${DESIGNS.map(([href, num, name, finalist], i) =>
        `<a href="${href}" class="${i === current ? "on" : ""}" title="${name}${finalist ? " · фіналіст" : ""}"><b>${num}</b><span class="name">${name}</span>${finalist ? '<span class="star">★</span>' : ""}</a>`).join("")}</div>
      <div class="arrows">
        <a href="${hrefAt(current - 1)}" title="Попередній (←)">←</a>
        <a href="${hrefAt(current + 1)}" title="Наступний (→)">→</a>
      </div>
    </nav>`;
  document.body.prepend(host);
  root.querySelector("a.on")?.scrollIntoView({ inline: "center", block: "nearest" });

  // ← / → switch designs, unless the user is typing.
  document.addEventListener("keydown", (ev) => {
    if (ev.target.closest?.("input, textarea, select, [contenteditable]") || ev.metaKey || ev.ctrlKey || ev.altKey) return;
    if (ev.key === "ArrowLeft") location.href = hrefAt(current - 1);
    if (ev.key === "ArrowRight") location.href = hrefAt(current + 1);
  });
})();
