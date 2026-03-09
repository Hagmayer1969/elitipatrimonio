// =============================================
//  ELITI PATRIMÔNIO — Alunos (Usuários)
// =============================================

const AVATAR_COLORS = [
  "#F97316", "#3B82F6", "#10B981",
  "#8B5CF6", "#F59E0B", "#EC4899",
];

function renderUsuarios() {
  const busca      = document.getElementById("userSearch")?.value.toLowerCase() || "";
  const unitFilter = document.getElementById("userUnitFilter")?.value || "";

  // Popular select de unidade (lazy, só na 1ª chamada)
  const unitSel = document.getElementById("userUnitFilter");
  if (unitSel && unitSel.options.length <= 1) {
    unitSel.innerHTML =
      '<option value="">Todas as unidades</option>' +
      unidades.map(u => `<option value="${u.id}">${u.nome.split(" — ")[0]}</option>`).join("");
  }

  const list = usuarios.filter(u => {
    const matchBusca = !busca ||
      u.nome.toLowerCase().includes(busca) ||
      u.turma.toLowerCase().includes(busca);
    const matchUnit = !unitFilter || u.unidade === unitFilter;
    return matchBusca && matchUnit;
  });

  document.getElementById("userGrid").innerHTML = list.map((u, i) => {
    const eqs     = getEquipsByUser(u.id);
    const color   = AVATAR_COLORS[i % AVATAR_COLORS.length];
    const uni     = unidades.find(x => x.id === u.unidade);
    const uniNome = uni ? uni.nome.split(" — ")[0] : u.unidade;

    // Lista de equipamentos com botão ✕ individual
    const kitHtml = eqs.length > 0
      ? `<div style="display:flex;flex-direction:column;gap:5px;margin-bottom:10px">
          ${eqs.map(e => `
            <div style="display:flex;align-items:center;gap:8px;padding:7px 9px;border-radius:8px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07)">
              <span style="font-size:16px;flex-shrink:0">${TIPO_ICON[e.tipo] || "📦"}</span>
              <div style="flex:1;min-width:0">
                <div style="font-size:12px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${e.nome}</div>
                <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--t3)">${e.patrimonio}</div>
              </div>
              <button onclick="removerEqDoAluno('${e.id}','${u.id}')"
                title="Remover deste aluno"
                style="background:none;border:none;cursor:pointer;color:#EF4444;font-size:15px;padding:2px 5px;opacity:0.65;flex-shrink:0;line-height:1"
                onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.65">✕</button>
            </div>`).join("")}
        </div>`
      : `<div style="font-size:12px;color:var(--t3);font-style:italic;margin-bottom:10px;padding:10px;text-align:center;border:1px dashed rgba(255,255,255,0.1);border-radius:8px">
           Nenhum equipamento atribuído
         </div>`;

    return `
    <div class="card" style="padding:18px;display:flex;flex-direction:column">
      <!-- Cabeçalho -->
      <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px">
        <div class="user-avatar" style="background:linear-gradient(135deg,${color},${color}99);flex-shrink:0">${u.nome[0]}</div>
        <div style="flex:1;min-width:0">
          <div style="font-family:'Syne',sans-serif;font-size:13px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${u.nome}</div>
          <div style="font-size:10px;color:var(--t3);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${u.email}</div>
        </div>
      </div>
      <!-- Badges -->
      <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:12px">
        ${u.turma ? `<span class="badge" style="color:var(--orange);background:rgba(249,115,22,0.1);border:1px solid rgba(249,115,22,0.2)">${u.turma}</span>` : ""}
        <span class="badge" style="color:var(--t3);background:rgba(255,255,255,0.04)">📍 ${uniNome}</span>
        <span class="badge" style="color:${u.ativo ? "var(--green)" : "#555"};background:${u.ativo ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.04)"}">${u.ativo ? "Ativo" : "Inativo"}</span>
      </div>
      <!-- Título kit + botão rápido -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <div style="font-family:'Syne',sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--t3)">
          Equipamentos (${eqs.length})
        </div>
        <button onclick="adicionarEqAoAluno('${u.id}')"
          style="font-size:10px;color:var(--orange);background:rgba(249,115,22,0.08);border:1px solid rgba(249,115,22,0.2);border-radius:6px;padding:3px 9px;cursor:pointer;font-weight:600"
          onmouseover="this.style.background='rgba(249,115,22,0.18)'"
          onmouseout="this.style.background='rgba(249,115,22,0.08)'">+ Adicionar</button>
      </div>
      <!-- Lista editável -->
      ${kitHtml}
      <!-- Botão gerenciar completo -->
      <button class="btn btn-ghost" style="width:100%;justify-content:center;font-size:12px;margin-top:auto"
        onclick="openKitModal('${u.id}')">
        📦 Gerenciar Kit Completo
      </button>
    </div>`;
  }).join("") ||
  `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--t3)">
    <div style="font-size:40px;margin-bottom:14px;opacity:0.3">👤</div>
    <div style="font-family:'Syne',sans-serif;font-size:17px">Nenhum aluno encontrado</div>
  </div>`;
}

// ---- Remover equipamento de um aluno direto do card ----
function removerEqDoAluno(eqId, uid) {
  const eq = equipamentos.find(x => x.id === eqId);
  if (!eq) return;
  if (!confirm(`Remover "${eq.nome}" de ${getUsuario(uid)?.nome}?`)) return;
  eq.usuario = "";
  eq.status  = "disponivel";
  movimentacoes.unshift({
    id: "mov_" + Date.now(), eqId, uid,
    tipo: "devolucao", data: new Date().toISOString(), resp: "Sistema",
  });
  renderUsuarios();
  renderDashboard();
  showToast(`↩ ${eq.nome} devolvido`);
}

// ---- Mini-modal: adicionar equipamento disponível a um aluno ----
function adicionarEqAoAluno(uid) {
  const u          = getUsuario(uid);
  const disponiveis = equipamentos.filter(e => !e.usuario || e.usuario === uid);

  if (disponiveis.length === 0) {
    showToast("⚠️ Nenhum equipamento disponível.");
    return;
  }

  const html = `
    <div class="modal-bg" id="addEqModal" onclick="this===event.target&&this.remove()" style="display:flex">
      <div class="modal" style="max-width:420px">
        <div class="modal-head">
          <div style="font-family:'Syne',sans-serif;font-size:16px;font-weight:700">
            ➕ Atribuir Equipamento — ${u.nome}
          </div>
          <button class="btn btn-ghost btn-sm" onclick="document.getElementById('addEqModal').remove()" style="padding:6px">✕</button>
        </div>
        <div class="modal-body">
          <input class="input" placeholder="Filtrar equipamento..." oninput="filtrarAddEq(this)" style="margin-bottom:10px">
          <div id="addEqLista" style="max-height:360px;overflow-y:auto;display:flex;flex-direction:column;gap:6px">
            ${disponiveis.map(e => {
              const jaAtribuido = e.usuario === uid;
              return `
              <div onclick="${jaAtribuido ? "" : `confirmarAddEq('${uid}','${e.id}')`}"
                data-nome="${e.nome.toLowerCase()} ${e.patrimonio.toLowerCase()}"
                style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;
                  border:1px solid ${jaAtribuido ? "rgba(249,115,22,0.35)" : "rgba(255,255,255,0.07)"};
                  background:${jaAtribuido ? "rgba(249,115,22,0.08)" : "rgba(255,255,255,0.02)"};
                  cursor:${jaAtribuido ? "default" : "pointer"};transition:background 0.12s"
                ${!jaAtribuido ? `onmouseover="this.style.background='rgba(16,185,129,0.08)'"
                  onmouseout="this.style.background='rgba(255,255,255,0.02)'"` : ""}>
                <span style="font-size:22px;flex-shrink:0">${TIPO_ICON[e.tipo] || "📦"}</span>
                <div style="flex:1;min-width:0">
                  <div style="font-size:13px;font-weight:500">${e.nome}${jaAtribuido ? " ✓" : ""}</div>
                  <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--t3)">${e.patrimonio} · ${e.marca}</div>
                </div>
                <span class="badge" style="color:${jaAtribuido ? "var(--orange)" : "var(--green)"};
                  background:${jaAtribuido ? "rgba(249,115,22,0.1)" : "rgba(16,185,129,0.1)"}">
                  ${jaAtribuido ? "Já seu" : "Disponível"}
                </span>
              </div>`;
            }).join("")}
          </div>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML("beforeend", html);
}

function filtrarAddEq(input) {
  const busca = input.value.toLowerCase();
  document.querySelectorAll("#addEqLista [data-nome]").forEach(el => {
    el.style.display = el.dataset.nome.includes(busca) ? "flex" : "none";
  });
}

function confirmarAddEq(uid, eqId) {
  const eq = equipamentos.find(x => x.id === eqId);
  const u  = getUsuario(uid);
  if (!eq || !u) return;
  eq.usuario = uid;
  eq.status  = "em_uso";
  movimentacoes.unshift({
    id: "mov_" + Date.now(), eqId, uid,
    tipo: "emprestimo", data: new Date().toISOString(), resp: "Sistema",
  });
  document.getElementById("addEqModal")?.remove();
  renderUsuarios();
  renderDashboard();
  showToast(`✓ ${eq.nome} atribuído a ${u.nome}`);
}

// ---- Modal Kit Completo (checkbox) ----
function openKitModal(uid) {
  const u     = getUsuario(uid);
  const todos = equipamentos.filter(e => !e.usuario || e.usuario === uid);

  const html = `
    <div class="modal-bg" id="kitModal" onclick="this===event.target&&this.remove()" style="display:flex">
      <div class="modal">
        <div class="modal-head">
          <div style="font-family:'Syne',sans-serif;font-size:17px;font-weight:700">📦 Kit de ${u.nome}</div>
          <button class="btn btn-ghost btn-sm" onclick="document.getElementById('kitModal').remove()" style="padding:6px">✕</button>
        </div>
        <div class="modal-body">
          <p style="font-size:13px;color:var(--t2);margin-bottom:12px">Marque os equipamentos sob responsabilidade deste aluno.</p>
          <input class="input" placeholder="Filtrar..." oninput="filtrarKitModal(this)" style="margin-bottom:10px">
          <div style="display:flex;flex-direction:column;gap:7px;max-height:380px;overflow-y:auto">
            ${todos.map(e => {
              const sel = e.usuario === uid;
              return `
              <div onclick="toggleKit(this)"
                style="display:flex;align-items:center;gap:11px;padding:11px 13px;border-radius:10px;
                  border:1px solid ${sel ? "rgba(249,115,22,0.4)" : "rgba(255,255,255,0.07)"};
                  background:${sel ? "rgba(249,115,22,0.08)" : "rgba(255,255,255,0.02)"};
                  cursor:pointer;transition:all 0.15s"
                data-nome="${e.nome.toLowerCase()} ${e.patrimonio.toLowerCase()}"
                data-eqid="${e.id}" data-sel="${sel}">
                <span style="font-size:22px">${TIPO_ICON[e.tipo] || "📦"}</span>
                <div style="flex:1">
                  <div style="font-size:13px;font-weight:500">${e.nome}</div>
                  <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--t3)">${e.patrimonio} · ${e.marca}</div>
                </div>
                <div style="width:20px;height:20px;border-radius:5px;flex-shrink:0;
                  border:2px solid ${sel ? "var(--orange)" : "rgba(255,255,255,0.2)"};
                  background:${sel ? "var(--orange)" : "transparent"};
                  display:flex;align-items:center;justify-content:center;font-size:12px">${sel ? "✓" : ""}</div>
              </div>`;
            }).join("")}
          </div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-ghost" onclick="document.getElementById('kitModal').remove()">Cancelar</button>
          <button class="btn btn-primary" onclick="salvarKit('${uid}')">📦 Salvar Kit</button>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML("beforeend", html);
}

function filtrarKitModal(input) {
  const busca = input.value.toLowerCase();
  document.querySelectorAll("#kitModal [data-nome]").forEach(el => {
    el.style.display = el.dataset.nome.includes(busca) ? "flex" : "none";
  });
}

function toggleKit(el) {
  const isSel = el.dataset.sel === "true";
  el.dataset.sel = !isSel;
  const check = el.querySelector("div:last-child");
  if (!isSel) {
    el.style.border = "1px solid rgba(249,115,22,0.4)";
    el.style.background = "rgba(249,115,22,0.08)";
    check.style.borderColor = "var(--orange)";
    check.style.background = "var(--orange)";
    check.textContent = "✓";
  } else {
    el.style.border = "1px solid rgba(255,255,255,0.07)";
    el.style.background = "rgba(255,255,255,0.02)";
    check.style.borderColor = "rgba(255,255,255,0.2)";
    check.style.background = "transparent";
    check.textContent = "";
  }
}

function salvarKit(uid) {
  const modal = document.getElementById("kitModal");
  equipamentos.forEach(e => { if (e.usuario === uid) { e.usuario = ""; e.status = "disponivel"; } });
  modal.querySelectorAll('[data-sel="true"]').forEach(el => {
    const eq = equipamentos.find(x => x.id === el.dataset.eqid);
    if (eq) { eq.usuario = uid; eq.status = "em_uso"; }
  });
  modal.remove();
  renderUsuarios();
  renderDashboard();
  showToast("✓ Kit salvo!");
}

// ---- Salvar Aluno (novo) ----
function salvarUsuario() {
  const nome  = document.getElementById("uNome").value.trim();
  const email = document.getElementById("uEmail").value.trim();
  if (!nome || !email) { alert("Nome e e-mail são obrigatórios."); return; }

  usuarios.push({
    id:      "usr_" + Date.now(),
    nome, email,
    tel:     document.getElementById("uTel").value,
    unidade: document.getElementById("uUnidade").value,
    turma:   document.getElementById("uTurma").value,
    ativo:   true,
  });

  closeModal("usuario");
  renderUsuarios();
  if (typeof populateSelects === "function") populateSelects();
  showToast("✓ Aluno cadastrado!");
}


function renderUsuarios() {
  const busca =
    document.getElementById("userSearch")?.value.toLowerCase() || "";
  const unitFilter = document.getElementById("userUnitFilter")?.value || "";

  // Popular select de unidade (na primeira chamada)
  const unitSel = document.getElementById("userUnitFilter");
  if (unitSel && unitSel.options.length <= 1) {
    unitSel.innerHTML =
      '<option value="">Todas as unidades</option>' +
      unidades
        .map(
          (u) => `<option value="${u.id}">${u.nome.split(" — ")[0]}</option>`,
        )
        .join("");
  }

  const list = usuarios.filter((u) => {
    const matchBusca =
      !busca ||
      u.nome.toLowerCase().includes(busca) ||
      u.turma.toLowerCase().includes(busca);
    const matchUnit = !unitFilter || u.unidade === unitFilter;
    return matchBusca && matchUnit;
  });
  const UN_LABELS = {
    u1: "ELITI LAB",
    u2: "ELITI PRO",
    u3: "ELITI DAY",
    u4: "ELITI KIDS",
    u5: "ELITI 50+",
  };

  document.getElementById("userGrid").innerHTML = list
    .map((u, i) => {
      const eqs = getEquipsByUser(u.id);
      const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
      return `
      <div class="card" style="padding:18px">
        <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:14px">
          <div class="user-avatar" style="background:linear-gradient(135deg,${color},${color}bb)">${u.nome[0]}</div>
          <div style="flex:1;min-width:0">
            <div style="font-family:'Syne',sans-serif;font-size:14px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${u.nome}</div>
            <div style="font-size:11px;color:var(--t3);margin-top:2px">${u.email}</div>
          </div>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">
          ${u.turma ? `<span class="badge" style="color:var(--orange);background:rgba(249,115,22,0.1);border:1px solid rgba(249,115,22,0.2)">${u.turma}</span>` : ""}
          <span class="badge" style="color:var(--t3);background:rgba(255,255,255,0.04)">📍 ${UN_LABELS[u.unidade] || u.unidade}</span>
          <span class="badge" style="color:${u.ativo ? "var(--green)" : "#555"};background:${u.ativo ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.04)"}">${u.ativo ? "Ativo" : "Inativo"}</span>
        </div>
        ${
          eqs.length > 0
            ? `
          <div style="background:rgba(255,255,255,0.02);border-radius:8px;padding:9px 11px">
            <div style="font-family:'Syne',sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--t3);margin-bottom:7px">Kit (${eqs.length} itens)</div>
            <div style="display:flex;gap:5px;flex-wrap:wrap">${eqs.map((e) => `<span title="${e.nome}" style="font-size:20px">${TIPO_ICON[e.tipo] || "📦"}</span>`).join("")}</div>
          </div>`
            : `<div style="font-size:12px;color:var(--t3);font-style:italic">Sem equipamentos alocados</div>`
        }
        <button class="btn btn-ghost" style="width:100%;justify-content:center;margin-top:12px;font-size:12px" onclick="openKitModal('${u.id}')">
          📦 ${eqs.length > 0 ? "Gerenciar Kit" : "Montar Kit"}
        </button>
      </div>`;
    })
    .join("");
}

// ---- Modal Kit ----
function openKitModal(uid) {
  const u = getUsuario(uid);
  const todos = equipamentos.filter((e) => !e.usuario || e.usuario === uid);

  const html = `
    <div class="modal-bg" id="kitModal" onclick="this===event.target&&this.remove()">
      <div class="modal">
        <div class="modal-head">
          <div style="font-family:'Syne',sans-serif;font-size:17px;font-weight:700">Kit de ${u.nome}</div>
          <button class="btn btn-ghost btn-sm" onclick="document.getElementById('kitModal').remove()" style="padding:6px">✕</button>
        </div>
        <div class="modal-body">
          <p style="font-size:13px;color:var(--t2);margin-bottom:18px">Selecione os equipamentos sob responsabilidade deste aluno.</p>
          <div style="display:flex;flex-direction:column;gap:8px;max-height:340px;overflow-y:auto">
            ${todos
              .map((e) => {
                const sel = e.usuario === uid;
                return `
                <div onclick="toggleKit(this,'${e.id}','${uid}')"
                  style="display:flex;align-items:center;gap:11px;padding:11px 13px;border-radius:10px;border:1px solid ${sel ? "rgba(249,115,22,0.4)" : "rgba(255,255,255,0.07)"};background:${sel ? "rgba(249,115,22,0.08)" : "rgba(255,255,255,0.02)"};cursor:pointer;transition:all 0.15s"
                  data-eqid="${e.id}" data-sel="${sel}">
                  <span style="font-size:20px">${TIPO_ICON[e.tipo] || "📦"}</span>
                  <div style="flex:1">
                    <div style="font-size:13px;font-weight:500">${e.nome}</div>
                    <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--t3)">${e.patrimonio}</div>
                  </div>
                  <div style="width:18px;height:18px;border-radius:4px;border:2px solid ${sel ? "var(--orange)" : "rgba(255,255,255,0.2)"};background:${sel ? "var(--orange)" : "transparent"};display:flex;align-items:center;justify-content:center;font-size:11px">${sel ? "✓" : ""}</div>
                </div>`;
              })
              .join("")}
          </div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-ghost" onclick="document.getElementById('kitModal').remove()">Cancelar</button>
          <button class="btn btn-primary" onclick="salvarKit('${uid}')">📦 Salvar Kit</button>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML("beforeend", html);
}

function toggleKit(el, eqId) {
  const isSel = el.dataset.sel === "true";
  el.dataset.sel = !isSel;
  const check = el.querySelector("div:last-child");
  if (!isSel) {
    el.style.border = "1px solid rgba(249,115,22,0.4)";
    el.style.background = "rgba(249,115,22,0.08)";
    check.style.borderColor = "var(--orange)";
    check.style.background = "var(--orange)";
    check.textContent = "✓";
  } else {
    el.style.border = "1px solid rgba(255,255,255,0.07)";
    el.style.background = "rgba(255,255,255,0.02)";
    check.style.borderColor = "rgba(255,255,255,0.2)";
    check.style.background = "transparent";
    check.textContent = "";
  }
}

function salvarKit(uid) {
  const modal = document.getElementById("kitModal");
  // Limpa alocações atuais do usuário
  equipamentos.forEach((e) => {
    if (e.usuario === uid) e.usuario = "";
  });
  // Aplica selecionados
  modal.querySelectorAll('[data-sel="true"]').forEach((el) => {
    const eqId = el.dataset.eqid;
    const eq = equipamentos.find((x) => x.id === eqId);
    if (eq) eq.usuario = uid;
  });
  modal.remove();
  renderUsuarios();
  showToast("✓ Kit salvo!");
}

// ---- Salvar Aluno ----
function salvarUsuario() {
  const nome = document.getElementById("uNome").value.trim();
  const email = document.getElementById("uEmail").value.trim();
  if (!nome || !email) {
    alert("Nome e e-mail são obrigatórios.");
    return;
  }

  usuarios.push({
    id: "usr_" + Date.now(),
    nome,
    email,
    tel: document.getElementById("uTel").value,
    unidade: document.getElementById("uUnidade").value,
    turma: document.getElementById("uTurma").value,
    ativo: true,
  });

  closeModal("usuario");
  renderUsuarios();
  if (typeof populateSelects === "function") populateSelects();
  showToast("✓ Aluno cadastrado!");
}
