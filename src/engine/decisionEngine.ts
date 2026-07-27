import {
  ACTION_LABELS,
  CONFIDENCE_LABELS,
  CONFIDENCE_WEIGHTS,
  IMMEDIATE_DANGER_DISTANCE,
  PERSISTENT_UNCERTAINTY_CYCLES,
  REPORT_LABELS,
  SENSOR_LABELS,
} from "../constants/decision.constants.ts";
import type {
  DecisionAction,
  DecisionInput,
  DecisionResult,
  SensorReading,
} from "../types/decision.types.ts";

interface RuleSelection {
  action: DecisionAction;
  rule: string;
  justification: string;
}

const detectsObstacle = (reading: SensorReading): boolean =>
  reading.report !== "none";

const contributionFor = (reading: SensorReading): number => {
  const weight = CONFIDENCE_WEIGHTS[reading.confidence];
  return detectsObstacle(reading) ? weight : -weight;
};

function selectRule(
  input: DecisionInput,
  obstacleScore: number,
  obstaclePossible: boolean,
  conflictDetected: boolean,
): RuleSelection {
  if (
    obstaclePossible &&
    input.obstacleDistance <= IMMEDIATE_DANGER_DISTANCE
  ) {
    return {
      action: "EMERGENCY_BRAKE",
      rule: "Regla 1 · Peligro inmediato",
      justification:
        "La distancia al posible obstáculo es crítica y continuar podría provocar una colisión.",
    };
  }

  if (
    (conflictDetected || input.fusionConfidence === "low") &&
    input.consecutiveConflictCycles >= PERSISTENT_UNCERTAINTY_CYCLES
  ) {
    return {
      action: "SAFE_STOP",
      rule: "Regla 2 · Incertidumbre persistente",
      justification:
        "El sistema no recuperó suficiente confianza después de dos evaluaciones y no debe continuar avanzando normalmente.",
    };
  }

  if (
    obstacleScore > 0 ||
    input.sensors.some(
      (reading) =>
        detectsObstacle(reading) && reading.confidence === "high",
    )
  ) {
    return {
      action: "CONTROLLED_BRAKE",
      rule: "Regla 3 · Evidencia de obstáculo",
      justification:
        "Existe evidencia suficiente de que puede haber un obstáculo, aunque los sensores no coincidan en su clasificación.",
    };
  }

  if (
    obstacleScore <= 0 &&
    (conflictDetected || input.fusionConfidence === "low") &&
    input.consecutiveConflictCycles < PERSISTENT_UNCERTAINTY_CYCLES
  ) {
    return {
      action: "REDUCE_SPEED",
      rule: "Regla 4 · Conflicto sin evidencia positiva",
      justification:
        "La información no permite confirmar un obstáculo, pero tampoco permite continuar con confianza.",
    };
  }

  if (
    input.sensors.every((reading) => reading.report === "none") &&
    input.fusionConfidence !== "low" &&
    !conflictDetected
  ) {
    return {
      action: "CONTINUE_CAUTION",
      rule: "Regla 5 · Vía libre",
      justification:
        "Los sensores coinciden en que la vía está libre y la confianza global no es baja.",
    };
  }

  return {
    action: "REDUCE_SPEED",
    rule: "Regla 6 · Comportamiento por defecto",
    justification:
      "La falta de una conclusión clara no debe interpretarse como autorización para continuar normalmente.",
  };
}

function buildExplanation(
  input: DecisionInput,
  obstacleScore: number,
  existenceConflict: boolean,
  classificationConflict: boolean,
  selection: RuleSelection,
): string[] {
  const sensorSteps = input.sensors.map((reading) => {
    const contribution = contributionFor(reading);
    const sign = contribution > 0 ? "+" : "";
    const report =
      reading.report === "none"
        ? "indicó vía libre"
        : `detectó ${REPORT_LABELS[reading.report].toLowerCase()}`;
    return `${SENSOR_LABELS[reading.sensor]} ${report} con confianza ${CONFIDENCE_LABELS[
      reading.confidence
    ].toLowerCase()} y aportó ${sign}${contribution} puntos.`;
  });

  const conflictText =
    existenceConflict && classificationConflict
      ? "Existe conflicto sobre la presencia y la clasificación del objeto."
      : existenceConflict
        ? "Existe conflicto sobre la presencia del posible obstáculo."
        : classificationConflict
          ? "Existe conflicto sobre la clasificación del posible obstáculo."
          : "Los sensores no presentan conflicto de existencia ni de clasificación.";

  const obstacleSensors = input.sensors
    .filter(detectsObstacle)
    .map((reading) => SENSOR_LABELS[reading.sensor]);

  const evidenceText =
    obstacleSensors.length > 0
      ? `${obstacleSensors.join(" y ")} aportan evidencia de que existe algo delante.`
      : "Ningún sensor aporta evidencia de un obstáculo delante.";

  const distanceText =
    input.obstacleDistance <= IMMEDIATE_DANGER_DISTANCE
      ? `La distancia de ${input.obstacleDistance} metros representa un peligro inmediato en esta simulación.`
      : "La distancia no representa todavía un peligro inmediato según el supuesto académico.";

  return [
    ...sensorSteps,
    `El puntaje total fue ${obstacleScore > 0 ? "+" : ""}${obstacleScore}.`,
    conflictText,
    evidenceText,
    `La confianza global es ${CONFIDENCE_LABELS[
      input.fusionConfidence
    ].toLowerCase()}.`,
    distanceText,
    `Se aplicó la ${selection.rule.toLowerCase()}.`,
    `El vehículo selecciona: ${ACTION_LABELS[selection.action].toLowerCase()}.`,
  ];
}

export function evaluateDecision(input: DecisionInput): DecisionResult {
  const obstacleScore = input.sensors.reduce(
    (total, reading) => total + contributionFor(reading),
    0,
  );
  const obstacleReadings = input.sensors.filter(detectsObstacle);
  const existenceConflict =
    obstacleReadings.length > 0 &&
    input.sensors.some((reading) => reading.report === "none");
  const detectedTypes = new Set(
    obstacleReadings.map((reading) => reading.report),
  );
  const classificationConflict =
    obstacleReadings.length >= 2 && detectedTypes.size >= 2;
  const conflictDetected = existenceConflict || classificationConflict;
  const highConfidenceDetection = obstacleReadings.some(
    (reading) => reading.confidence === "high",
  );
  const obstaclePossible = obstacleScore > 0 || highConfidenceDetection;
  const selection = selectRule(
    input,
    obstacleScore,
    obstaclePossible,
    conflictDetected,
  );

  return {
    action: selection.action,
    obstacleScore,
    obstaclePossible,
    conflictDetected,
    existenceConflict,
    classificationConflict,
    activatedRules: [selection.rule],
    explanationSteps: buildExplanation(
      input,
      obstacleScore,
      existenceConflict,
      classificationConflict,
      selection,
    ),
    safetyJustification: selection.justification,
  };
}
