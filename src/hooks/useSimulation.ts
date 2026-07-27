"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  DecisionAction,
  SimulationStatus,
} from "../types/decision.types";

const RADAR_SAFE_DISTANCE = 12;

const statusForAction = (action: DecisionAction): SimulationStatus => {
  if (action === "EMERGENCY_BRAKE") return "emergency";
  if (action === "CONTROLLED_BRAKE" || action === "SAFE_STOP") return "braking";
  return "running";
};

export function useSimulation(
  initialSpeed: number,
  initialDistance: number,
  action: DecisionAction,
) {
  const [currentSpeed, setCurrentSpeed] = useState(initialSpeed);
  const [currentDistance, setCurrentDistance] = useState(initialDistance);
  const [status, setStatus] = useState<SimulationStatus>("idle");
  const valuesRef = useRef({ initialSpeed, initialDistance, action });

  useEffect(() => {
    valuesRef.current = { initialSpeed, initialDistance, action };
  }, [initialSpeed, initialDistance, action]);

  useEffect(() => {
    if (!["running", "braking", "emergency"].includes(status)) return;

    const timer = window.setInterval(() => {
      const values = valuesRef.current;
      const radarStopRequired =
        values.action === "CONTROLLED_BRAKE" &&
        currentDistance <= RADAR_SAFE_DISTANCE;
      const targetSpeed =
        values.action === "CONTINUE_CAUTION"
          ? values.initialSpeed
          : values.action === "REDUCE_SPEED"
            ? values.initialSpeed * 0.6
            : values.action === "CONTROLLED_BRAKE"
              ? radarStopRequired
                ? 0
                : values.initialSpeed * 0.25
              : 0;
      const speedStep =
        values.action === "EMERGENCY_BRAKE"
          ? 3.6
          : values.action === "SAFE_STOP"
            ? 0.9
            : radarStopRequired
              ? 1.1
              : 0.55;

      setCurrentSpeed((speed) => {
        const next =
          speed > targetSpeed
            ? Math.max(targetSpeed, speed - speedStep)
            : Math.min(targetSpeed, speed + 0.5);
        if (
          next === 0 &&
          (values.action === "SAFE_STOP" ||
            values.action === "EMERGENCY_BRAKE" ||
            radarStopRequired)
        ) {
          setStatus("stopped");
        }
        return Number(next.toFixed(1));
      });

      setCurrentDistance((distance) => {
        if (values.action === "CONTINUE_CAUTION") {
          return distance;
        }
        if (values.action === "EMERGENCY_BRAKE") {
          return Number(Math.max(2.5, distance - 0.7).toFixed(1));
        }
        if (values.action === "SAFE_STOP") {
          return Number(Math.max(5, distance - 0.35).toFixed(1));
        }
        if (
          values.action === "CONTROLLED_BRAKE" ||
          values.action === "REDUCE_SPEED"
        ) {
          return Number(
            Math.max(
              RADAR_SAFE_DISTANCE,
              distance - currentSpeed / 115,
            ).toFixed(1),
          );
        }
        return Number(Math.max(2.5, distance - currentSpeed / 115).toFixed(1));
      });
    }, 100);

    return () => window.clearInterval(timer);
  }, [currentDistance, currentSpeed, status]);

  const start = useCallback(() => {
    setStatus(statusForAction(valuesRef.current.action));
  }, []);

  const pause = useCallback(() => setStatus("paused"), []);

  const resume = useCallback(() => {
    setStatus(statusForAction(valuesRef.current.action));
  }, []);

  const reset = useCallback(() => {
    setCurrentSpeed(valuesRef.current.initialSpeed);
    setCurrentDistance(valuesRef.current.initialDistance);
    setStatus("idle");
  }, []);

  const applyDecision = useCallback((nextAction: DecisionAction) => {
    valuesRef.current.action = nextAction;
    setStatus((currentStatus) =>
      currentStatus === "idle" || currentStatus === "paused"
        ? currentStatus
        : statusForAction(nextAction),
    );
  }, []);

  return {
    currentSpeed,
    currentDistance,
    status,
    start,
    pause,
    resume,
    reset,
    applyDecision,
  };
}
