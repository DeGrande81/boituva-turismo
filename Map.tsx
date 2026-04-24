/// <reference types="@types/google.maps" />

import { useEffect, useRef } from "react";
import { usePersistFn } from "@/hooks/usePersistFn";
import { cn } from "@/lib/utils";
import { BOITUVA_CENTER, TERMINAL_RODOVIARIO, MAP_OPTIONS, CATEGORIAS } from "@/lib/constants";

declare global {
  interface Window {
    google?: typeof google;
  }
}

interface PontoTuristico {
  id: number;
  nome: string;
  endereco: string;
  conducao: string;
  descricao: string;
  categoria: string;
}

interface MapViewProps {
  className?: string;
  pontosTuristicos?: PontoTuristico[];
  pontoSelecionado?: PontoTuristico | null;
  onPontoSelect?: (ponto: PontoTuristico) => void;
  onMapReady?: (map: google.maps.Map) => void;
}

const API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;
const FORGE_BASE_URL =
  import.meta.env.VITE_FRONTEND_FORGE_API_URL ||
  "https://forge.butterfly-effect.dev";
const MAPS_PROXY_URL = `${FORGE_BASE_URL}/v1/maps/proxy`;

function loadMapScript() {
  return new Promise(resolve => {
    const script = document.createElement("script");
    script.src = `${MAPS_PROXY_URL}/maps/api/js?key=${API_KEY}&v=weekly&libraries=marker,places,geocoding,geometry,routes`;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      resolve(null);
      script.remove();
    };
    script.onerror = () => {
      console.error("Failed to load Google Maps script");
    };
    document.head.appendChild(script);
  });
}

/**
 * Componente de Mapa Interativo para Boituva Turismo
 * Exibe pontos turísticos e rotas de ônibus
 * Design: Modernismo Ousado com Gradientes Dinâmicos
 */
export function MapView({
  className,
  pontosTuristicos = [],
  pontoSelecionado = null,
  onPontoSelect,
  onMapReady,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  // Coordenadas aproximadas dos pontos turísticos
  const coordenadasPontos: Record<number, { lat: number; lng: number }> = {
    1: { lat: -23.28, lng: -47.67 },
    2: { lat: -23.28, lng: -47.67 },
    3: { lat: -23.29, lng: -47.68 },
    4: { lat: -23.30, lng: -47.69 },
    5: { lat: -23.27, lng: -47.70 },
    6: { lat: -23.30, lng: -47.68 },
    7: { lat: -23.29, lng: -47.67 },
    8: { lat: -23.30, lng: -47.68 },
    9: { lat: -23.28, lng: -47.66 },
    10: { lat: -23.31, lng: -47.69 },
    11: { lat: -23.30, lng: -47.68 },
    12: { lat: -23.32, lng: -47.67 },
    13: { lat: -23.28, lng: -47.65 },
  };

  const init = usePersistFn(async () => {
    await loadMapScript();
    if (!mapContainer.current) {
      console.error("Map container not found");
      return;
    }

    map.current = new window.google.maps.Map(mapContainer.current, {
      zoom: MAP_OPTIONS.zoom,
      center: BOITUVA_CENTER,
      mapTypeControl: MAP_OPTIONS.mapTypeControl,
      fullscreenControl: MAP_OPTIONS.fullscreenControl,
      streetViewControl: MAP_OPTIONS.streetViewControl,
      styles: [
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#e9e9e9" }, { lightness: 17 }],
        },
        {
          featureType: "landscape",
          elementType: "geometry",
          stylers: [{ color: "#f3f3f3" }, { lightness: 20 }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.fill",
          stylers: [{ color: "#ffffff" }, { lightness: 17 }],
        },
        {
          featureType: "road.arterial",
          elementType: "geometry.fill",
          stylers: [{ color: "#ffffff" }, { lightness: 16 }],
        },
        {
          featureType: "road.local",
          elementType: "geometry.fill",
          stylers: [{ color: "#ffffff" }, { lightness: 16 }],
        },
      ],
    });

    directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
      map: map.current,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#f97316",
        strokeWeight: 3,
        strokeOpacity: 0.7,
      },
    });

    // Adicionar marcador do Terminal Rodoviário
    const terminalMarker = new window.google.maps.Marker({
      position: { lat: TERMINAL_RODOVIARIO.lat, lng: TERMINAL_RODOVIARIO.lng },
      map: map.current,
      title: TERMINAL_RODOVIARIO.name,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#1e40af",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      },
    });

    const infoWindowTerminal = new window.google.maps.InfoWindow({
      content: `<div style="padding: 8px; font-size: 12px; font-family: Inter, sans-serif;"><strong style="color: #1e40af;">${TERMINAL_RODOVIARIO.name}</strong><br/><span style="color: #666;">${TERMINAL_RODOVIARIO.address}</span></div>`,
    });

    terminalMarker.addListener("click", () => {
      infoWindowTerminal.open(map.current, terminalMarker);
    });

    if (onMapReady) {
      onMapReady(map.current);
    }
  });

  // Atualizar marcadores quando pontos turísticos mudam
  useEffect(() => {
    if (!map.current) return;

    // Limpar marcadores anteriores
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    // Adicionar novos marcadores
    pontosTuristicos.forEach((ponto) => {
      const coords = coordenadasPontos[ponto.id] || BOITUVA_CENTER;
      const cat = CATEGORIAS[ponto.categoria as keyof typeof CATEGORIAS];
      const isSelected = pontoSelecionado?.id === ponto.id;

      const marker = new window.google.maps.Marker({
        position: coords,
        map: map.current,
        title: ponto.nome,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: isSelected ? 12 : 8,
          fillColor: cat?.color || "#6b7280",
          fillOpacity: isSelected ? 1 : 0.8,
          strokeColor: isSelected ? "#ffffff" : "#f3f3f3",
          strokeWeight: isSelected ? 3 : 2,
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style="padding: 8px; font-size: 12px; font-family: Inter, sans-serif;"><strong style="color: ${cat?.color};">${ponto.nome}</strong><br/><span style="color: #666;">${ponto.descricao.substring(0, 60)}...</span></div>`,
      });

      marker.addListener("click", () => {
        if (onPontoSelect) {
          onPontoSelect(ponto);
        }
        infoWindow.open(map.current, marker);
      });

      markersRef.current.push(marker);
    });

    // Ajustar zoom para mostrar todos os pontos
    if (pontosTuristicos.length > 0 && map.current) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend({ lat: TERMINAL_RODOVIARIO.lat, lng: TERMINAL_RODOVIARIO.lng });
      pontosTuristicos.forEach((ponto) => {
        const coords = coordenadasPontos[ponto.id] || BOITUVA_CENTER;
        bounds.extend(coords);
      });
      map.current.fitBounds(bounds, 50);
    }
  }, [pontosTuristicos, pontoSelecionado, onPontoSelect]);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div ref={mapContainer} className={cn("w-full h-full", className)} />
  );
}

export default MapView;
