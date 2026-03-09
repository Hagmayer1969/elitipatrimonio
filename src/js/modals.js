// =============================================
//  ELITI PATRIMÔNIO — Modais
// =============================================

function openModal(id) {
  document.getElementById("modal-" + id).style.display = "flex";
  document.body.style.overflow = "hidden";
  if (id === "movimentacao") setMovTipo("emprestimo");
}

function closeModal(id) {
  document.getElementById("modal-" + id).style.display = "none";
  document.body.style.overflow = "";

  if (id === "equipamento") {
    fecharCamera();        // para stream de câmera se estiver aberto
    removerFotoEq();       // reseta UI de foto
    currentPhotoData = "";
    document.querySelector("#modal-equipamento .modal-head div").textContent =
      "Novo Equipamento";
    const btn = document.querySelector(
      "#modal-equipamento .modal-foot .btn-primary",
    );
    btn.removeAttribute("data-edit-id");
    btn.textContent = "✓ Cadastrar Equipamento";
  }

  if (id === "unidade") {
    // _resetModalUnidade é definido em unidades.js
    if (typeof _resetModalUnidade === "function") _resetModalUnidade();
  }
}

// Fechar modal ao clicar no overlay
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".modal-bg").forEach((m) => {
    m.addEventListener("click", (e) => {
      if (e.target === m) closeModal(m.id.replace("modal-", ""));
    });
  });
});
