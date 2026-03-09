// =============================================
//  ELITI PATRIMÔNIO — Movimentações
// =============================================

let movTipo = "emprestimo";

function setMovTipo(tipo) {
  movTipo = tipo;
  const emp = document.getElementById("movTipoEmp");
  const dev = document.getElementById("movTipoDev");
  const udiv = document.getElementById("movUsuarioDiv");
  const sel = document.getElementById("movEq");

  const activeStyle = {
    background: "rgba(249,115,22,0.1)",
    color: "var(--orange)",
    border: "1px solid rgba(249,115,22,0.35)",
  };
  const inactiveStyle = { background: "", color: "", border: "" };

  if (tipo === "emprestimo") {
    Object.assign(emp.style, activeStyle);
    Object.assign(dev.style, inactiveStyle);
    udiv.style.display = "block";
    sel.innerHTML =
      '<option value="">Selecione...</option>' +
      equipamentos
        .filter((e) => e.status === "disponivel")
        .map(
          (e) => `<option value="${e.id}">${e.patrimonio} — ${e.nome}</option>`,
        )
        .join("");
  } else {
    Object.assign(dev.style, activeStyle);
    Object.assign(emp.style, inactiveStyle);
    udiv.style.display = "none";
    sel.innerHTML =
      '<option value="">Selecione...</option>' +
      equipamentos
        .filter((e) => e.status === "em_uso")
        .map(
          (e) => `<option value="${e.id}">${e.patrimonio} — ${e.nome}</option>`,
        )
        .join("");
  }
}

function salvarMovimentacao() {
  const eqId = document.getElementById("movEq").value;
  const uid = document.getElementById("movUsuario").value;
  const resp = document.getElementById("movResp").value.trim();

  if (!eqId || !resp) {
    alert("Preencha todos os campos.");
    return;
  }
  if (movTipo === "emprestimo" && !uid) {
    alert("Selecione o responsável.");
    return;
  }

  const e = equipamentos.find((x) => x.id === eqId);
  const movOrigem = e?.usuario;

  if (movTipo === "emprestimo") {
    e.status = "em_uso";
    e.usuario = uid;
  } else {
    e.status = "disponivel";
    e.usuario = "";
  }

  movimentacoes.unshift({
    id: "mov_" + Date.now(),
    eqId,
    uid: movTipo === "emprestimo" ? uid : movOrigem,
    origemId: movTipo === "devolucao" ? movOrigem : null,
    tipo: movTipo,
    data: new Date().toISOString(),
    resp,
  });

  renderTimelineMov();
  closeModal("movimentacao");
  renderEquipamentos();
  showToast(
    `✓ ${movTipo === "emprestimo" ? "Empréstimo" : "Devolução"} registrado!`,
  );
}

function renderTimelineMov() {
  const el = document.getElementById("movList");
  if (!el) return;
  el.innerHTML = movimentacoes
    .map((m) => {
      const eq = equipamentos.find((x) => x.id === m.eqId);
      const u = getUsuario(m.uid);
      const cfg = {
        emprestimo: { icon: "↗", color: "var(--orange)", label: "Empréstimo" },
        devolucao: { icon: "↙", color: "var(--green)", label: "Devolução" },
      }[m.tipo];

      return `
      <div class="timeline-item">
        <div class="timeline-icon" style="background:${cfg.color}18;border:1px solid ${cfg.color}30">
          <span style="color:${cfg.color};font-size:16px">${cfg.icon}</span>
        </div>
        <div style="flex:1">
          <div style="font-size:13px"><strong style="color:${cfg.color}">${cfg.label}</strong> — ${eq?.nome || "Equipamento removido"}</div>
          <div style="font-size:11px;color:var(--t2);margin-top:2px">${u ? `→ ${u.nome}` : ""} · Por: ${m.resp}</div>
        </div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--t3);text-align:right">
          ${new Date(m.data).toLocaleDateString("pt-BR")}<br>
          ${new Date(m.data).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>`;
    })
    .join("");
}
