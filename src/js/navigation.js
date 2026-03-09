// =============================================
//  ELITI PATRIMÔNIO — Navegação e Páginas
// =============================================

function showPage(id, el) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".nav-item")
    .forEach((n) => n.classList.remove("active"));
  document.getElementById("page-" + id).classList.add("active");

  if (el) el.classList.add("active");
  else
    document
      .querySelector(`.nav-item[onclick*="${id}"]`)
      ?.classList.add("active");

  if (id === "equipamentos") renderEquipamentos();
  if (id === "usuarios") {
    if (usuarios.length === 0) {
      carregarDados().then(() => { populateSelects(); renderUsuarios(); });
    } else {
      renderUsuarios();
    }
  }
  if (id === "unidades") {
    if (unidades.length === 0) {
      carregarDados().then(() => { populateSelects(); renderUnidades(); });
    } else {
      renderUnidades();
    }
  }
  if (id === "movimentacoes") {
    // Popular select de equipamentos na tela de movimentações
    const sel = document.getElementById("reconcEq");
    if (sel) {
      sel.innerHTML =
        '<option value="">Selecione...</option>' +
        equipamentos
          .map(
            (e) =>
              `<option value="${e.id}">${e.patrimonio} — ${e.nome}</option>`,
          )
          .join("");
    }
    renderTimelineMov();
  }
  if (id === "reconciliacao") {
    // Popular select de equipamentos na reconciliação
    const sel = document.getElementById("reconcEq");
    if (sel) {
      sel.innerHTML =
        '<option value="">Selecione...</option>' +
        equipamentos
          .map(
            (e) =>
              `<option value="${e.id}">${e.patrimonio} — ${e.nome}</option>`,
          )
          .join("");
    }
    renderReconciliacao();
  }
  if (id === "dashboard") renderDashboard();
}
