"use client";

import { useEffect, useMemo, useState } from "react";
import DecisionResult from "./components/DecisionResult";
import ObstacleSelector from "./components/ObstacleSelector";
import RoadSimulation from "./components/Simulation/RoadSimulation";
import { evaluateDecision } from "./engine/decisionEngine";
import { useSimulation } from "./hooks/useSimulation";
import type {
  DecisionInput,
  DecisionResult as DecisionResultType,
  SensorReport,
} from "./types/decision.types";
import styles from "./App.module.css";

const AUTOMATIC_SPEED = 50;
const AUTOMATIC_DISTANCE = 42;

function createAutomaticScenario(obstacle: SensorReport): DecisionInput {
  if (obstacle === "none") {
    return {
      sensors: [
        { sensor: "lidar", report: "none", confidence: "high" },
        { sensor: "camera", report: "none", confidence: "medium" },
        { sensor: "radar", report: "none", confidence: "high" },
      ],
      fusionConfidence: "high",
      currentSpeed: AUTOMATIC_SPEED,
      obstacleDistance: AUTOMATIC_DISTANCE,
      consecutiveConflictCycles: 0,
    };
  }

  if (obstacle === "vehicle") {
    return {
      sensors: [
        { sensor: "lidar", report: "vehicle", confidence: "high" },
        { sensor: "camera", report: "vehicle", confidence: "high" },
        { sensor: "radar", report: "vehicle", confidence: "high" },
      ],
      fusionConfidence: "high",
      currentSpeed: AUTOMATIC_SPEED,
      obstacleDistance: AUTOMATIC_DISTANCE,
      consecutiveConflictCycles: 1,
    };
  }

  if (obstacle === "bicycle") {
    return {
      sensors: [
        { sensor: "lidar", report: "unknown", confidence: "medium" },
        { sensor: "camera", report: "bicycle", confidence: "high" },
        { sensor: "radar", report: "bicycle", confidence: "high" },
      ],
      fusionConfidence: "medium",
      currentSpeed: AUTOMATIC_SPEED,
      obstacleDistance: AUTOMATIC_DISTANCE,
      consecutiveConflictCycles: 1,
    };
  }

  if (obstacle === "unknown") {
    return {
      sensors: [
        { sensor: "lidar", report: "unknown", confidence: "high" },
        { sensor: "camera", report: "none", confidence: "medium" },
        { sensor: "radar", report: "unknown", confidence: "high" },
      ],
      fusionConfidence: "low",
      currentSpeed: AUTOMATIC_SPEED,
      obstacleDistance: AUTOMATIC_DISTANCE,
      consecutiveConflictCycles: 1,
    };
  }

  return {
    sensors: [
      { sensor: "lidar", report: "pedestrian", confidence: "high" },
      { sensor: "camera", report: "pedestrian", confidence: "medium" },
      { sensor: "radar", report: "unknown", confidence: "high" },
    ],
    fusionConfidence: "medium",
    currentSpeed: AUTOMATIC_SPEED,
    obstacleDistance: AUTOMATIC_DISTANCE,
    consecutiveConflictCycles: 1,
  };
}

export default function App() {
  const [selectedObstacle, setSelectedObstacle] =
    useState<SensorReport>("pedestrian");
  const scenario = useMemo(
    () => createAutomaticScenario(selectedObstacle),
    [selectedObstacle],
  );
  const [result, setResult] = useState<DecisionResultType>(() =>
    evaluateDecision(createAutomaticScenario("pedestrian")),
  );

  const simulation = useSimulation(
    scenario.currentSpeed,
    scenario.obstacleDistance,
    result.action,
  );

  useEffect(() => {
    const nextResult = evaluateDecision(scenario);
    setResult(nextResult);
    simulation.applyDecision(nextResult.action);
    simulation.reset();
    const frame = window.requestAnimationFrame(simulation.start);
    return () => window.cancelAnimationFrame(frame);
  }, [scenario]);

  useEffect(() => {
    const automaticResult = evaluateDecision({
      ...scenario,
      obstacleDistance: simulation.currentDistance,
    });
    if (automaticResult.action !== result.action) {
      setResult(automaticResult);
      simulation.applyDecision(automaticResult.action);
    }
  }, [scenario, simulation.currentDistance, result.action]);

  const restartSimulation = () => {
    const nextResult = evaluateDecision(scenario);
    setResult(nextResult);
    simulation.applyDecision(nextResult.action);
    simulation.reset();
    window.requestAnimationFrame(simulation.start);
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <span className={styles.brandMark} aria-hidden="true">
              ◉
            </span>
            <div>
              <strong>AUTODRIVE // RADAR OPS</strong>
              <span>Simulador autónomo de respuesta vial</span>
            </div>
          </div>
          <span className={styles.prototype}>SISTEMA EN LÍNEA</span>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.intro}>
          <div className={styles.introText}>
            <span>MISIÓN 01 · DETECCIÓN PREVENTIVA</span>
            <h1>Controla el escenario. El vehículo toma la decisión.</h1>
            <p>
              Selecciona un obstáculo y observa cómo el radar detecta el riesgo,
              calcula la distancia y ejecuta la maniobra automáticamente.
            </p>
          </div>
          <div className={styles.logicFlow} aria-label="Flujo automático">
            <div>
              <span>OBJETIVO</span>
              <strong>Conservar 12 m</strong>
            </div>
            <div>
              <span>MODO</span>
              <strong>Autónomo</strong>
            </div>
          </div>
        </section>

        <div className={styles.workspace}>
          <RoadSimulation
            action={result.action}
            speed={simulation.currentSpeed}
            distance={simulation.currentDistance}
            status={simulation.status}
            obstacleReport={selectedObstacle}
          />

          <ObstacleSelector
            selectedObstacle={selectedObstacle}
            sensors={scenario.sensors}
            fusionConfidence={scenario.fusionConfidence}
            onSelect={setSelectedObstacle}
            onRestart={restartSimulation}
          />
        </div>

        <DecisionResult
          result={result}
          fusionConfidence={scenario.fusionConfidence}
        />
      </main>
    </div>
  );
}
