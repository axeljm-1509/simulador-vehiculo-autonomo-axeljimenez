import type {
  ConfidenceLevel,
  DecisionAction,
  DecisionInput,
  SensorName,
  SensorReport,
} from "../types/decision.types.ts";

export const CONFIDENCE_WEIGHTS: Record<ConfidenceLevel, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export const IMMEDIATE_DANGER_DISTANCE = 8;
export const PERSISTENT_UNCERTAINTY_CYCLES = 2;

export const SENSOR_LABELS: Record<SensorName, string> = {
  lidar: "LIDAR",
  camera: "Cámara",
  radar: "Radar",
};

export const REPORT_LABELS: Record<SensorReport, string> = {
  none: "No hay obstáculo",
  pedestrian: "Peatón",
  bicycle: "Bicicleta",
  vehicle: "Vehículo",
  unknown: "Objeto desconocido",
};

export const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
  high: "Alta",
  medium: "Media",
  low: "Baja",
};

export const ACTION_LABELS: Record<DecisionAction, string> = {
  CONTINUE_CAUTION: "Continuar con precaución",
  REDUCE_SPEED: "Reducir velocidad y volver a evaluar",
  CONTROLLED_BRAKE: "Frenado controlado y preparación para detenerse",
  SAFE_STOP: "Detención segura por incertidumbre persistente",
  EMERGENCY_BRAKE: "Frenado de emergencia",
};

export const ORIGINAL_SCENARIO: DecisionInput = {
  sensors: [
    { sensor: "lidar", report: "pedestrian", confidence: "high" },
    { sensor: "camera", report: "none", confidence: "medium" },
    { sensor: "radar", report: "bicycle", confidence: "medium" },
  ],
  fusionConfidence: "low",
  currentSpeed: 40,
  obstacleDistance: 35,
  consecutiveConflictCycles: 1,
};
