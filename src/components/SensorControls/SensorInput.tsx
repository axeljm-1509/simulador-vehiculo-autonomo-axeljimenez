import {
  CONFIDENCE_LABELS,
  REPORT_LABELS,
  SENSOR_LABELS,
} from "../../constants/decision.constants";
import type {
  ConfidenceLevel,
  SensorReading,
  SensorReport,
} from "../../types/decision.types";
import styles from "./SensorControls.module.css";

interface SensorInputProps {
  reading: SensorReading;
  onChange: (reading: SensorReading) => void;
}

const reports = Object.keys(REPORT_LABELS) as SensorReport[];
const confidences = Object.keys(CONFIDENCE_LABELS) as ConfidenceLevel[];

export default function SensorInput({
  reading,
  onChange,
}: SensorInputProps) {
  const detecting = reading.report !== "none";

  return (
    <fieldset className={styles.sensorCard}>
      <legend>
        <span className={`${styles.sensorDot} ${styles[reading.sensor]}`} />
        {SENSOR_LABELS[reading.sensor]}
        <i className={detecting ? styles.detecting : styles.clear}>
          {detecting ? "Detecta objeto" : "Vía libre"}
        </i>
      </legend>

      <label>
        <span>Reporte</span>
        <select
          value={reading.report}
          onChange={(event) =>
            onChange({
              ...reading,
              report: event.target.value as SensorReport,
            })
          }
        >
          {reports.map((report) => (
            <option key={report} value={report}>
              {REPORT_LABELS[report]}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Confianza</span>
        <select
          value={reading.confidence}
          onChange={(event) =>
            onChange({
              ...reading,
              confidence: event.target.value as ConfidenceLevel,
            })
          }
        >
          {confidences.map((confidence) => (
            <option key={confidence} value={confidence}>
              {CONFIDENCE_LABELS[confidence]}
            </option>
          ))}
        </select>
      </label>
    </fieldset>
  );
}
