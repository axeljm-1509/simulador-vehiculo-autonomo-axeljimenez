import { motion } from "motion/react";
import type { DecisionAction } from "../../types/decision.types";

interface AutonomousCarProps {
  action: DecisionAction;
}

export default function AutonomousCar({ action }: AutonomousCarProps) {
  const braking = ["CONTROLLED_BRAKE", "SAFE_STOP", "EMERGENCY_BRAKE"].includes(
    action,
  );

  return (
    <g aria-label="Automóvil visto desde arriba">
      <path
        d="M152 379 C153 365 160 354 171 350 H209 C220 354 227 365 228 379 L232 426 C232 437 224 444 214 444 H166 C156 444 148 437 148 426 Z"
        fill="#2f6fec"
        stroke="#0d2f6d"
        strokeWidth="2"
      />
      <path
        d="M166 367 C173 358 180 356 190 356 C200 356 207 358 214 367 L217 383 H163 Z"
        fill="#bfe0ff"
        opacity="0.92"
      />
      <rect x="158" y="389" width="64" height="28" rx="10" fill="#245dcc" />
      <rect x="160" y="405" width="14" height="6" rx="3" fill="#eaf3ff" />
      <rect x="206" y="405" width="14" height="6" rx="3" fill="#eaf3ff" />
      <motion.rect
        x="157"
        y="428"
        width="17"
        height="7"
        rx="3"
        fill="#ff4438"
        animate={{ opacity: braking ? [0.55, 1, 0.55] : 0.18 }}
        transition={{ duration: 0.7, repeat: braking ? Infinity : 0 }}
      />
      <motion.rect
        x="206"
        y="428"
        width="17"
        height="7"
        rx="3"
        fill="#ff4438"
        animate={{ opacity: braking ? [0.55, 1, 0.55] : 0.18 }}
        transition={{ duration: 0.7, repeat: braking ? Infinity : 0 }}
      />
      <circle cx="146" cy="390" r="4" fill="#18243a" />
      <circle cx="234" cy="390" r="4" fill="#18243a" />
      <circle cx="146" cy="426" r="4" fill="#18243a" />
      <circle cx="234" cy="426" r="4" fill="#18243a" />
    </g>
  );
}
