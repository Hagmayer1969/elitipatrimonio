// =============================================
//  ELITI PATRIMÔNIO — Helpers e Utilitários
// =============================================

// ---- Helpers de busca ----
function getUsuario(id) {
  return usuarios.find((u) => u.id === id);
}
function getUnidade(id) {
  return unidades.find((u) => u.id === id);
}
function getEquipsByUser(uid) {
  return equipamentos.filter((e) => e.usuario === uid);
}
function getEquipsByUnit(uid) {
  return equipamentos.filter((e) => e.unidade === uid);
}

// ---- Badge de Status ----
function statusBadge(s) {
  const c = STATUS[s];
  return `<span class="badge" style="color:${c.c};background:${c.b}">${c.l}</span>`;
}

// ---- Toast ----
function showToast(msg) {
  const t = document.createElement("div");
  t.style.cssText = `
    position:fixed;bottom:28px;right:28px;
    background:#1a1a1a;
    border:1px solid rgba(249,115,22,0.35);
    color:#F5F5F5;
    padding:12px 20px;
    border-radius:10px;
    font-family:'Syne',sans-serif;
    font-size:13px;font-weight:600;
    z-index:999;
    animation:fadeUp 0.3s ease;
    box-shadow:0 8px 30px rgba(0,0,0,0.5)
  `;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2800);
}

// ---- Relógio ----
function updateClock() {
  const el = document.getElementById("clock");
  if (!el) return;
  el.textContent = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
setInterval(updateClock, 1000);
updateClock();
