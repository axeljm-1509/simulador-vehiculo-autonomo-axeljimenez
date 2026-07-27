import type { SimulationStatus } from "../types/decision.types";
import styles from "./SimulationControls.module.css";

interface SimulationControlsProps {
  status: SimulationStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onEvaluate: () => void;
  onReset: () => void;
  onRestore: () => void;
}

export default function SimulationControls({
  status,
  onStart,
  onPause,
  onResume,
  onEvaluate,
  onReset,
  onRestore,
}: SimulationControlsProps) {
  const canPause = ["running", "braking", "emergency"].includes(status);

  return (
    <div className={styles.controls} aria-label="Controles de simulación">
      <button className={styles.primary} onClick={onStart} disabled={canPause}>
        <span aria-hidden="true">▶</span> Iniciar
      </button>
      <button onClick={onPause} disabled={!canPause}>
        <span aria-hidden="true">Ⅱ</span> Pausar
      </button>
      <button onClick={onResume} disabled={status !== "paused"}>
        <span aria-hidden="true">▶</span> Continuar
      </button>
      <button className={styles.evaluate} onClick={onEvaluate}>
        <span aria-hidden="true">◎</span> Evaluar sensores
      </button>
      <button onClick={onReset}>
        <span aria-hidden="true">↺</span> Reiniciar
      </button>
      <button onClick={onRestore}>
        <span aria-hidden="true">↶</span> Restaurar escenario original
      </button>
    </div>
  );
}
