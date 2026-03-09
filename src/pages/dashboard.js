// =============================================
//  ELITI PATRIMÔNIO — Dashboard
// =============================================

function renderDashboard() {
  const tipos = {};
  const total = equipamentos.length;
  equipamentos.forEach((e) => (tipos[e.tipo] = (tipos[e.tipo] || 0) + 1));

  // ---- KPIs ----
  const emUso    = equipamentos.filter(e => e.status === "em_uso").length;
  const disponiveis = equipamentos.filter(e => e.status === "disponivel").length;
  const manutencao = equipamentos.filter(e => e.status === "manutencao").length;
  const totalAlunos = usuarios.length;
  const unidadesAtivas = unidades.filter(u => u.ativa).length;
  const totalMovs = movimentacoes.length;

  const kpis = [
    { label: "Total Equipamentos", value: total,         color: "var(--orange)", icon: "💻" },
    { label: "Em Uso",             value: emUso,         color: "var(--orange)", icon: "🟠" },
    { label: "Disponíveis",        value: disponiveis,   color: "var(--green)",  icon: "✅" },
    { label: "Manutenção",         value: manutencao,    color: "#F59E0B",       icon: "🔧" },
    { label: "Alunos Cadastrados", value: totalAlunos,   color: "#3B82F6",       icon: "👤" },
    { label: "Unidades Ativas",    value: unidadesAtivas, color: "#8B5CF6",      icon: "🏢" },
    { label: "Movimentações",      value: totalMovs,     color: "#EC4899",       icon: "↔" },
  ];

  const kpisEl = document.getElementById("dashKpis");
  if (kpisEl) {
    kpisEl.innerHTML = kpis.map(k => `
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:14px 16px">
        <div style="font-size:20px;margin-bottom:6px">${k.icon}</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:22px;font-weight:700;color:${k.color}">${k.value}</div>
        <div style="font-size:10px;color:var(--t3);margin-top:3px;text-transform:uppercase;letter-spacing:0.06em">${k.label}</div>
      </div>`).join("");
  }

  // Gráfico por tipo
  document.getElementById("tipoChart").innerHTML = Object.entries(tipos)
    .sort((a, b) => b[1] - a[1])
    .map(
      ([t, c]) => `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <span style="font-size:18px;width:24px;text-align:center">${TIPO_ICON[t] || "📦"}</span>
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px">
            <span style="font-size:12px">${TIPOS[t]?.split(" ").slice(1).join(" ") || t}</span>
            <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--orange)">${c}</span>
          </div>
          <div class="prog-bar"><div class="prog-fill" style="width:${(c / total) * 100}%;background:var(--orange)"></div></div>
        </div>
      </div>`,
    )
    .join("");

  // Lista de unidades
  document.getElementById("unidadesList").innerHTML = unidades
    .map((u) => {
      const cnt = getEquipsByUnit(u.id).length;
      return `
      <div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.04)">
        <div style="width:8px;height:8px;border-radius:50%;background:${u.ativa ? u.cor : "#333"};flex-shrink:0;${u.ativa ? `box-shadow:0 0 5px ${u.cor}` : ""}"></div>
        <div style="flex:1">
          <div style="font-size:12px;color:${u.ativa ? "#F5F5F5" : "#555"}">${u.nome.split("—")[0].trim()}</div>
          <div style="font-size:10px;color:var(--t3)">${u.cidade}</div>
        </div>
        <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--t2)">${cnt} equip.</span>
      </div>`;
    })
    .join("");

  // Tabela recente
  document.getElementById("recentTable").innerHTML =
    `<thead><tr><th>Equipamento</th><th>Tipo</th><th>Status</th><th>Unidade</th><th>Responsável</th></tr></thead><tbody>` +
    [...equipamentos]
      .slice(0, 5)
      .map((e) => {
        const u = getUsuario(e.usuario);
        const un = getUnidade(e.unidade);
        return `<tr>
        <td><div style="display:flex;align-items:center;gap:9px">
          <span style="font-size:17px">${TIPO_ICON[e.tipo] || "📦"}</span>
          <div>
            <div style="font-weight:500">${e.nome}</div>
            <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--t3)">${e.patrimonio}</div>
          </div>
        </div></td>
        <td style="color:var(--t2);font-size:12px">${TIPOS[e.tipo]?.split(" ").slice(1).join(" ")}</td>
        <td>${statusBadge(e.status)}</td>
        <td style="font-size:12px;color:var(--t2)">${un?.nome.split("—")[0].trim()}</td>
        <td style="font-size:12px">${u?.nome || "—"}</td>
      </tr>`;
      })
      .join("") +
    "</tbody>";
}
