/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { units } from '../data/courseStructure'

const STORAGE_KEY = 'finanzas-cotidianas:progress:v1'
const STAGE_IDS = ['video', 'tutorial', 'evaluation']

const CourseProgressContext = createContext(null)
const nowIso = () => new Date().toISOString()

const createId = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const createUnitProgress = () => ({
  status: 'not_started',
  firstAccessedAt: null,
  lastAccessedAt: null,
  completedAt: null,
  accessCount: 0,
  stages: {},
  evaluation: {
    attempts: 0,
    bestScore: null,
    total: null,
    passed: false,
    lastAttemptAt: null,
  },
})

const createInitialState = () => ({
  version: 1,
  user: {
    id: createId(),
    name: 'Usuario',
    email: '',
    documentId: '',
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  units: Object.fromEntries(units.map((unit) => [unit.id, createUnitProgress()])),
  events: [],
})

const normalizeState = (stored) => {
  const initial = createInitialState()
  if (!stored || typeof stored !== 'object') return initial

  return {
    ...initial,
    ...stored,
    user: { ...initial.user, ...(stored.user || {}) },
    units: Object.fromEntries(
      units.map((unit) => {
        const saved = stored.units?.[unit.id] || {}
        return [
          unit.id,
          {
            ...createUnitProgress(),
            ...saved,
            stages: { ...(saved.stages || {}) },
            evaluation: {
              ...createUnitProgress().evaluation,
              ...(saved.evaluation || {}),
            },
          },
        ]
      }),
    ),
    events: Array.isArray(stored.events) ? stored.events.slice(-500) : [],
  }
}

const loadState = () => {
  try {
    return normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY)))
  } catch {
    return createInitialState()
  }
}

const persistState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('No se pudo guardar el progreso del curso.', error)
  }
}

const addEvent = (events, event) => [
  ...events,
  { id: createId(), occurredAt: nowIso(), ...event },
].slice(-500)

export function CourseProgressProvider({ children }) {
  const [state, setState] = useState(loadState)

  useEffect(() => persistState(state), [state])

  const commit = useCallback((updater) => setState(updater), [])

  const isUnitUnlocked = useCallback(
    (unitId) => {
      const index = units.findIndex((unit) => unit.id === unitId)
      if (index <= 0) return index === 0
      return state.units[units[index - 1].id]?.status === 'completed'
    },
    [state.units],
  )

  const recordUnitAccess = useCallback(
    (unitId) => {
      commit((previous) => {
        const current = previous.units[unitId]
        if (!current) return previous

        const timestamp = nowIso()
        return {
          ...previous,
          units: {
            ...previous.units,
            [unitId]: {
              ...current,
              status: current.status === 'completed' ? 'completed' : 'in_progress',
              firstAccessedAt: current.firstAccessedAt || timestamp,
              lastAccessedAt: timestamp,
              accessCount: current.accessCount + 1,
            },
          },
          events: addEvent(previous.events, { type: 'unit_accessed', unitId }),
        }
      })
    },
    [commit],
  )

  const completeStage = useCallback(
    (unitId, stageId, result = {}) => {
      commit((previous) => {
        const current = previous.units[unitId]
        if (!current || !STAGE_IDS.includes(stageId)) return previous

        const timestamp = nowIso()
        const isEvaluation = stageId === 'evaluation'
        const passed = !isEvaluation || result.passed !== false
        const numericScore = Number.isFinite(result.score) ? result.score : null
        const numericTotal = Number.isFinite(result.total) ? result.total : null
        const evaluation = isEvaluation
          ? {
              ...current.evaluation,
              attempts: current.evaluation.attempts + 1,
              bestScore:
                numericScore === null
                  ? current.evaluation.bestScore
                  : Math.max(current.evaluation.bestScore ?? numericScore, numericScore),
              total: numericTotal ?? current.evaluation.total,
              passed: current.evaluation.passed || passed,
              lastAttemptAt: timestamp,
            }
          : current.evaluation

        const stages = passed
          ? {
              ...current.stages,
              [stageId]: current.stages[stageId] || { completedAt: timestamp },
            }
          : current.stages
        const unitCompleted = STAGE_IDS.every((requiredStage) => stages[requiredStage])
        const status = current.status === 'completed' || unitCompleted
          ? 'completed'
          : 'in_progress'

        return {
          ...previous,
          units: {
            ...previous.units,
            [unitId]: {
              ...current,
              status,
              stages,
              evaluation,
              completedAt: unitCompleted ? current.completedAt || timestamp : current.completedAt,
            },
          },
          events: addEvent(previous.events, {
            type: isEvaluation ? 'evaluation_finished' : 'stage_completed',
            unitId,
            stageId,
            passed,
            score: numericScore,
            total: numericTotal,
          }),
        }
      })
    },
    [commit],
  )

  const updateProfile = useCallback(
    (profile) => {
      commit((previous) => ({
        ...previous,
        user: {
          ...previous.user,
          name: profile.name.trim() || 'Usuario',
          email: profile.email.trim(),
          documentId: profile.documentId.trim(),
          updatedAt: nowIso(),
        },
        events: addEvent(previous.events, { type: 'profile_updated' }),
      }))
    },
    [commit],
  )

  const value = useMemo(
    () => ({
      state,
      isUnitUnlocked,
      recordUnitAccess,
      completeStage,
      updateProfile,
      getUnitProgress: (unitId) => state.units[unitId] || createUnitProgress(),
    }),
    [state, isUnitUnlocked, recordUnitAccess, completeStage, updateProfile],
  )

  return (
    <CourseProgressContext.Provider value={value}>
      {children}
    </CourseProgressContext.Provider>
  )
}

export function useCourseProgress() {
  const context = useContext(CourseProgressContext)
  if (!context) {
    throw new Error('useCourseProgress debe usarse dentro de CourseProgressProvider')
  }
  return context
}

export { STAGE_IDS }
