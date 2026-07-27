"use client";

import { useEffect } from "react";
import {
  CONFIDENCE_LABELS,
  REPORT_LABELS,
  SENSOR_LABELS,
} from "../constants/decision.constants";
import type {
  FusionConfidence,
  SensorReading,
  SensorReport,
} from "../types/decision.types";
import styles from "./ObstacleSelector.module.css";

interface ObstacleSelectorProps {
  selectedObstacle: SensorReport;
  sensors: SensorReading[];
  fusionConfidence: FusionConfidence;
  onSelect: (obstacle: SensorReport) => void;
  onRestart: () => void;
}

const OBSTACLES: Array<{
  value: SensorReport;
  icon: string;
  shortcut: string;
  title: string;
  description: string;
}> = [
  {
    value: "pedestrian",
    icon: "♙",
    shortcut: "1",
    title: "Peatón",
    description: "Persona cruzando",
  },
  {
    value: "bicycle",
    icon: "◌",
    shortcut: "2",
    title: "Bicicleta",
    description: "Ciclista adelante",
  },
  {
    value: "vehicle",
    icon: "▰",
    shortcut: "3",
    title: "Vehículo",
    description: "Automóvil detenido",
  },
  {
    value: "unknown",
    icon: "?",
    shortcut: "4",
    title: "Desconocido",
    description: "Objeto sin identificar",
  },
  {
    value: "none",
    icon: "↟",
    shortcut: "5",
    title: "Vía libre",
    description: "Sin obstáculo",
  },
];

export default function ObstacleSelector({
  selectedObstacle,
  sensors,
  fusionConfidence,
  onSelect,
  onRestart,
}: ObstacleSelectorProps) {
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;

      const target = event.target as HTMLElement | null;
      if (
        target &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
      ) {
        return;
      }

      const obstacle = OBSTACLES.find(
        (item) => item.shortcut === event.key,
      );
      if (obstacle) {
        event.preventDefault();
        onSelect(obstacle.value);
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [onSelect]);

  return (
    <section className={styles.panel} aria-labelledby="obstacle-title">
      <div className={styles.header}>
        <span>PANEL DE ESCENARIOS</span>
        <h2 id="obstacle-title">Selecciona el próximo desafío</h2>
        <p>
          Haz clic o usa las teclas 1–5. Cada elección reinicia la ronda.
        </p>
      </div>

      <div className={styles.options} role="radiogroup" aria-label="Obstáculo">
        {OBSTACLES.map((obstacle) => (
          <button
            key={obstacle.value}
            type="button"
            role="radio"
            aria-checked={selectedObstacle === obstacle.value}
            className={
              selectedObstacle === obstacle.value ? styles.selected : ""
            }
            onClick={() => onSelect(obstacle.value)}
          >
            <kbd aria-label={`Tecla ${obstacle.shortcut}`}>
              {obstacle.shortcut}
            </kbd>
            <i aria-hidden="true">{obstacle.icon}</i>
            <span>
              <strong>{obstacle.title}</strong>
              <small>{obstacle.description}</small>
            </span>
            <em aria-hidden="true">SELECCIONADO</em>
          </button>
        ))}
      </div>

      <div className={styles.radarCard}>
        <div className={styles.radarIcon} aria-hidden="true">
          <span />
          <span />
          <span />
          <i />
        </div>
        <div>
          <span>RADAR // AUTO-TRACK</span>
          <strong>Zona segura configurada a 12 metros</strong>
          <small>Escaneo y respuesta automática en tiempo real.</small>
        </div>
      </div>

      <div className={styles.sensorSummary}>
        <div className={styles.summaryHeader}>
          <div>
            <span>TELEMETRÍA DE SENSORES</span>
            <strong>Lecturas automáticas</strong>
          </div>
          <em>Fusión {CONFIDENCE_LABELS[fusionConfidence].toLowerCase()}</em>
        </div>
        {sensors.map((sensor) => (
          <div className={styles.sensorRow} key={sensor.sensor}>
            <span>{SENSOR_LABELS[sensor.sensor]}</span>
            <strong>{REPORT_LABELS[sensor.report]}</strong>
            <small>{CONFIDENCE_LABELS[sensor.confidence]}</small>
          </div>
        ))}
      </div>

      <button className={styles.restart} type="button" onClick={onRestart}>
        <span aria-hidden="true">↻</span> REINICIAR RONDA
      </button>
    </section>
  );
}
