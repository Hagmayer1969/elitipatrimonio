// =============================================
//  ELITI PATRIMÔNIO — Supabase Client
// =============================================

const SUPABASE_URL = "https://zsulimtntsqtssbvreyy.supabase.co";
const SUPABASE_KEY = "sb_publishable_KeWRR1rDCjp-l7EFzQe1FQ_8oRxGuNp";

const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

// =============================================
//  Estado local (cache em memória)
// =============================================
let equipamentos = [];
let usuarios = [];
let unidades = [];
let movimentacoes = [];

// =============================================
//  Carregamento inicial — busca tudo do Supabase
// =============================================
async function carregarDados() {
  showLoadingOverlay(true);
  try {
    const [eqRes, usrRes, unRes, movRes] = await Promise.all([
      sb.from("equipamentos").select("*").order("nome"),
      sb.from("usuarios").select("*").order("nome"),
      sb.from("unidades").select("*").order("nome"),
      sb
        .from("movimentacoes")
        .select("*")
        .order("data", { ascending: false })
        .limit(200),
    ]);

    if (eqRes.error) throw eqRes.error;
    if (usrRes.error) throw usrRes.error;
    if (unRes.error) throw unRes.error;
    if (movRes.error) throw movRes.error;

    // Mapear snake_case → camelCase para compatibilidade com o código existente
    equipamentos = (eqRes.data || []).map(mapEq);
    usuarios = (usrRes.data || []).map(mapUsr);
    unidades = (unRes.data || []).map(mapUn);
    movimentacoes = (movRes.data || []).map(mapMov);
  } catch (err) {
    console.error("Erro ao carregar dados:", err);
    showToast("⚠ Erro ao conectar com o banco. Verifique a conexão.");
  } finally {
    showLoadingOverlay(false);
  }
}

// =============================================
//  Mapeadores snake_case ↔ camelCase
// =============================================
function mapEq(r) {
  return {
    id: r.id,
    nome: r.nome || "",
    tipo: r.tipo || "",
    status: r.status || "disponivel",
    marca: r.marca || "",
    modelo: r.modelo || "",
    serie: r.serie || "",
    patrimonio: r.patrimonio || "",
    unidade: r.unidade || "",
    usuario: r.usuario || "",
    foto: r.foto || "",
    obs: r.obs || "",
    data: r.data || "",
    valor: r.valor || 0,
    epanelId: r.epanel_id || "",
    sincronizado: r.sincronizado || false,
  };
}

function mapUsr(r) {
  return {
    id: r.id,
    nome: r.nome || "",
    email: r.email || "",
    tel: r.tel || "",
    turma: r.turma || "",
    unidade: r.unidade || "",
    ativo: r.ativo !== false,
    obs: r.obs || "",
    epanelId: r.epanel_id || "",
  };
}

function mapUn(r) {
  return {
    id: r.id,
    nome: r.nome || "",
    end: r.endereco || "",
    cidade: r.cidade || "",
    cor: r.cor || "#F97316",
    ativa: r.ativa !== false,
  };
}

function mapMov(r) {
  return {
    id: r.id,
    eqId: r.eq_id || "",
    uid: r.uid || "",
    tipo: r.tipo || "",
    data: r.data || new Date().toISOString(),
    resp: r.resp || "",
    obs: r.obs || "",
  };
}

function eqToDb(e) {
  return {
    id: e.id,
    nome: e.nome,
    tipo: e.tipo,
    status: e.status,
    marca: e.marca,
    modelo: e.modelo,
    serie: e.serie,
    patrimonio: e.patrimonio,
    unidade: e.unidade || null,
    usuario: e.usuario || null,
    foto: e.foto,
    obs: e.obs,
    data: e.data,
    valor: e.valor || null,
    epanel_id: e.epanelId,
    sincronizado: e.sincronizado,
  };
}

function unToDb(u) {
  return {
    id: u.id,
    nome: u.nome,
    endereco: u.end,
    cidade: u.cidade,
    cor: u.cor,
    ativa: u.ativa,
  };
}

// =============================================
//  CRUD — Equipamentos
// =============================================
async function dbSalvarEquipamento(eq) {
  const { error } = await sb.from("equipamentos").upsert(eqToDb(eq));
  if (error) {
    console.error(error);
    showToast("⚠ Erro ao salvar equipamento.");
    return false;
  }
  return true;
}

async function dbDeletarEquipamento(id) {
  const { error } = await sb.from("equipamentos").delete().eq("id", id);
  if (error) {
    console.error(error);
    showToast("⚠ Erro ao deletar equipamento.");
    return false;
  }
  equipamentos = equipamentos.filter((e) => e.id !== id);
  return true;
}

async function dbAtualizarCampoEq(id, campos) {
  // campos = objeto com os campos a atualizar, ex: { usuario: "usr1", status: "em_uso" }
  const dbCampos = {};
  if ("usuario" in campos) dbCampos.usuario = campos.usuario || null;
  if ("status" in campos) dbCampos.status = campos.status;
  if ("patrimonio" in campos) dbCampos.patrimonio = campos.patrimonio;
  if ("serie" in campos) dbCampos.serie = campos.serie;
  if ("marca" in campos) dbCampos.marca = campos.marca;
  if ("modelo" in campos) dbCampos.modelo = campos.modelo;
  if ("sincronizado" in campos) dbCampos.sincronizado = campos.sincronizado;

  const { error } = await sb.from("equipamentos").update(dbCampos).eq("id", id);
  if (error) {
    console.error(error);
    showToast("⚠ Erro ao atualizar equipamento.");
    return false;
  }

  // Atualiza cache local
  const eq = equipamentos.find((e) => e.id === id);
  if (eq) Object.assign(eq, campos);
  return true;
}

// =============================================
//  CRUD — Movimentações
// =============================================
async function dbRegistrarMovimentacao(mov) {
  const dbMov = {
    id: mov.id,
    eq_id: mov.eqId || null,
    uid: mov.uid || null,
    tipo: mov.tipo,
    data: mov.data || new Date().toISOString(),
    resp: mov.resp || "Sistema",
    obs: mov.obs || "",
  };
  const { error } = await sb.from("movimentacoes").insert(dbMov);
  if (error) console.error("Erro ao registrar movimentação:", error);
  else movimentacoes.unshift(mov);
}

// =============================================
//  CRUD — Unidades
// =============================================
async function dbSalvarUnidade(un) {
  const { error } = await sb.from("unidades").upsert(unToDb(un));
  if (error) {
    console.error(error);
    showToast("⚠ Erro ao salvar unidade.");
    return false;
  }
  return true;
}

async function dbDeletarUnidade(id) {
  const { error } = await sb.from("unidades").delete().eq("id", id);
  if (error) {
    console.error(error);
    showToast("⚠ Erro ao deletar unidade.");
    return false;
  }
  unidades = unidades.filter((u) => u.id !== id);
  return true;
}

// =============================================
//  CRUD — Usuários
// =============================================
async function dbSalvarUsuario(usr) {
  const { error } = await sb.from("usuarios").upsert({
    id: usr.id,
    nome: usr.nome,
    email: usr.email || "",
    tel: usr.tel || "",
    turma: usr.turma || "",
    unidade: usr.unidade || null,
    ativo: usr.ativo !== false,
    obs: usr.obs || "",
    epanel_id: usr.epanelId || null,
  });
  if (error) {
    console.error(error);
    showToast("⚠ Erro ao salvar aluno.");
    return false;
  }
  return true;
}

// =============================================
//  Loading overlay
// =============================================
function showLoadingOverlay(show) {
  let el = document.getElementById("loadingOverlay");
  if (!el) {
    el = document.createElement("div");
    el.id = "loadingOverlay";
    el.style.cssText = `
      position:fixed;inset:0;background:rgba(10,10,10,0.85);
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      z-index:9999;gap:16px;
    `;
    el.innerHTML = `
      <div style="width:40px;height:40px;border:3px solid rgba(249,115,22,0.3);border-top-color:var(--orange);border-radius:50%;animation:spin 0.7s linear infinite"></div>
      <div style="font-family:'Syne',sans-serif;color:var(--t2);font-size:14px">Carregando dados...</div>
    `;
    document.body.appendChild(el);
  }
  el.style.display = show ? "flex" : "none";
}
