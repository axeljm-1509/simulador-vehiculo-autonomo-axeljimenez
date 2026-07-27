export type SensorName = "lidar" | "camera" | "radar";

export type SensorReport =
  | "none"
  | "pedestrian"
  | "bicycle"
  | "vehicle"
  | "unknown";

export type ConfidenceLevel = "high" | "medium" | "low";

export type FusionConfidence = "high" | "medium" | "low";

export type DecisionAction =
  | "CONTINUE_CAUTION"
  | "REDUCE_SPEED"
  | "CONTROLLED_BRAKE"
  | "SAFE_STOP"
  | "EMERGENCY_BRAKE";

export type SimulationStatus =
  | "idle"
  | "running"
  | "paused"
  | "braking"
  | "stopped"
  | "emergency";

export interface SensorReading {
  sensor: SensorName;
  report: SensorReport;
  confidence: ConfidenceLevel;
}

export interface DecisionInput {
  sensors: SensorReading[];
  fusionConfidence: FusionConfidence;
  currentSpeed: number;
  obstacleDistance: number;
  consecutiveConflictCycles: number;
}

export interface DecisionResult {
  action: DecisionAction;
  obstacleScore: number;
  obstaclePossible: boolean;
  conflictDetected: boolean;
  existenceConflict: boolean;
  classificationConflict: boolean;
  activatedRules: string[];
  explanationSteps: string[];
  safetyJustification: string;
}
