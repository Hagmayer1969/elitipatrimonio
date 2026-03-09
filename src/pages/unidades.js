// =============================================
//  ELITI PATRIMÔNIO — Unidades
// =============================================

function renderUnidades() {
  document.getElementById("unitGrid").innerHTML = unidades
    .map((u) => {
      const eqs = getEquipsByUnit(u.id);
      const total = eqs.length;
      const emUso = eqs.filter((e) => e.status === "em_uso").length;
      const usrs = usuarios.filter((x) => x.unidade === u.id).length;

      return `
      <div class="card" style="overflow:hidden">
        <div style="padding:22px;background:linear-gradient(135deg,${u.cor}16,${u.cor}06);border-bottom:1px solid ${u.cor}20;position:relative">
          <div style="position:absolute;top:12px;right:12px;display:flex;gap:8px;align-items:center">
            <div style="width:7px;height:7px;border-radius:50%;background:${u.ativa ? "#10B981" : "#333"};${u.ativa ? "box-shadow:0 0 6px #10B981" : ""}"></div>
          </div>
          <div style="display:flex;align-items:center;gap:12px">
            <div style="width:42px;height:42px;border-radius:11px;background:${u.cor}22;border:1px solid ${u.cor}35;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🏢</div>
            <div style="min-width:0">
              <div style="font-family:'Syne',sans-serif;font-size:14px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${u.nome}</div>
              <div style="font-size:11px;color:var(--t3);margin-top:2px">📍 ${u.end}</div>
              <div style="font-size:10px;color:var(--t3)">${u.cidade}</div>
            </div>
          </div>
        </div>
        <div style="padding:18px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
          ${[
            ["Total", total, u.cor],
            ["Em Uso", emUso, "#10B981"],
            ["Alunos", usrs, "#3B82F6"],
          ]
            .map(
              ([l, v, c]) => `
            <div style="text-align:center;padding:11px;background:rgba(255,255,255,0.02);border-radius:8px">
              <div style="font-family:'JetBrains Mono',monospace;font-size:22px;font-weight:700;color:${c}">${v}</div>
              <div style="font-size:10px;color:var(--t3);margin-top:2px">${l}</div>
            </div>`,
            )
            .join("")}
        </div>
        ${
          total > 0
            ? `
          <div style="padding:0 18px 10px">
            <div style="display:flex;justify-content:space-between;margin-bottom:5px">
              <span style="font-size:10px;color:var(--t3)">Utilização</span>
              <span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:${u.cor}">${Math.round((emUso / total) * 100)}%</span>
            </div>
            <div class="prog-bar"><div class="prog-fill" style="width:${Math.round((emUso / total) * 100)}%;background:${u.cor}"></div></div>
          </div>`
            : ""
        }
        <div style="padding:12px 18px 16px;display:flex;gap:8px;border-top:1px solid rgba(255,255,255,0.04)">
          <button class="btn btn-ghost btn-sm" style="flex:1;justify-content:center" onclick="editUnidade('${u.id}')">✎ Editar</button>
          <button class="btn btn-danger btn-sm" onclick="deleteUnidade('${u.id}')">🗑</button>
        </div>
      </div>`;
    })
    .join("");
}

// ---- Editar Unidade ----
function editUnidade(id) {
  const u = unidades.find((x) => x.id === id);
  if (!u) return;

  document.getElementById("unNome").value = u.nome;
  document.getElementById("unEnd").value = u.end;
  document.getElementById("unCidade").value = u.cidade;
  document.getElementById("unCor").value = u.cor;
  document.getElementById("unAtiva").checked = u.ativa;

  // Marca modal como edição
  const modal = document.getElementById("modal-unidade");
  modal.querySelector(".modal-head div").textContent = "Editar Unidade";
  const btn = modal.querySelector(".modal-foot .btn-primary");
  btn.setAttribute("data-edit-id", id);
  btn.textContent = "✓ Salvar Alterações";

  openModal("unidade");
}

// ---- Remover Unidade ----
function deleteUnidade(id) {
  const u = unidades.find((x) => x.id === id);
  const totalEqs = getEquipsByUnit(id).length;
  if (totalEqs > 0) {
    alert(
      `Não é possível remover "${u.nome}" pois possui ${totalEqs} equipamento(s) vinculado(s).`,
    );
    return;
  }
  if (!confirm(`Remover a unidade "${u.nome}"?`)) return;
  unidades.splice(unidades.indexOf(u), 1);
  renderUnidades();
  showToast("✓ Unidade removida!");
}

// ---- Salvar / Atualizar Unidade ----
function salvarUnidade() {
  const nome = document.getElementById("unNome").value.trim();
  if (!nome) {
    alert("Nome é obrigatório.");
    return;
  }

  const btn = document.querySelector("#modal-unidade .modal-foot .btn-primary");
  const editId = btn.getAttribute("data-edit-id");

  const dados = {
    nome,
    end: document.getElementById("unEnd").value,
    cidade: document.getElementById("unCidade").value,
    ativa: document.getElementById("unAtiva").checked,
    cor: document.getElementById("unCor").value,
  };

  if (editId) {
    const idx = unidades.findIndex((x) => x.id === editId);
    if (idx >= 0) unidades[idx] = { ...unidades[idx], ...dados };
    showToast("✓ Unidade atualizada!");
  } else {
    unidades.push({ id: "uni_" + Date.now(), ...dados });
    showToast("✓ Unidade cadastrada!");
  }

  closeModal("unidade");
  renderUnidades();
}

// ---- Reset do modal de unidade ao fechar ----
// (chamado pelo modals.js via hook — registramos aqui o reset extra)
function _resetModalUnidade() {
  document.querySelector("#modal-unidade .modal-head div").textContent =
    "Nova Unidade";
  const btn = document.querySelector("#modal-unidade .modal-foot .btn-primary");
  btn.removeAttribute("data-edit-id");
  btn.textContent = "✓ Cadastrar Unidade";
  document.getElementById("unNome").value = "";
  document.getElementById("unEnd").value = "";
  document.getElementById("unCidade").value = "";
  document.getElementById("unCor").value = "#F97316";
  document.getElementById("unAtiva").checked = true;
}
