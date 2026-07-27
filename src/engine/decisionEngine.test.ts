import assert from "node:assert/strict";
import test from "node:test";
import { ORIGINAL_SCENARIO } from "../constants/decision.constants.ts";
import type { DecisionInput } from "../types/decision.types.ts";
import { evaluateDecision } from "./decisionEngine.ts";

const allClear: DecisionInput = {
  sensors: [
    { sensor: "lidar", report: "none", confidence: "high" },
    { sensor: "camera", report: "none", confidence: "medium" },
    { sensor: "radar", report: "none", confidence: "medium" },
  ],
  fusionConfidence: "high",
  currentSpeed: 40,
  obstacleDistance: 35,
  consecutiveConflictCycles: 0,
};

test("Caso 1: el escenario original activa frenado controlado", () => {
  assert.equal(evaluateDecision(ORIGINAL_SCENARIO).action, "CONTROLLED_BRAKE");
});

test("Caso 2: vía libre permite continuar con precaución", () => {
  assert.equal(evaluateDecision(allClear).action, "CONTINUE_CAUTION");
});

test("Caso 3: obstáculo posible a 7 metros activa emergencia", () => {
  const input = { ...ORIGINAL_SCENARIO, obstacleDistance: 7 };
  assert.equal(evaluateDecision(input).action, "EMERGENCY_BRAKE");
});

test("Caso 4: primer conflicto sin evidencia positiva reduce velocidad", () => {
  const input: DecisionInput = {
    ...allClear,
    sensors: [
      { sensor: "lidar", report: "pedestrian", confidence: "low" },
      { sensor: "camera", report: "none", confidence: "high" },
      { sensor: "radar", report: "none", confidence: "low" },
    ],
    fusionConfidence: "medium",
    consecutiveConflictCycles: 1,
  };
  assert.equal(evaluateDecision(input).action, "REDUCE_SPEED");
});

test("Caso 5: dos ciclos de conflicto producen detención segura", () => {
  const input: DecisionInput = {
    ...ORIGINAL_SCENARIO,
    consecutiveConflictCycles: 2,
  };
  assert.equal(evaluateDecision(input).action, "SAFE_STOP");
});

test("Caso 6: peatón y bicicleta implican obstáculo y clasificación conflictiva", () => {
  const result = evaluateDecision(ORIGINAL_SCENARIO);
  assert.equal(result.obstaclePossible, true);
  assert.equal(result.classificationConflict, true);
});
