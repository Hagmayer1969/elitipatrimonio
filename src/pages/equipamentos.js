// =============================================
//  ELITI PATRIMÔNIO — Equipamentos
// =============================================

let currentPhotoData = "";

// ---- Render ----
function renderEquipamentos() {
  const busca = document.getElementById("eqSearch")?.value.toLowerCase() || "";
  const filtStatus = document.getElementById("eqStatusFilter")?.value || "";
  const filtTipo = document.getElementById("eqTipoFilter")?.value || "";

  const list = equipamentos.filter(
    (e) =>
      (!busca ||
        e.nome.toLowerCase().includes(busca) ||
        e.patrimonio.toLowerCase().includes(busca) ||
        e.marca.toLowerCase().includes(busca)) &&
      (!filtStatus || e.status === filtStatus) &&
      (!filtTipo || e.tipo === filtTipo),
  );

  document.getElementById("eqCount").textContent =
    `${list.length} de ${equipamentos.length} equipamentos`;

  document.getElementById("equipGrid").innerHTML =
    list
      .map((e) => {
        const u  = getUsuario(e.usuario);
        const un = getUnidade(e.unidade);
        const st = STATUS[e.status];

        // Dados técnicos — só mostra o que está preenchido
        const temPatrimonio = e.patrimonio && e.patrimonio !== "PAT-001" && e.patrimonio !== "";
        const temSerie      = e.serie && e.serie.trim() !== "";
        const temMarca      = (e.marca || "") + " " + (e.modelo || "");

        const dadosTecnicos = [
          temPatrimonio ? `<span title="Patrimônio" style="display:inline-flex;align-items:center;gap:4px"><span style="opacity:0.5">🏷</span>${e.patrimonio}</span>` : `<span style="color:#EF4444;opacity:0.8" title="Sem etiqueta">🏷 Sem patrimônio</span>`,
          temSerie      ? `<span title="Número de Série" style="display:inline-flex;align-items:center;gap:4px"><span style="opacity:0.5">🔢</span>${e.serie}</span>` : `<span style="color:var(--t3)" title="Sem série">🔢 —</span>`,
        ].join("  ");

        return `
      <div class="card equip-card">
        <div class="equip-photo" style="${e.foto ? `background:url(${e.foto}) center/cover` : ""}">
          ${!e.foto ? `<span style="opacity:0.35;font-size:50px">${TIPO_ICON[e.tipo] || "📦"}</span>` : ""}
          <div class="eq-badge-pos"><span class="badge" style="color:${st.c};background:${st.b}">${st.l}</span></div>
          ${e.sincronizado ? '<div class="eq-epanel-pos">EPANEL ✓</div>' : ""}
        </div>
        <div class="equip-body">
          <div class="equip-name">${e.nome || '<span style="color:var(--t3);font-style:italic">Sem nome</span>'}</div>

          <!-- Marca + Modelo -->
          <div class="equip-code" style="margin-bottom:6px">
            ${e.marca ? `${e.marca}${e.modelo ? " · " + e.modelo : ""}` : '<span style="color:var(--t3);font-size:11px;font-style:italic">Marca/modelo não informados</span>'}
          </div>

          <!-- Dados técnicos: patrimônio e série com edição rápida -->
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
            <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--t3);flex:1;line-height:1.8">
              ${dadosTecnicos}
            </div>
            <button onclick="editarDadosTecnicos('${e.id}')"
              title="Editar patrimônio, série e modelo"
              style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:3px 7px;cursor:pointer;font-size:11px;color:var(--t3);white-space:nowrap;flex-shrink:0"
              onmouseover="this.style.background='rgba(249,115,22,0.12)';this.style.color='var(--orange)'"
              onmouseout="this.style.background='rgba(255,255,255,0.05)';this.style.color='var(--t3)'">✎ Editar</button>
          </div>

          <hr style="margin:8px 0;border-color:rgba(255,255,255,0.06)">

          <!-- Responsável -->
          <div onclick="abrirTrocaResponsavel('${e.id}')"
            title="Clique para trocar responsável"
            style="display:flex;align-items:center;gap:8px;margin-bottom:6px;padding:7px 9px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);cursor:pointer;transition:background 0.15s"
            onmouseover="this.style.background='rgba(249,115,22,0.07)'"
            onmouseout="this.style.background='rgba(255,255,255,0.02)'">
            ${u
              ? `<div style="width:24px;height:24px;border-radius:50%;background:var(--orange);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:white;flex-shrink:0">${u.nome[0]}</div>
                 <div style="flex:1;min-width:0">
                   <div style="font-size:12px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${u.nome}</div>
                   <div style="font-size:10px;color:var(--t3)">👤 Responsável · clique p/ trocar</div>
                 </div>`
              : `<div style="width:24px;height:24px;border-radius:50%;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0">➕</div>
                 <div style="font-size:12px;color:var(--t3)">Sem responsável — clique p/ atribuir</div>`
            }
            <span style="font-size:14px;opacity:0.4">✎</span>
          </div>

          <div style="font-size:11px;color:var(--t3)">📍 ${un?.nome.split("—")[0].trim() || "—"}</div>
          ${e.obs ? `<div style="font-size:11px;color:var(--t3);padding:6px 8px;background:rgba(255,255,255,0.02);border-radius:6px;margin-top:6px">${e.obs}</div>` : ""}
          ${e.valor ? `<div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--t2);margin-top:5px">R$ ${e.valor.toLocaleString("pt-BR")}</div>` : ""}

          <div style="display:flex;gap:7px;margin-top:10px">
            ${u ? `<button class="btn btn-ghost btn-sm" style="color:#EF4444;border-color:rgba(239,68,68,0.25)" onclick="devolverEquipamento('${e.id}')">↩ Devolver</button>` : ""}
            <button class="btn btn-ghost btn-sm" style="flex:1;justify-content:center" onclick="editEquipamento('${e.id}')">⚙ Completo</button>
            <button class="btn btn-danger btn-sm" onclick="deleteEquipamento('${e.id}')">🗑</button>
          </div>
        </div>
      </div>`;
      })
      .join("") ||
    `
    <div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--t3)">
      <div style="font-size:40px;margin-bottom:14px;opacity:0.3">📦</div>
      <div style="font-family:'Syne',sans-serif;font-size:17px;margin-bottom:8px">Nenhum equipamento encontrado</div>
      <div style="font-size:13px">Ajuste os filtros ou cadastre um novo.</div>
    </div>`;
}

// ---- Devolução rápida ----
async function devolverEquipamento(id) {
  const e = equipamentos.find((x) => x.id === id);
  if (!e) return;
  const u = getUsuario(e.usuario);
  if (
    !confirm(`Confirmar devolução de "${e.nome}"${u ? ` por ${u.nome}` : ""}?`)
  )
    return;

  const ok = await dbAtualizarCampoEq(id, { usuario: "", status: "disponivel" });
  if (!ok) return;

  const mov = { id: "mov_" + Date.now(), eqId: id, uid: u?.id || "", tipo: "devolucao", data: new Date().toISOString(), resp: "Sistema" };
  await dbRegistrarMovimentacao(mov);

  renderEquipamentos();
  renderDashboard();
  showToast(`↩ ${e.nome} devolvido e disponível!`);
}

// ---- Edição rápida de dados técnicos (patrimônio, série, modelo/marca) ----
function editarDadosTecnicos(eqId) {
  const e = equipamentos.find((x) => x.id === eqId);
  if (!e) return;

  const html = `
    <div class="modal-bg" id="dadosTecModal" onclick="this===event.target&&fecharDadosTecModal()" style="display:flex">
      <div class="modal" style="max-width:420px">
        <div class="modal-head">
          <div style="font-family:'Syne',sans-serif;font-size:16px;font-weight:700">
            🏷 Dados Técnicos — ${e.nome}
          </div>
          <button class="btn btn-ghost btn-sm" onclick="fecharDadosTecModal()" style="padding:6px">✕</button>
        </div>
        <div class="modal-body" style="display:flex;flex-direction:column;gap:16px">
          <div style="font-size:12px;color:var(--t3);padding:10px 12px;background:rgba(249,115,22,0.06);border:1px solid rgba(249,115,22,0.15);border-radius:8px;line-height:1.5">
            Preencha os dados técnicos deste equipamento. Esses dados são essenciais para o controle de patrimônio.
          </div>

          <div>
            <div class="label">🏷 Etiqueta de Patrimônio</div>
            <input class="input" id="dtPatrimonio"
              placeholder="Ex: ELITI-0042 ou PAT-2024-001"
              value="${e.patrimonio || ""}"
              style="font-family:'JetBrains Mono',monospace">
            <div style="font-size:10px;color:var(--t3);margin-top:4px">Código da etiqueta colada no equipamento</div>
          </div>

          <div>
            <div class="label">🔢 Número de Série</div>
            <input class="input" id="dtSerie"
              placeholder="Ex: SN5CG1234ABC ou 5CD12345TF"
              value="${e.serie || ""}"
              style="font-family:'JetBrains Mono',monospace">
            <div style="font-size:10px;color:var(--t3);margin-top:4px">Geralmente embaixo do equipamento ou nas configurações do sistema</div>
          </div>

          <div>
            <div class="label">🖥 Marca</div>
            <input class="input" id="dtMarca"
              placeholder="Ex: Dell, Apple, Lenovo, HP..."
              value="${e.marca || ""}">
          </div>

          <div>
            <div class="label">📋 Modelo</div>
            <input class="input" id="dtModelo"
              placeholder="Ex: Inspiron 15 3511, MacBook Air M1..."
              value="${e.modelo || ""}">
          </div>

          <div style="display:flex;gap:10px;padding-top:4px">
            <button class="btn btn-ghost" style="flex:1" onclick="fecharDadosTecModal()">Cancelar</button>
            <button class="btn btn-primary" style="flex:2" onclick="salvarDadosTecnicos('${e.id}')">✓ Salvar Dados Técnicos</button>
          </div>
        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML("beforeend", html);
  document.getElementById("dtPatrimonio").focus();

  // Salvar com Enter no último campo
  document.getElementById("dtModelo").addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") salvarDadosTecnicos(eqId);
  });
}

function fecharDadosTecModal() {
  document.getElementById("dadosTecModal")?.remove();
}

async function salvarDadosTecnicos(eqId) {
  const e = equipamentos.find((x) => x.id === eqId);
  if (!e) return;

  const patrimonio = document.getElementById("dtPatrimonio").value.trim();
  const serie      = document.getElementById("dtSerie").value.trim();
  const marca      = document.getElementById("dtMarca").value.trim();
  const modelo     = document.getElementById("dtModelo").value.trim();

  if (!patrimonio && !serie && !marca && !modelo) {
    showToast("⚠ Preencha ao menos um campo antes de salvar.");
    return;
  }

  const campos = { patrimonio: patrimonio || e.patrimonio, serie, marca, modelo };
  const ok = await dbAtualizarCampoEq(eqId, campos);
  if (!ok) return;

  fecharDadosTecModal();
  renderEquipamentos();
  showToast(`✓ Dados técnicos de "${e.nome}" salvos!`);
}

// ---- Troca rápida de responsável ----
function abrirTrocaResponsavel(eqId) {
  const e = equipamentos.find((x) => x.id === eqId);
  if (!e) return;
  const u = getUsuario(e.usuario);

  // Opções de alunos ordenadas, filtrando pela unidade do equipamento primeiro
  const sorted = [...usuarios].sort((a, b) => {
    if (a.unidade === e.unidade && b.unidade !== e.unidade) return -1;
    if (b.unidade === e.unidade && a.unidade !== e.unidade) return 1;
    return a.nome.localeCompare(b.nome, "pt-BR");
  });

  const opcoesUnidade =
    unidades.find((x) => x.id === e.unidade)?.nome.split(" — ")[0] || "";

  const html = `
    <div class="modal-bg" id="trocaModal" onclick="this===event.target&&fecharTrocaModal()" style="display:flex">
      <div class="modal" style="max-width:420px">
        <div class="modal-head">
          <div style="font-family:'Syne',sans-serif;font-size:16px;font-weight:700">
            👤 Responsável — ${e.nome}
          </div>
          <button class="btn btn-ghost btn-sm" onclick="fecharTrocaModal()" style="padding:6px">✕</button>
        </div>
        <div class="modal-body">
          <div style="font-size:11px;color:var(--t3);margin-bottom:6px">
            ${e.patrimonio} · ${opcoesUnidade}
          </div>
          ${
            u
              ? `<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;background:rgba(249,115,22,0.08);border:1px solid rgba(249,115,22,0.2);margin-bottom:14px">
            <div style="width:28px;height:28px;border-radius:50%;background:var(--orange);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:white">${u.nome[0]}</div>
            <div>
              <div style="font-size:13px;font-weight:500">${u.nome}</div>
              <div style="font-size:10px;color:var(--t3)">Responsável atual</div>
            </div>
          </div>`
              : `<div style="font-size:12px;color:var(--t3);margin-bottom:14px;font-style:italic">Nenhum responsável atribuído</div>`
          }

          <div class="label">Novo responsável</div>
          <input class="input" id="trocaBusca" placeholder="Filtrar aluno..." oninput="filtrarTrocaAlunos()" style="margin-bottom:8px">
          <div id="trocaLista" style="max-height:300px;overflow-y:auto;display:flex;flex-direction:column;gap:5px">
            <div onclick="confirmarTrocaResponsavel('${eqId}', '')"
              style="display:flex;align-items:center;gap:10px;padding:9px 11px;border-radius:8px;border:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.02);cursor:pointer;transition:background 0.12s"
              onmouseover="this.style.background='rgba(239,68,68,0.08)'"
              onmouseout="this.style.background='rgba(255,255,255,0.02)'">
              <div style="width:26px;height:26px;border-radius:50%;background:rgba(239,68,68,0.15);display:flex;align-items:center;justify-content:center;font-size:13px">↩</div>
              <div>
                <div style="font-size:13px;color:#EF4444;font-weight:500">Sem responsável (devolver)</div>
                <div style="font-size:10px;color:var(--t3)">Status muda para Disponível</div>
              </div>
            </div>
            ${sorted
              .map((usr, i) => {
                const uniNome =
                  unidades
                    .find((x) => x.id === usr.unidade)
                    ?.nome.split(" — ")[0] || "";
                const isCurrent = usr.id === e.usuario;
                return `<div onclick="${isCurrent ? "" : `confirmarTrocaResponsavel('${eqId}','${usr.id}')`}"
                data-nome="${usr.nome.toLowerCase()}"
                style="display:flex;align-items:center;gap:10px;padding:9px 11px;border-radius:8px;border:1px solid ${isCurrent ? "rgba(249,115,22,0.35)" : "rgba(255,255,255,0.07)"};background:${isCurrent ? "rgba(249,115,22,0.08)" : "rgba(255,255,255,0.02)"};cursor:${isCurrent ? "default" : "pointer"};transition:background 0.12s"
                ${!isCurrent ? `onmouseover="this.style.background='rgba(249,115,22,0.07)'" onmouseout="this.style.background='rgba(255,255,255,0.02)'"` : ""}>
                <div style="width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,hsl(${(i * 47) % 360},65%,50%),hsl(${(i * 47 + 40) % 360},65%,40%));display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:white;flex-shrink:0">${usr.nome[0]}</div>
                <div style="flex:1;min-width:0">
                  <div style="font-size:12px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${usr.nome}${isCurrent ? " ✓" : ""}</div>
                  <div style="font-size:10px;color:var(--t3)">${uniNome} · ${usr.turma}</div>
                </div>
              </div>`;
              })
              .join("")}
          </div>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML("beforeend", html);
  document.getElementById("trocaBusca").focus();
}

function filtrarTrocaAlunos() {
  const busca = document.getElementById("trocaBusca").value.toLowerCase();
  document.querySelectorAll("#trocaLista [data-nome]").forEach((el) => {
    el.style.display = el.dataset.nome.includes(busca) ? "flex" : "none";
  });
}

function fecharTrocaModal() {
  document.getElementById("trocaModal")?.remove();
}

async function confirmarTrocaResponsavel(eqId, novoUid) {
  const e = equipamentos.find((x) => x.id === eqId);
  if (!e) return;
  const anteriorUid = e.usuario;

  const ok = await dbAtualizarCampoEq(eqId, {
    usuario: novoUid,
    status: novoUid ? "em_uso" : "disponivel",
  });
  if (!ok) return;

  const mov = {
    id: "mov_" + Date.now(), eqId, uid: novoUid || anteriorUid,
    tipo: novoUid ? "emprestimo" : "devolucao",
    data: new Date().toISOString(), resp: "Sistema",
  };
  await dbRegistrarMovimentacao(mov);

  fecharTrocaModal();
  renderEquipamentos();
  renderDashboard();
  const novoU = getUsuario(novoUid);
  showToast(
    novoUid
      ? `✓ ${e.nome} atribuído a ${novoU?.nome}`
      : `↩ ${e.nome} devolvido e disponível`,
  );
}

// ---- Editar ----
function editEquipamento(id) {
  const e = equipamentos.find((x) => x.id === id);
  if (!e) return;

  document.getElementById("eqNome").value = e.nome;
  document.getElementById("eqTipo").value = e.tipo;
  document.getElementById("eqStatus").value = e.status;
  document.getElementById("eqMarca").value = e.marca;
  document.getElementById("eqModelo").value = e.modelo;
  document.getElementById("eqSerie").value = e.serie;
  document.getElementById("eqPatrimonio").value = e.patrimonio;
  document.getElementById("eqUnidade").value = e.unidade;
  document.getElementById("eqUsuario").value = e.usuario || "";
  document.getElementById("eqData").value = e.data;
  document.getElementById("eqValor").value = e.valor || "";
  document.getElementById("eqObs").value = e.obs;

  if (e.foto) {
    document.getElementById("photoZone").innerHTML = `<img src="${e.foto}">`;
    currentPhotoData = e.foto;
  }

  document.querySelector("#modal-equipamento .modal-head div").textContent =
    "Editar Equipamento";
  const btn = document.querySelector(
    "#modal-equipamento .modal-foot .btn-primary",
  );
  btn.setAttribute("data-edit-id", id);
  btn.textContent = "✓ Salvar Alterações";
  openModal("equipamento");
}

// ---- Remover ----
async function deleteEquipamento(id) {
  if (!confirm("Remover este equipamento?")) return;
  const ok = await dbDeletarEquipamento(id);
  if (!ok) return;
  renderEquipamentos();
  renderDashboard();
  showToast("🗑 Equipamento removido.");
}

// ---- Salvar (novo ou edição) ----
async function salvarEquipamento() {
  const nome = document.getElementById("eqNome").value.trim();
  const marca = document.getElementById("eqMarca").value.trim();
  const patrimonio = document.getElementById("eqPatrimonio").value.trim();

  if (!nome || !marca || !patrimonio) {
    alert("Nome, Marca e Patrimônio são obrigatórios.");
    return;
  }

  const btn = document.querySelector(
    "#modal-equipamento .modal-foot .btn-primary",
  );
  const editId = btn.getAttribute("data-edit-id");

  const eq = {
    id: editId || "eq_" + Date.now(),
    nome,
    tipo: document.getElementById("eqTipo").value,
    marca,
    modelo: document.getElementById("eqModelo").value,
    serie: document.getElementById("eqSerie").value,
    patrimonio,
    status: document.getElementById("eqStatus").value,
    unidade: document.getElementById("eqUnidade").value,
    usuario: document.getElementById("eqUsuario").value || "",
    foto: currentPhotoData,
    obs: document.getElementById("eqObs").value,
    data: document.getElementById("eqData").value || new Date().toISOString().split("T")[0],
    valor: parseFloat(document.getElementById("eqValor").value) || 0,
    epanelId: "",
    sincronizado: false,
  };

  const ok = await dbSalvarEquipamento(eq);
  if (!ok) return;

  if (editId) {
    const idx = equipamentos.findIndex((e) => e.id === editId);
    if (idx >= 0) equipamentos[idx] = eq;
  } else {
    equipamentos.unshift(eq);
  }

  closeModal("equipamento");
  renderEquipamentos();
  renderDashboard();
  showToast(editId ? "✓ Equipamento atualizado!" : "✓ Equipamento cadastrado!");
}
