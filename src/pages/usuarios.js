// =============================================
//  ELITI PATRIMÔNIO — Alunos (Usuários)
// =============================================

const AVATAR_COLORS = [
  "#F97316",
  "#3B82F6",
  "#10B981",
  "#8B5CF6",
  "#F59E0B",
  "#EC4899",
];

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
