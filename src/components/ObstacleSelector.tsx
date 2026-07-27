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
  title: string;
  description: string;
}> = [
  {
    value: "pedestrian",
    icon: "♟",
    title: "Peatón",
    description: "Persona cruzando",
  },
  {
    value: "bicycle",
    icon: "◉",
    title: "Bicicleta",
    description: "Ciclista adelante",
  },
  {
    value: "vehicle",
    icon: "▰",
    title: "Vehículo",
    description: "Automóvil detenido",
  },
  {
    value: "unknown",
    icon: "?",
    title: "Desconocido",
    description: "Objeto sin identificar",
  },
  {
    value: "none",
    icon: "✓",
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
  return (
    <section className={styles.panel} aria-labelledby="obstacle-title">
      <div className={styles.header}>
        <span>ÚNICA ELECCIÓN NECESARIA</span>
        <h2 id="obstacle-title">¿Qué colocamos en la calle?</h2>
        <p>
          Al elegir una opción, la simulación comienza de nuevo automáticamente.
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
            <i aria-hidden="true">{obstacle.icon}</i>
            <span>
              <strong>{obstacle.title}</strong>
              <small>{obstacle.description}</small>
            </span>
            <em aria-hidden="true">
              {selectedObstacle === obstacle.value ? "●" : "○"}
            </em>
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
          <span>RADAR AUTOMÁTICO ACTIVO</span>
          <strong>Distancia objetivo: 12 metros</strong>
          <small>Mide y ajusta la velocidad sin intervención.</small>
        </div>
      </div>

      <div className={styles.sensorSummary}>
        <div className={styles.summaryHeader}>
          <div>
            <span>LECTURAS GENERADAS</span>
            <strong>Los sensores trabajan solos</strong>
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
        ↺ Reiniciar simulación
      </button>
    </section>
  );
}
