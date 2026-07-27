"use client";

import { motion } from "motion/react";
import { ACTION_LABELS } from "../../constants/decision.constants";
import type {
  DecisionAction,
  SensorReport,
  SimulationStatus,
} from "../../types/decision.types";
import AutonomousCar from "./AutonomousCar";
import Obstacle from "./Obstacle";
import styles from "./Simulation.module.css";

interface RoadSimulationProps {
  action: DecisionAction;
  speed: number;
  distance: number;
  status: SimulationStatus;
  obstacleReport: SensorReport;
}

const STATUS_LABELS: Record<SimulationStatus, string> = {
  idle: "Lista",
  running: "En marcha",
  paused: "Pausada",
  braking: "Frenando",
  stopped: "Detenida",
  emergency: "Emergencia",
};

export default function RoadSimulation({
  action,
  speed,
  distance,
  status,
  obstacleReport,
}: RoadSimulationProps) {
  const moving = ["running", "braking", "emergency"].includes(status) && speed > 0;
  const fullyStopped =
    status === "stopped" && speed === 0 && obstacleReport !== "none";
  const safeDistanceReached =
    obstacleReport !== "none" &&
    distance <= 12 &&
    action !== "EMERGENCY_BRAKE";
  const obstacleY = Math.min(300, Math.max(70, 300 - distance * 5.6));
  const displayedStatus = fullyStopped
    ? "Detenido por sensor"
    : safeDistanceReached
      ? "Frenado final"
      : STATUS_LABELS[status];
  const alertClass =
    fullyStopped
      ? styles.stoppedAlert
      : action === "EMERGENCY_BRAKE"
      ? styles.redAlert
      : action === "REDUCE_SPEED" || action === "SAFE_STOP"
        ? styles.yellowAlert
        : styles.blueAlert;

  return (
    <section className={styles.simulationCard} aria-labelledby="simulation-title">
      <div className={styles.simulationHeader}>
        <div>
          <span className={styles.eyebrow}>SIMULACIÓN EN TIEMPO REAL</span>
          <h2 id="simulation-title">Vista del vehículo</h2>
        </div>
        <span className={`${styles.liveStatus} ${moving ? styles.active : ""}`}>
          <i aria-hidden="true" />
          {displayedStatus}
        </span>
      </div>

      <div className={`${styles.roadFrame} ${alertClass}`}>
        <svg
          viewBox="0 0 380 520"
          role="img"
          aria-label="Carretera vertical con automóvil y posible obstáculo"
        >
          <defs>
            <linearGradient id="roadShade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#29374a" />
              <stop offset="100%" stopColor="#151f2e" />
            </linearGradient>
            <linearGradient id="sensorField" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#48c7ff" stopOpacity="0.26" />
              <stop offset="100%" stopColor="#48c7ff" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <rect width="380" height="520" fill="url(#roadShade)" />
          <rect x="18" width="8" height="520" fill="#f6f8fb" opacity="0.86" />
          <rect x="354" width="8" height="520" fill="#f6f8fb" opacity="0.86" />
          <rect x="30" width="4" height="520" fill="#f4c85e" opacity="0.65" />
          <rect x="346" width="4" height="520" fill="#f4c85e" opacity="0.65" />

          {[0, 1, 2, 3, 4, 5].map((line) => (
            <motion.rect
              key={line}
              x="186"
              y={line * 104 - 50}
              width="8"
              height="58"
              rx="4"
              fill="#f4f7fb"
              opacity="0.74"
              animate={moving ? { y: [0, 104] } : { y: 0 }}
              transition={{
                duration: Math.max(0.48, 2.05 - speed / 31),
                ease: "linear",
                repeat: moving ? Infinity : 0,
              }}
            />
          ))}

          <path d="M165 353 L111 116 H269 L215 353 Z" fill="url(#sensorField)" />
          <path
            d="M165 353 L111 116 M215 353 L269 116"
            fill="none"
            stroke="#55cfff"
            strokeDasharray="6 8"
            opacity="0.45"
          />
          {obstacleReport !== "none" && (
            <g aria-label={`Radar: ${distance.toFixed(1)} metros`}>
              <motion.circle
                cx="190"
                cy="365"
                r="24"
                fill="none"
                stroke="#5aeadf"
                strokeWidth="2"
                animate={
                  fullyStopped
                    ? { r: 24, opacity: 0.72 }
                    : { r: [22, 44], opacity: [0.75, 0] }
                }
                transition={
                  fullyStopped
                    ? { duration: 0.2 }
                    : { duration: 1.35, repeat: Infinity }
                }
              />
              <motion.circle
                cx="190"
                cy="365"
                r="20"
                fill="none"
                stroke="#5aeadf"
                strokeWidth="1.5"
                animate={
                  fullyStopped
                    ? { r: 34, opacity: 0.38 }
                    : { r: [20, 35], opacity: [0.65, 0] }
                }
                transition={
                  fullyStopped
                    ? { duration: 0.2 }
                    : { duration: 1.35, delay: 0.35, repeat: Infinity }
                }
              />
              <line
                x1="258"
                y1={obstacleY + 105}
                x2="258"
                y2="350"
                stroke="#5aeadf"
                strokeWidth="2"
                strokeDasharray="5 6"
                opacity="0.8"
              />
              <circle
                cx="258"
                cy={obstacleY + 105}
                r="4"
                fill="#5aeadf"
              />
              <circle cx="258" cy="350" r="4" fill="#5aeadf" />
              <rect
                x="269"
                y={(obstacleY + 455) / 2 - 15}
                width="91"
                height="30"
                rx="9"
                fill="#0c3e4c"
                stroke="#5aeadf"
                strokeOpacity="0.5"
              />
              <text
                x="314.5"
                y={(obstacleY + 455) / 2 - 3}
                fill="#8ff8ef"
                fontSize="8"
                fontWeight="800"
                textAnchor="middle"
                letterSpacing="0.8"
              >
                RADAR
              </text>
              <text
                x="314.5"
                y={(obstacleY + 455) / 2 + 9}
                fill="#ffffff"
                fontSize="11"
                fontWeight="800"
                textAnchor="middle"
              >
                {distance.toFixed(1)} m
              </text>
            </g>
          )}
          {obstacleReport !== "none" && (
            <Obstacle
              key={obstacleReport}
              report={obstacleReport}
              distance={distance}
            />
          )}
          <AutonomousCar action={action} />
        </svg>

        <motion.div
          className={styles.actionBanner}
          key={action}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span>ACCIÓN ACTUAL</span>
          <strong>
            {fullyStopped ? "FRENADO TOTAL COMPLETADO" : ACTION_LABELS[action]}
          </strong>
        </motion.div>

        {fullyStopped && (
          <motion.div
            className={styles.fullStopOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            role="status"
            aria-live="polite"
          >
            <motion.div
              className={styles.fullStopPanel}
              initial={{ scale: 0.94, y: 8 }}
              animate={{ scale: 1, y: 0 }}
            >
              <span className={styles.fullStopIcon} aria-hidden="true">
                ■
              </span>
              <div>
                <small>SENSOR CONFIRMA OBSTÁCULO</small>
                <strong>Vehículo detenido por completo</strong>
                <em>Autopista detenida · 0 km/h</em>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      <div className={styles.telemetry}>
        <div>
          <span>VELOCIDAD ACTUAL</span>
          <strong>{speed.toFixed(1)}</strong>
          <small>km/h</small>
        </div>
        <div>
          <span>DISTANCIA ESTIMADA</span>
          <strong>{distance.toFixed(1)}</strong>
          <small>metros</small>
        </div>
        <div>
          <span>ESTADO</span>
          <strong className={styles.statusWord}>{displayedStatus}</strong>
          <small>simulación</small>
        </div>
      </div>

      {safeDistanceReached && (
        <motion.div
          className={styles.radarSafeMessage}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          role="status"
        >
          <span aria-hidden="true">◉</span>
          <div>
            <strong>
              {fullyStopped
                ? "Frenado total completado"
                : "Radar: distancia segura alcanzada"}
            </strong>
            <small>
              {fullyStopped
                ? "El sensor detectó el obstáculo; el vehículo y la autopista están detenidos."
                : "El vehículo completa el frenado al llegar a 12 metros."}
            </small>
          </div>
        </motion.div>
      )}

      {status === "stopped" && action === "SAFE_STOP" && (
        <motion.div
          className={styles.safeMessage}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          role="status"
        >
          <strong>Vehículo detenido de forma segura</strong>
          <span>Solicitar intervención humana</span>
        </motion.div>
      )}
    </section>
  );
}
