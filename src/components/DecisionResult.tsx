"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  ACTION_LABELS,
  CONFIDENCE_LABELS,
} from "../constants/decision.constants";
import type {
  DecisionResult as DecisionResultType,
  FusionConfidence,
} from "../types/decision.types";
import styles from "./DecisionResult.module.css";

interface DecisionResultProps {
  result: DecisionResultType;
  fusionConfidence: FusionConfidence;
}

const yesNo = (value: boolean): string => (value ? "Sí" : "No");

export default function DecisionResult({
  result,
  fusionConfidence,
}: DecisionResultProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.section
        className={styles.resultSection}
        key={`${result.action}-${result.obstacleScore}-${result.activatedRules[0]}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28 }}
        aria-labelledby="result-title"
      >
        <div className={styles.titleRow}>
          <div>
            <span>RESULTADO DE LA EVALUACIÓN</span>
            <h2 id="result-title">{ACTION_LABELS[result.action]}</h2>
          </div>
          <span className={`${styles.actionCode} ${styles[result.action]}`}>
            {result.action}
          </span>
        </div>

        <div className={styles.metrics}>
          <article>
            <span>Puntaje de evidencia</span>
            <strong className={result.obstacleScore > 0 ? styles.positive : ""}>
              {result.obstacleScore > 0 ? "+" : ""}
              {result.obstacleScore}
            </strong>
            <small>
              {result.obstacleScore > 0
                ? "Evidencia favorable"
                : result.obstacleScore < 0
                  ? "Evidencia de vía libre"
                  : "No concluyente"}
            </small>
          </article>
          <article>
            <span>Obstáculo posible</span>
            <strong>{yesNo(result.obstaclePossible)}</strong>
            <small>Según evidencia</small>
          </article>
          <article>
            <span>Conflicto de existencia</span>
            <strong>{yesNo(result.existenceConflict)}</strong>
            <small>Hay / no hay objeto</small>
          </article>
          <article>
            <span>Conflicto de clasificación</span>
            <strong>{yesNo(result.classificationConflict)}</strong>
            <small>Tipo de objeto</small>
          </article>
          <article>
            <span>Confianza global</span>
            <strong>{CONFIDENCE_LABELS[fusionConfidence]}</strong>
            <small>Señal de incertidumbre</small>
          </article>
        </div>

        <div className={styles.ruleCallout}>
          <span>REGLA PRINCIPAL ACTIVADA</span>
          <strong>{result.activatedRules[0]}</strong>
        </div>

        <div className={styles.detailGrid}>
          <article className={styles.explanation}>
            <span className={styles.sectionLabel}>EXPLICACIÓN PASO A PASO</span>
            <ol>
              {result.explanationSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </article>
          <article className={styles.justification}>
            <div className={styles.shield} aria-hidden="true">
              ✓
            </div>
            <span className={styles.sectionLabel}>POR QUÉ ES SEGURA</span>
            <h3>Principio preventivo</h3>
            <p>{result.safetyJustification}</p>
            <blockquote>
              Un falso positivo puede causar una demora. Un falso negativo puede
              causar una colisión.
            </blockquote>
          </article>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
