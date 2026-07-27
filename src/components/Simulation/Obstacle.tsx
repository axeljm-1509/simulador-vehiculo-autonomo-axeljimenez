import { motion } from "motion/react";
import type { SensorReport } from "../../types/decision.types";

interface ObstacleProps {
  report: SensorReport;
  distance: number;
}

const labelFor = (report: SensorReport): string => {
  if (report === "pedestrian") return "PEATÓN";
  if (report === "bicycle") return "BICICLETA";
  if (report === "vehicle") return "VEHÍCULO";
  return "OBJETO DESCONOCIDO";
};

function PedestrianIcon() {
  return (
    <g aria-label="Peatón">
      <circle cx="190" cy="35" r="23" fill="#ffcf5c" opacity="0.18" />
      <circle cx="190" cy="35" r="10" fill="#ffcf5c" stroke="#8b6816" />
      <path
        d="M190 45 V69 M176 56 H204 M190 69 L178 89 M190 69 L202 89"
        stroke="#ffd979"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </g>
  );
}

function BicycleIcon() {
  return (
    <g aria-label="Bicicleta">
      <circle
        cx="169"
        cy="67"
        r="17"
        fill="rgba(55, 123, 231, 0.14)"
        stroke="#8fc8ff"
        strokeWidth="4"
      />
      <circle
        cx="213"
        cy="67"
        r="17"
        fill="rgba(55, 123, 231, 0.14)"
        stroke="#8fc8ff"
        strokeWidth="4"
      />
      <path
        d="M169 67 L183 44 L197 67 Z M183 44 L207 45 L213 67 M176 38 H190 M204 39 L212 36"
        fill="none"
        stroke="#bce2ff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="195" cy="28" r="8" fill="#ffcf5c" />
      <path
        d="M191 37 L183 48 M192 38 L205 45 M184 48 L176 59"
        fill="none"
        stroke="#ffd979"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </g>
  );
}

function VehicleIcon() {
  return (
    <g aria-label="Vehículo">
      <rect
        x="153"
        y="20"
        width="74"
        height="76"
        rx="20"
        fill="#e64e4e"
        stroke="#8c2020"
        strokeWidth="3"
      />
      <path
        d="M164 40 C168 30 176 27 190 27 C204 27 212 30 216 40 L219 55 H161 Z"
        fill="#c9e7ff"
        opacity="0.92"
      />
      <rect x="160" y="61" width="60" height="19" rx="8" fill="#be3636" />
      <rect x="158" y="84" width="16" height="6" rx="3" fill="#ffdf83" />
      <rect x="206" y="84" width="16" height="6" rx="3" fill="#ffdf83" />
      <rect x="149" y="40" width="7" height="18" rx="3" fill="#17243b" />
      <rect x="224" y="40" width="7" height="18" rx="3" fill="#17243b" />
      <rect x="149" y="67" width="7" height="18" rx="3" fill="#17243b" />
      <rect x="224" y="67" width="7" height="18" rx="3" fill="#17243b" />
    </g>
  );
}

function UnknownIcon() {
  return (
    <g aria-label="Objeto desconocido">
      <motion.path
        d="M190 14 L231 86 H149 Z"
        fill="#f3a73a"
        stroke="#8b5610"
        strokeWidth="3"
        animate={{ opacity: [0.82, 1, 0.82] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
      <text
        x="190"
        y="66"
        fill="#38240a"
        fontSize="43"
        fontWeight="900"
        textAnchor="middle"
      >
        ?
      </text>
    </g>
  );
}

function ObstacleArtwork({ report }: { report: SensorReport }) {
  if (report === "bicycle") return <BicycleIcon />;
  if (report === "vehicle") return <VehicleIcon />;
  if (report === "unknown") return <UnknownIcon />;
  return <PedestrianIcon />;
}

export default function Obstacle({ report, distance }: ObstacleProps) {
  const y = Math.min(300, Math.max(70, 300 - distance * 5.6));
  const labelWidth = report === "unknown" ? 126 : 94;

  return (
    <motion.g
      key={report}
      initial={{ opacity: 0, scale: 0.72 }}
      animate={{ y, opacity: 1, scale: 1 }}
      transition={{
        y: { type: "spring", stiffness: 95, damping: 20 },
        opacity: { duration: 0.2 },
        scale: { type: "spring", stiffness: 260, damping: 18 },
      }}
      aria-label={labelFor(report)}
      style={{ transformOrigin: "190px 62px" }}
    >
      <ObstacleArtwork report={report} />
      <rect
        x={190 - labelWidth / 2}
        y="101"
        width={labelWidth}
        height="23"
        rx="11"
        fill="#17243b"
      />
      <text
        x="190"
        y="117"
        fill="#ffffff"
        fontSize={report === "unknown" ? "8.5" : "10"}
        fontWeight="700"
        textAnchor="middle"
        letterSpacing="0.7"
      >
        {labelFor(report)}
      </text>
    </motion.g>
  );
}
