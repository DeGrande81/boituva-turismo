// Coordenadas e configurações de Boituva

export const BOITUVA_CENTER = {
  lat: -23.2860188,
  lng: -47.6790285,
};

export const TERMINAL_RODOVIARIO = {
  name: "Terminal Rodoviário Pedro Leonardo",
  lat: -23.28,
  lng: -47.68,
  address: "Olimpio de Barros, 100 - Jardim Oreana, Boituva - SP, 18550-000",
};

export const ONIBUS_ROUTES = {
  "6327": {
    name: "Ônibus 6327 - Iperó - Vila do Depósito",
    horarios: ["10:00", "11:15", "11:20", "12:00", "12:30"],
    destinos: [1, 2], // IDs dos pontos turísticos
    color: "#f97316", // Laranja
  },
  "6101": {
    name: "Ônibus 6101 - Sorocaba",
    horarios: ["11:15", "15:00", "16:30", "18:10"],
    destinos: [3, 7, 9], // IDs dos pontos turísticos
    color: "#1e40af", // Azul
  },
};

export const CATEGORIAS = {
  adrenalina: {
    label: "Adrenalina",
    icon: "Zap",
    color: "#f97316",
  },
  natureza: {
    label: "Natureza",
    icon: "Trees",
    color: "#10b981",
  },
  pesca: {
    label: "Pesca",
    icon: "Fish",
    color: "#06b6d4",
  },
  gastronomia: {
    label: "Gastronomia",
    icon: "UtensilsCrossed",
    color: "#ec4899",
  },
  cultura: {
    label: "Cultura",
    icon: "Building2",
    color: "#8b5cf6",
  },
  artesanato: {
    label: "Artesanato",
    icon: "Palette",
    color: "#f59e0b",
  },
  outro: {
    label: "Outros",
    icon: "MapPin",
    color: "#6b7280",
  },
};

export const MAP_OPTIONS = {
  zoom: 13,
  mapTypeControl: true,
  fullscreenControl: true,
  streetViewControl: false,
};
