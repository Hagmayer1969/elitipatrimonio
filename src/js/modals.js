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
    currentPhotoData = "";
    document.getElementById("photoZone").innerHTML = `
      <div style="text-align:center;color:var(--t3)">
        <div style="font-size:28px;margin-bottom:8px;opacity:0.5">📷</div>
        <div style="font-size:13px">Clique para adicionar foto</div>
        <div style="font-size:11px;margin-top:2px">JPG, PNG ou WebP</div>
      </div>`;
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

function previewFoto(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    currentPhotoData = ev.target.result;
    document.getElementById("photoZone").innerHTML =
      `<img src="${currentPhotoData}" style="width:100%;height:100%;object-fit:cover">`;
  };
  reader.readAsDataURL(file);
}

// Fechar modal ao clicar no overlay
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".modal-bg").forEach((m) => {
    m.addEventListener("click", (e) => {
      if (e.target === m) closeModal(m.id.replace("modal-", ""));
    });
  });
});
