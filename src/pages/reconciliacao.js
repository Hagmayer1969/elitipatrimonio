// =============================================
//  ELITI PATRIMÔNIO — Reconciliação (ePainel)
// =============================================

function renderReconciliacao() {
  // ---- Painel de status ----
  const total      = equipamentos.length;
  const comEpanel  = equipamentos.filter(e => e.epanelId).length;
  const semEpanel  = total - comEpanel;
  const sincronizados = equipamentos.filter(e => e.sincronizado).length;
  const pendentes  = equipamentos.filter(e => e.epanelId && !e.sincronizado).length;
  const semResponsavel = equipamentos.filter(e => e.status === "em_uso" && !e.usuario).length;

  // Stats cards no topo
  const statsEl = document.getElementById("reconcStats");
  if (statsEl) {
    statsEl.innerHTML = [
      { label: "Total Equip.",        value: total,           color: "var(--t2)" },
      { label: "Vinculados ePainel",  value: comEpanel,       color: "var(--green)" },
      { label: "Sem vínculo",         value: semEpanel,       color: "var(--orange)" },
      { label: "Sincronizados",       value: sincronizados,   color: "var(--green)" },
      { label: "Pendentes sync",      value: pendentes,       color: "#F59E0B" },
      { label: "Em uso s/ responsável", value: semResponsavel, color: "#EF4444" },
    ].map(s => `
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:12px 14px;text-align:center">
        <div style="font-family:'JetBrains Mono',monospace;font-size:20px;font-weight:700;color:${s.color}">${s.value}</div>
        <div style="font-size:10px;color:var(--t3);margin-top:3px;text-transform:uppercase;letter-spacing:0.05em">${s.label}</div>
      </div>`).join("");
  }

  // Lista com ID do ePainel
  const sinc = equipamentos.filter((e) => e.epanelId);
  document.getElementById("sincList").innerHTML = sinc.length === 0
    ? `<p style="font-size:12px;color:var(--t3);font-style:italic">Nenhum equipamento vinculado ao ePainel ainda.</p>`
    : sinc.map((e) => {
        const u = getUsuario(e.usuario);
        const un = getUnidade(e.unidade);
        return `
    <div style="display:flex;align-items:center;gap:8px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:12px">
      <span style="font-size:15px">${TIPO_ICON[e.tipo] || "📦"}</span>
      <div style="flex:1">
        <div style="font-size:12px;font-weight:500">${e.nome}</div>
        <div style="font-size:10px;color:var(--t3)">${un?.nome.split("—")[0].trim() || "—"} · ${u ? u.nome : "Sem responsável"}</div>
      </div>
      <span style="font-family:'JetBrains Mono',monospace;color:var(--t3);font-size:10px">${e.epanelId}</span>
      <span title="${e.sincronizado ? "Sincronizado" : "Pendente"}">${e.sincronizado ? "✅" : "⏳"}</span>
    </div>`}).join("");

  // Tabela de divergências — sem vínculo ePainel OU em_uso sem responsável
  const divergencias = equipamentos.filter(e => !e.epanelId || (e.status === "em_uso" && !e.usuario));
  document.getElementById("reconcTable").innerHTML =
    `<thead><tr><th>Equipamento</th><th>Patrimônio</th><th>Status</th><th>Problema</th><th>Ação</th></tr></thead><tbody>` +
    (divergencias.length === 0
      ? `<tr><td colspan="5" style="text-align:center;color:var(--green);padding:20px">✅ Nenhuma divergência encontrada!</td></tr>`
      : divergencias.map((e) => {
          const problema = !e.epanelId
            ? `<span style="color:var(--orange);font-size:11px">Sem ID ePainel</span>`
            : `<span style="color:#EF4444;font-size:11px">Em uso sem responsável</span>`;
          return `
      <tr>
        <td><div style="display:flex;align-items:center;gap:8px"><span style="font-size:16px">${TIPO_ICON[e.tipo] || "📦"}</span><span>${e.nome}</span></div></td>
        <td><span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--t3)">${e.patrimonio}</span></td>
        <td>${statusBadge(e.status)}</td>
        <td>${problema}</td>
        <td><button class="btn btn-ghost btn-sm" onclick="document.getElementById('reconcEq').value='${e.id}'">Vincular</button></td>
      </tr>`;
        }).join("")) +
    "</tbody>";
}

function vincularEpanel() {
  const eqId = document.getElementById("reconcEq").value;
  const id = document.getElementById("reconcId").value.trim();
  if (!eqId || !id) {
    alert("Selecione o equipamento e informe o ID.");
    return;
  }

  const e = equipamentos.find((x) => x.id === eqId);
  if (e) {
    e.epanelId = id;
    e.sincronizado = true;
  }

  document.getElementById("reconcEq").value = "";
  document.getElementById("reconcId").value = "";
  renderReconciliacao();
  showToast("✓ Equipamento vinculado ao ePainel!");
}

function sincronizarLote(btn) {
  btn.textContent = "⟳ Sincronizando...";
  btn.disabled = true;
  setTimeout(() => {
    equipamentos.forEach((e) => {
      if (e.epanelId) e.sincronizado = true;
    });
    btn.textContent = "⟳ Sincronizar Agora";
    btn.disabled = false;
    renderReconciliacao();
    showToast("✓ Sincronização concluída!");
  }, 1800);
}
