import { CONFIDENCE_LABELS } from "../../constants/decision.constants";
import type {
  FusionConfidence,
  SensorReading,
} from "../../types/decision.types";
import SensorInput from "./SensorInput";
import styles from "./SensorControls.module.css";

interface SensorPanelProps {
  sensors: SensorReading[];
  fusionConfidence: FusionConfidence;
  initialSpeed: number;
  obstacleDistance: number;
  onSensorChange: (reading: SensorReading) => void;
  onFusionChange: (confidence: FusionConfidence) => void;
  onSpeedChange: (speed: number) => void;
  onDistanceChange: (distance: number) => void;
}

const fusionLevels = Object.keys(CONFIDENCE_LABELS) as FusionConfidence[];

export default function SensorPanel({
  sensors,
  fusionConfidence,
  initialSpeed,
  obstacleDistance,
  onSensorChange,
  onFusionChange,
  onSpeedChange,
  onDistanceChange,
}: SensorPanelProps) {
  return (
    <section className={styles.panel} aria-labelledby="configuration-title">
      <div className={styles.panelHeader}>
        <span>CONFIGURACIÓN DEL ESCENARIO</span>
        <h2 id="configuration-title">Lecturas de sensores</h2>
        <p>Ajuste los datos y evalúe cómo cambia la decisión segura.</p>
      </div>

      <div className={styles.sensorList}>
        {sensors.map((reading) => (
          <SensorInput
            key={reading.sensor}
            reading={reading}
            onChange={onSensorChange}
          />
        ))}
      </div>

      <div className={styles.globalSettings}>
        <h3>Módulo de fusión y vehículo</h3>
        <label>
          <span>Confianza global</span>
          <select
            value={fusionConfidence}
            onChange={(event) =>
              onFusionChange(event.target.value as FusionConfidence)
            }
          >
            {fusionLevels.map((confidence) => (
              <option key={confidence} value={confidence}>
                {CONFIDENCE_LABELS[confidence]}
              </option>
            ))}
          </select>
        </label>
        <div className={styles.inputGrid}>
          <label>
            <span>Velocidad inicial</span>
            <div className={styles.numberInput}>
              <input
                aria-label="Velocidad inicial en kilómetros por hora"
                type="number"
                min="0"
                max="160"
                value={initialSpeed}
                onChange={(event) =>
                  onSpeedChange(Math.max(0, Number(event.target.value)))
                }
              />
              <em>km/h</em>
            </div>
          </label>
          <label>
            <span>Distancia</span>
            <div className={styles.numberInput}>
              <input
                aria-label="Distancia al obstáculo en metros"
                type="number"
                min="0"
                max="200"
                value={obstacleDistance}
                onChange={(event) =>
                  onDistanceChange(Math.max(0, Number(event.target.value)))
                }
              />
              <em>m</em>
            </div>
          </label>
        </div>
      </div>
    </section>
  );
}
