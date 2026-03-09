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
        const u = getUsuario(e.usuario);
        const un = getUnidade(e.unidade);
        const st = STATUS[e.status];
        return `
      <div class="card equip-card">
        <div class="equip-photo" style="${e.foto ? `background:url(${e.foto}) center/cover` : ""}">
          ${!e.foto ? `<span style="opacity:0.35;font-size:50px">${TIPO_ICON[e.tipo] || "📦"}</span>` : ""}
          <div class="eq-badge-pos"><span class="badge" style="color:${st.c};background:${st.b}">${st.l}</span></div>
          ${e.sincronizado ? '<div class="eq-epanel-pos">EPANEL ✓</div>' : ""}
        </div>
        <div class="equip-body">
          <div class="equip-name">${e.nome}</div>
          <div class="equip-code">${e.patrimonio} · ${e.marca} ${e.modelo}</div>
          <hr style="margin:10px 0;border-color:rgba(255,255,255,0.06)">
          ${
            u
              ? `<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">
            <div style="width:22px;height:22px;border-radius:50%;background:var(--orange);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:white;flex-shrink:0">${u.nome[0]}</div>
            <span style="font-size:12px">${u.nome}</span>
          </div>`
              : ""
          }
          <div style="font-size:11px;color:var(--t3);margin-bottom:${e.obs ? "5px" : "0"}">📍 ${un?.nome.split("—")[0].trim()}</div>
          ${e.obs ? `<div style="font-size:11px;color:var(--t3);padding:6px 8px;background:rgba(255,255,255,0.02);border-radius:6px;margin-top:6px">${e.obs}</div>` : ""}
          ${e.valor ? `<div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--t2);margin-top:6px">R$ ${e.valor.toLocaleString("pt-BR")}</div>` : ""}
          <div style="display:flex;gap:7px;margin-top:12px">
            <button class="btn btn-ghost btn-sm" style="flex:1;justify-content:center" onclick="editEquipamento('${e.id}')">✎ Editar</button>
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
function deleteEquipamento(id) {
  if (!confirm("Remover este equipamento?")) return;
  equipamentos = equipamentos.filter((e) => e.id !== id);
  renderEquipamentos();
  renderDashboard();
}

// ---- Salvar (novo ou edição) ----
function salvarEquipamento() {
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

  const data = {
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
    data:
      document.getElementById("eqData").value ||
      new Date().toISOString().split("T")[0],
    valor: parseFloat(document.getElementById("eqValor").value) || 0,
    epanelId: "",
    sincronizado: false,
  };

  if (editId) {
    const idx = equipamentos.findIndex((e) => e.id === editId);
    if (idx >= 0) equipamentos[idx] = { ...equipamentos[idx], ...data };
  } else {
    equipamentos.unshift({ id: "eq_" + Date.now(), ...data });
  }

  closeModal("equipamento");
  renderEquipamentos();
  renderDashboard();
  showToast(editId ? "✓ Equipamento atualizado!" : "✓ Equipamento cadastrado!");
}
