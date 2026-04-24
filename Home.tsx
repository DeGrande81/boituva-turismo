import { useEffect, useState } from "react";
import { MapPin, Bus, Filter, Search, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import MapView from "@/components/Map";
import pontosTuristicos from "@/data/pontos_turisticos.json";
import { imagensPontos } from "@/data/imagens";
import { CATEGORIAS, ONIBUS_ROUTES, TERMINAL_RODOVIARIO } from "@/lib/constants";

interface PontoTuristico {
  id: number;
  nome: string;
  endereco: string;
  conducao: string;
  descricao: string;
  categoria: string;
}

/**
 * Home Page - Localizador de Pontos Turísticos em Boituva
 * Design: Modernismo Ousado com Gradientes Dinâmicos
 * Cores: Azul (#1e40af) + Laranja (#f97316) + Verde (#10b981)
 */
export default function Home() {
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todos");
  const [busca, setBusca] = useState<string>("");
  const [pontoSelecionado, setPontoSelecionado] = useState<PontoTuristico | null>(null);
  const [pontosFiltrados, setPontosFiltrados] = useState<PontoTuristico[]>(pontosTuristicos);

  // Filtrar pontos turísticos
  useEffect(() => {
    let filtrados = pontosTuristicos as PontoTuristico[];

    // Filtrar por categoria
    if (filtroCategoria !== "todos") {
      filtrados = filtrados.filter((p) => p.categoria === filtroCategoria);
    }

    // Filtrar por busca
    if (busca.trim()) {
      const buscaLower = busca.toLowerCase();
      filtrados = filtrados.filter(
        (p) =>
          p.nome.toLowerCase().includes(buscaLower) ||
          p.descricao.toLowerCase().includes(buscaLower) ||
          p.endereco.toLowerCase().includes(buscaLower)
      );
    }

    setPontosFiltrados(filtrados);
  }, [filtroCategoria, busca]);

  const categoriasList = Object.entries(CATEGORIAS);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-primary to-accent p-2">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">Boituva Turismo</h1>
                <p className="text-xs text-muted-foreground">Rotas de Ônibus</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <Bus className="h-4 w-4" />
              <span>Saindo do Terminal Rodoviário</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-40 lg:h-56 overflow-hidden bg-gradient-to-r from-primary via-accent to-primary">
        <div className="absolute inset-0 opacity-20" />
        <div className="container h-full flex flex-col justify-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">Explore Boituva</h2>
          <p className="text-white/90 text-sm lg:text-base">Descubra os melhores pontos turísticos com rotas de ônibus a partir do terminal rodoviário</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 lg:p-6 max-w-7xl mx-auto">
        {/* Sidebar - Filtros e Lista */}
        <div className="lg:col-span-1 space-y-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar atração..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filtros por Categoria */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Categorias</span>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setFiltroCategoria("todos")}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  filtroCategoria === "todos"
                    ? "bg-primary text-primary-foreground font-medium"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                Todos ({pontosTuristicos.length})
              </button>
              {categoriasList.map(([key, cat]) => {
                const count = pontosTuristicos.filter((p) => p.categoria === key).length;
                return (
                  <button
                    key={key}
                    onClick={() => setFiltroCategoria(key)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                      filtroCategoria === key
                        ? "bg-primary text-primary-foreground font-medium"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span>
                      {cat.label} ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Terminal Rodoviário Info */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Bus className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Terminal Rodoviário</span>
            </div>
            <p className="text-xs text-muted-foreground">{TERMINAL_RODOVIARIO.address}</p>
          </div>

          {/* Lista de Pontos */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {pontosFiltrados.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">Nenhum ponto encontrado</p>
              </div>
            ) : (
              pontosFiltrados.map((ponto) => {
                const cat = CATEGORIAS[ponto.categoria as keyof typeof CATEGORIAS];
                const temOnibus = ponto.conducao.includes("Onibus") || ponto.conducao.includes("ônibus");
                
                return (
                  <button
                    key={ponto.id}
                    onClick={() => setPontoSelecionado(ponto)}
                    className={`w-full text-left card-atracacao group ${
                      pontoSelecionado?.id === ponto.id ? "ring-2 ring-accent" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className="h-3 w-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: cat.color }}
                          />
                          <p className="text-sm font-semibold text-foreground truncate">{ponto.nome}</p>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{ponto.descricao}</p>
                        {temOnibus && (
                          <div className="mt-2 flex items-center gap-1">
                            <span className="badge-onibus">Ônibus</span>
                          </div>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent flex-shrink-0" />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Mapa e Detalhes */}
        <div className="lg:col-span-2 space-y-4">
          {/* Mapa */}
          <div className="rounded-lg overflow-hidden border border-border shadow-lg h-96 lg:h-[500px]">
            <MapView
              pontosTuristicos={pontosFiltrados}
              pontoSelecionado={pontoSelecionado}
              onPontoSelect={setPontoSelecionado}
            />
          </div>

          {/* Detalhes do Ponto Selecionado */}
          {pontoSelecionado && (
            <div className="card-atracacao space-y-4 animate-fade-in overflow-hidden">
              {/* Imagem do ponto (se disponível) */}
              {imagensPontos[pontoSelecionado.id] && (
                <div className="relative h-48 -m-4 mb-4 overflow-hidden rounded-t-lg">
                  <img
                    src={imagensPontos[pontoSelecionado.id]}
                    alt={pontoSelecionado.nome}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{pontoSelecionado.nome}</h2>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      {pontoSelecionado.endereco}
                    </p>
                  </div>
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: CATEGORIAS[pontoSelecionado.categoria as keyof typeof CATEGORIAS]?.color,
                    }}
                  >
                    <span className="text-white text-xs font-bold">
                      {CATEGORIAS[pontoSelecionado.categoria as keyof typeof CATEGORIAS]?.label[0]}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-foreground leading-relaxed">{pontoSelecionado.descricao}</p>

              {/* Informações de Transporte */}
              <div className="space-y-3 border-t border-border pt-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Bus className="h-4 w-4 text-accent" />
                  Como chegar
                </h3>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {pontoSelecionado.conducao}
                </p>

                {/* Linhas de Ônibus Disponíveis */}
                {Object.entries(ONIBUS_ROUTES).map(([key, route]) => {
                  if (route.destinos.includes(pontoSelecionado.id)) {
                    return (
                      <div key={key} className="rounded-lg bg-muted p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: route.color }}
                          />
                          <span className="font-semibold text-sm text-foreground">{route.name}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {route.horarios.map((horario) => (
                            <span
                              key={horario}
                              className="text-xs px-2 py-1 rounded bg-background text-foreground font-medium"
                            >
                              {horario}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Obter Direções
              </Button>
            </div>
          )}

          {!pontoSelecionado && (
            <div className="card-atracacao flex flex-col items-center justify-center py-12 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Selecione um ponto turístico para ver detalhes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
