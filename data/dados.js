// =============================================
//  ELITI PATRIMÔNIO — Constantes (lookup tables)
//  Os dados reais (equipamentos, usuarios, unidades,
//  movimentacoes) agora vêm do Supabase via src/js/supabase.js
// =============================================

const TIPOS = {
  notebook:    "💻 Notebook",
  pc:          "🖥 PC Desktop",
  monitor:     "🖵 Monitor",
  teclado:     "⌨ Teclado",
  mouse:       "🖱 Mouse",
  usb_internet:"📡 USB Internet",
  headset:     "🎧 Headset",
  webcam:      "📷 Webcam",
  cabo:        "🔌 Cabo",
  outro:       "📦 Outro",
};

const TIPO_ICON = {
  notebook:    "💻",
  pc:          "🖥",
  monitor:     "🖵",
  teclado:     "⌨",
  mouse:       "🖱",
  usb_internet:"📡",
  headset:     "🎧",
  webcam:      "📷",
  cabo:        "🔌",
  outro:       "📦",
};

const STATUS = {
  disponivel: { l: "Disponível",  c: "#10B981", b: "rgba(16,185,129,0.14)"  },
  em_uso:     { l: "Em Uso",      c: "#F97316", b: "rgba(249,115,22,0.14)"  },
  manutencao: { l: "Manutenção",  c: "#F59E0B", b: "rgba(245,158,11,0.14)" },
  descartado: { l: "Descartado",  c: "#6B7280", b: "rgba(107,114,128,0.14)"},
};

const AVATAR_COLORS = [
  "#F97316","#3B82F6","#10B981","#8B5CF6",
  "#EC4899","#F59E0B","#06B6D4","#EF4444",
];
