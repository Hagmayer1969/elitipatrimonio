// =============================================
//  ELITI PATRIMÔNIO — Alunos (Usuários)
// =============================================

// ---- Remover equipamento de um aluno direto do card ----
async function removerEqDoAluno(eqId, uid) {
  const eq = equipamentos.find((x) => x.id === eqId);
  if (!eq) return;
  if (!confirm(`Remover "${eq.nome}" de ${getUsuario(uid)?.nome}?`)) return;
  const ok = await dbAtualizarCampoEq(eqId, {
    usuario: "",
    status: "disponivel",
  });
  if (!ok) return;
  const mov = {
    id: "mov_" + Date.now(),
    eqId,
    uid,
    tipo: "devolucao",
    data: new Date().toISOString(),
    resp: "Sistema",
  };
  await dbRegistrarMovimentacao(mov);
  renderUsuarios();
  renderDashboard();
  showToast(`↩ ${eq.nome} devolvido`);
}

// ---- Mini-modal: adicionar equipamento disponível a um aluno ----
function adicionarEqAoAluno(uid) {
  const u = getUsuario(uid);
  const disponiveis = equipamentos.filter(
    (e) => !e.usuario || e.usuario === uid,
  );

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
            ${disponiveis
              .map((e) => {
                const jaAtribuido = e.usuario === uid;
                return `
              <div onclick="${jaAtribuido ? "" : `confirmarAddEq('${uid}','${e.id}')`}"
                data-nome="${e.nome.toLowerCase()} ${e.patrimonio.toLowerCase()}"
                style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;
                  border:1px solid ${jaAtribuido ? "rgba(249,115,22,0.35)" : "rgba(255,255,255,0.07)"};
                  background:${jaAtribuido ? "rgba(249,115,22,0.08)" : "rgba(255,255,255,0.02)"};
                  cursor:${jaAtribuido ? "default" : "pointer"};transition:background 0.12s"
                ${
                  !jaAtribuido
                    ? `onmouseover="this.style.background='rgba(16,185,129,0.08)'"
                  onmouseout="this.style.background='rgba(255,255,255,0.02)'"`
                    : ""
                }>
                <span style="font-size:22px;flex-shrink:0">${TIPO_ICON[e.tipo] || "📦"}</span>
                <div style="flex:1;min-width:0">
                  <div style="font-size:13px;font-weight:500">${e.nome}${jaAtribuido ? " ✓" : ""}</div>
                  <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--t3);line-height:1.6">
                    ${e.patrimonio ? `🏷 ${e.patrimonio}` : '<span style="opacity:0.5">🏷 Sem patrimônio</span>'}
                    ${e.serie ? ` · 🔢 ${e.serie}` : ""}
                    ${e.marca || e.modelo ? `<br>${(e.marca + " " + (e.modelo || "")).trim()}` : ""}
                  </div>
                </div>
                <span class="badge" style="color:${jaAtribuido ? "var(--orange)" : "var(--green)"};
                  background:${jaAtribuido ? "rgba(249,115,22,0.1)" : "rgba(16,185,129,0.1)"}">
                  ${jaAtribuido ? "Já seu" : "Disponível"}
                </span>
              </div>`;
              })
              .join("")}
          </div>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML("beforeend", html);
}

function filtrarAddEq(input) {
  const busca = input.value.toLowerCase();
  document.querySelectorAll("#addEqLista [data-nome]").forEach((el) => {
    el.style.display = el.dataset.nome.includes(busca) ? "flex" : "none";
  });
}

async function confirmarAddEq(uid, eqId) {
  const eq = equipamentos.find((x) => x.id === eqId);
  const u = getUsuario(uid);
  if (!eq || !u) return;
  const ok = await dbAtualizarCampoEq(eqId, { usuario: uid, status: "em_uso" });
  if (!ok) return;
  const mov = {
    id: "mov_" + Date.now(),
    eqId,
    uid,
    tipo: "emprestimo",
    data: new Date().toISOString(),
    resp: "Sistema",
  };
  await dbRegistrarMovimentacao(mov);
  document.getElementById("addEqModal")?.remove();
  renderUsuarios();
  renderDashboard();
  showToast(`✓ ${eq.nome} atribuído a ${u.nome}`);
}

// ---- Modal Kit Completo (checkbox) ----
function openKitModal(uid) {
  const u = getUsuario(uid);
  const todos = equipamentos.filter((e) => !e.usuario || e.usuario === uid);

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
            ${todos
              .map((e) => {
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
                  <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--t3);line-height:1.6">
                    ${e.patrimonio ? `🏷 ${e.patrimonio}` : '<span style="opacity:0.5">🏷 Sem patrimônio</span>'}
                    ${e.serie ? ` · 🔢 ${e.serie}` : ""}
                    ${e.marca || e.modelo ? `<br>${(e.marca + " " + (e.modelo || "")).trim()}` : ""}
                  </div>
                </div>
                <div style="width:20px;height:20px;border-radius:5px;flex-shrink:0;
                  border:2px solid ${sel ? "var(--orange)" : "rgba(255,255,255,0.2)"};
                  background:${sel ? "var(--orange)" : "transparent"};
                  display:flex;align-items:center;justify-content:center;font-size:12px">${sel ? "✓" : ""}</div>
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

function filtrarKitModal(input) {
  const busca = input.value.toLowerCase();
  document.querySelectorAll("#kitModal [data-nome]").forEach((el) => {
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

async function salvarKit(uid) {
  const modal = document.getElementById("kitModal");
  // Devolver todos os que estavam com este aluno
  const promises = [];
  equipamentos.forEach((e) => {
    if (e.usuario === uid)
      promises.push(
        dbAtualizarCampoEq(e.id, { usuario: "", status: "disponivel" }),
      );
  });
  // Atribuir os selecionados
  modal.querySelectorAll('[data-sel="true"]').forEach((el) => {
    promises.push(
      dbAtualizarCampoEq(el.dataset.eqid, { usuario: uid, status: "em_uso" }),
    );
  });
  await Promise.all(promises);
  modal.remove();
  renderUsuarios();
  renderDashboard();
  showToast("✓ Kit salvo!");
}

// ---- Salvar Aluno (novo) ----
async function salvarUsuario() {
  const nome = document.getElementById("uNome").value.trim();
  const email = document.getElementById("uEmail").value.trim();
  if (!nome || !email) {
    alert("Nome e e-mail são obrigatórios.");
    return;
  }

  const usr = {
    id: "usr_" + Date.now(),
    nome,
    email,
    tel: document.getElementById("uTel").value,
    unidade: document.getElementById("uUnidade").value,
    turma: document.getElementById("uTurma").value,
    ativo: true,
  };

  const ok = await dbSalvarUsuario(usr);
  if (!ok) return;
  usuarios.push(usr);

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

  document.getElementById("userGrid").innerHTML =
    list
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
        <div style="display:flex;gap:7px;margin-top:12px">
          <button class="btn btn-ghost btn-sm" style="flex:1;justify-content:center" onclick="openKitModal('${u.id}')">
            📦 ${eqs.length > 0 ? "Kit" : "Montar Kit"}
          </button>
          <button class="btn btn-ghost btn-sm" style="flex:1;justify-content:center" onclick="editarAluno('${u.id}')">
            ✎ Editar
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteAluno('${u.id}')" title="Excluir aluno">🗑</button>
        </div>
      </div>`;
      })
      .join("") ||
    `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--t3)">
    <div style="font-size:40px;margin-bottom:14px;opacity:0.3">👤</div>
    <div style="font-family:'Syne',sans-serif;font-size:17px">Nenhum aluno encontrado</div>
  </div>`;
}

// ---- Excluir aluno ----
async function deleteAluno(uid) {
  const u = getUsuario(uid);
  if (!u) return;
  const eqs = getEquipsByUser(uid);
  const msg =
    eqs.length > 0
      ? `Excluir "${u.nome}"?\n\nAtenção: ${eqs.length} equipamento(s) serão devolvidos (status → Disponível).`
      : `Excluir "${u.nome}"?`;
  if (!confirm(msg)) return;

  // Devolve equipamentos antes de excluir
  for (const e of eqs) {
    await dbAtualizarCampoEq(e.id, { usuario: "", status: "disponivel" });
  }

  const { error } = await sb.from("usuarios").delete().eq("id", uid);
  if (error) {
    console.error(error);
    showToast("⚠ Erro ao excluir aluno.");
    return;
  }
  usuarios = usuarios.filter((x) => x.id !== uid);
  renderUsuarios();
  renderEquipamentos();
  renderDashboard();
  showToast(`🗑 ${u.nome} excluído.`);
}

// ---- Editar aluno — abre modal preenchido ----
function editarAluno(uid) {
  const u = getUsuario(uid);
  if (!u) return;

  const html = `
    <div class="modal-bg" id="editAlunoModal" onclick="this===event.target&&fecharEditAluno()" style="display:flex">
      <div class="modal" style="max-width:460px">
        <div class="modal-head">
          <div style="font-family:'Syne',sans-serif;font-size:16px;font-weight:700">✎ Editar Aluno</div>
          <button class="btn btn-ghost btn-sm" onclick="fecharEditAluno()" style="padding:6px">✕</button>
        </div>
        <div class="modal-body" style="display:flex;flex-direction:column;gap:14px">

          <div class="grid-2">
            <div class="col-full">
              <div class="label">Nome Completo *</div>
              <input class="input" id="editNome" value="${u.nome}" placeholder="Nome do aluno">
            </div>
            <div>
              <div class="label">E-mail</div>
              <input class="input" id="editEmail" type="email" value="${u.email}" placeholder="aluno@eliti.org">
            </div>
            <div>
              <div class="label">Telefone</div>
              <input class="input" id="editTel" value="${u.tel || ""}" placeholder="(48) 9 9999-9999">
            </div>
            <div>
              <div class="label">Unidade</div>
              <select class="input" id="editUnidade">
                <option value="">Sem unidade</option>
                ${unidades.map((un) => `<option value="${un.id}" ${u.unidade === un.id ? "selected" : ""}>${un.nome.split(" — ")[0]}</option>`).join("")}
              </select>
            </div>
            <div>
              <div class="label">Turma</div>
              <input class="input" id="editTurma" value="${u.turma || ""}" placeholder="PRO T18, LAB, EAD...">
            </div>
            <div>
              <div class="label">Status</div>
              <select class="input" id="editAtivo">
                <option value="true" ${u.ativo !== false ? "selected" : ""}>✅ Ativo</option>
                <option value="false" ${u.ativo === false ? "selected" : ""}>⛔ Inativo</option>
              </select>
            </div>
            <div class="col-full">
              <div class="label">Observações</div>
              <textarea class="input" id="editObs" rows="2" placeholder="Anotações, histórico...">${u.obs || ""}</textarea>
            </div>
          </div>

        </div>
        <div class="modal-foot">
          <button class="btn btn-ghost" onclick="fecharEditAluno()">Cancelar</button>
          <button class="btn btn-primary" onclick="salvarEdicaoAluno('${uid}')">✓ Salvar Alterações</button>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML("beforeend", html);
  document.getElementById("editNome").focus();
}

function fecharEditAluno() {
  document.getElementById("editAlunoModal")?.remove();
}

async function salvarEdicaoAluno(uid) {
  const nome = document.getElementById("editNome").value.trim();
  if (!nome) {
    showToast("⚠ Nome é obrigatório.");
    return;
  }

  const u = getUsuario(uid);
  if (!u) return;

  Object.assign(u, {
    nome,
    email: document.getElementById("editEmail").value.trim(),
    tel: document.getElementById("editTel").value.trim(),
    unidade: document.getElementById("editUnidade").value,
    turma: document.getElementById("editTurma").value.trim(),
    ativo: document.getElementById("editAtivo").value === "true",
    obs: document.getElementById("editObs").value.trim(),
  });

  const ok = await dbSalvarUsuario(u);
  if (!ok) return;

  fecharEditAluno();
  renderUsuarios();
  showToast(`✓ ${nome} atualizado!`);
}
