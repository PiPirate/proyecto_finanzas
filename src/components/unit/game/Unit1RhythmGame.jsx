import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './Unit1RhythmGame.css'

const LANES = [
  { id: 0, name: 'Ingresos', key: 'd', type: 'ingreso', color: '#4caf50' },
  { id: 1, name: 'Gastos esenciales', key: 'f', type: 'esencial', color: '#ff9800' },
  { id: 2, name: 'Gastos flexibles', key: 'j', type: 'flexible', color: '#ff5722' },
  { id: 3, name: 'Ahorro para la meta', key: 'k', type: 'ahorro', color: '#673ab7' }
]

const NOTE_DURATION = 3200
const GAME_DURATION = 60
const SPAWN_INTERVAL = 950

const createInitialStats = () => ({
  saldo: 260,
  meta: 0,
  confidence: 72,
  comboReady: false,
  comboStreak: 0,
  essentialStrike: 0,
  savingsGap: 0
})

const typeEffects = {
  ingreso: { saldo: 120, meta: 0, confidence: 6, message: 'Ingreso registrado. Prepara fichas de ahorro.' },
  esencial: { saldo: -90, meta: 0, confidence: -6, message: 'Pago esencial cubierto. Mantén el flujo estable.' },
  flexible: { saldo: -45, meta: 0, confidence: -3, message: 'Gasto flexible controlado. Úsalo con moderación.' },
  ahorro: { saldo: -70, meta: 18, confidence: 5, message: 'Ahorro aplicado. La meta avanza más rápido.' }
}

const getRandomLane = (comboReady) => {
  const weights = comboReady ? [4, 4, 2, 4] : [4, 4, 3, 3]
  const total = weights.reduce((acc, weight) => acc + weight, 0)
  const random = Math.random() * total
  let cumulative = 0

  for (let index = 0; index < LANES.length; index += 1) {
    cumulative += weights[index]
    if (random <= cumulative) {
      return LANES[index]
    }
  }

  return LANES[0]
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const Unit1RhythmGame = () => {
  const [notes, setNotes] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [feedback, setFeedback] = useState('Pulsa D, F, J y K cuando las fichas lleguen a la zona de impacto.')
  const [stats, setStats] = useState(() => createInitialStats())

  const noteIdRef = useRef(0)
  const nowRef = useRef(0)
  const statsRef = useRef(stats)

  useEffect(() => {
    statsRef.current = stats
  }, [stats])

  const resetGame = useCallback(() => {
    setNotes([])
    setIsPlaying(false)
    setTimeLeft(GAME_DURATION)
    setFeedback('Pulsa D, F, J y K cuando las fichas lleguen a la zona de impacto.')
    setStats(createInitialStats())
  }, [])

  const spawnNote = useCallback(() => {
    setNotes((prev) => {
      const lane = getRandomLane(statsRef.current.comboReady)
      const id = noteIdRef.current + 1
      noteIdRef.current = id

      return [
        ...prev,
        {
          id,
          lane: lane.id,
          type: lane.type,
          spawnedAt: performance.now(),
          hit: false
        }
      ]
    })
  }, [])

  useEffect(() => {
    if (!isPlaying) {
      return undefined
    }

    const interval = setInterval(spawnNote, SPAWN_INTERVAL)
    return () => clearInterval(interval)
  }, [isPlaying, spawnNote])

  useEffect(() => {
    if (!isPlaying) {
      return undefined
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsPlaying(false)
          setNotes([])
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying])

  const [now, setNow] = useState(0)

  useEffect(() => {
    if (!isPlaying) {
      return undefined
    }

    let animationFrame
    const update = () => {
      const current = performance.now()
      nowRef.current = current
      setNow(current)
      animationFrame = requestAnimationFrame(update)
    }

    animationFrame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(animationFrame)
  }, [isPlaying])

  const handleMiss = useCallback((missedNote) => {
    setStats((prev) => {
      const nextEssentialStrike = missedNote.type === 'esencial' ? prev.essentialStrike + 1 : 0
      const nextSavingsGap = missedNote.type === 'ahorro' ? prev.savingsGap + 1 : 0
      const confidencePenalty = missedNote.type === 'ingreso' ? 8 : missedNote.type === 'ahorro' ? 10 : 6
      const saldoPenalty = missedNote.type === 'ingreso' ? -80 : 0
      let nextConfidence = clamp(prev.confidence - confidencePenalty, 10, 100)
      let nextMeta = prev.meta

      if (nextEssentialStrike >= 3) {
        nextConfidence = clamp(nextConfidence - 12, 10, 100)
      }

      if (nextSavingsGap >= 2) {
        nextMeta = Math.max(nextMeta - 12, 0)
      }

      return {
        ...prev,
        comboReady: missedNote.type === 'ingreso' ? false : prev.comboReady,
        comboStreak: 0,
        essentialStrike: nextEssentialStrike,
        savingsGap: nextSavingsGap,
        confidence: nextConfidence,
        saldo: prev.saldo + saldoPenalty,
        meta: nextMeta
      }
    })

    if (missedNote.type === 'esencial') {
      setFeedback('Perdiste un gasto esencial. Los clientes se preocupan y llegan menos ingresos.')
    } else if (missedNote.type === 'ahorro') {
      setFeedback('Saltaste dos ahorros seguidos: la barra se frena temporalmente.')
    } else {
      setFeedback('Oportunidad perdida. Mantén la vista en el ritmo para no retrasarte.')
    }
  }, [])

  useEffect(() => {
    if (!isPlaying) {
      return undefined
    }

    setNotes((prevNotes) => {
      if (prevNotes.length === 0) {
        return prevNotes
      }

      const activeNotes = []
      prevNotes.forEach((note) => {
        const progress = (nowRef.current - note.spawnedAt) / NOTE_DURATION
        if (progress > 1.12 && !note.hit) {
          handleMiss(note)
        }
        if (progress <= 1.12) {
          activeNotes.push(note)
        }
      })
      return activeNotes
    })

    return undefined
  }, [isPlaying, now, handleMiss])

  const handleSuccessfulHit = useCallback((note) => {
    setStats((prev) => {
      const effect = typeEffects[note.type]
      const nextComboReady = note.type === 'ingreso' ? true : prev.comboReady
      const comboBoost = prev.comboReady && note.type === 'ahorro' ? 12 : 0
      const nextMeta = clamp(prev.meta + effect.meta + comboBoost, 0, 120)
      const nextSaldo = prev.saldo + effect.saldo
      const nextConfidence = clamp(prev.confidence + effect.confidence + (comboBoost ? 4 : 0), 10, 100)
      const nextComboStreak = note.type === 'ahorro' && prev.comboReady ? prev.comboStreak + 1 : note.type === 'ingreso' ? prev.comboStreak : 0

      return {
        ...prev,
        saldo: nextSaldo,
        meta: nextMeta,
        confidence: nextConfidence,
        comboReady: nextComboReady && note.type !== 'ahorro',
        comboStreak: nextComboStreak,
        essentialStrike: note.type === 'esencial' ? 0 : prev.essentialStrike,
        savingsGap: note.type === 'ahorro' ? 0 : prev.savingsGap
      }
    })

    const effect = typeEffects[note.type]
    const laneName = LANES.find((lane) => lane.type === note.type)?.name ?? 'acción'
    const message = effect?.message ?? 'Acción registrada.'
    if (note.type === 'ahorro' && statsRef.current.comboReady) {
      setFeedback(`${message} ¡Combo perfecto ingreso + ahorro!`)
    } else {
      setFeedback(`${laneName}: ${message}`)
    }
  }, [])

  const attemptHit = useCallback(
    (laneIndex) => {
      if (!isPlaying) {
        return
      }

      const lane = LANES[laneIndex]
      if (lane.type === 'ahorro' && statsRef.current.saldo < 40) {
        setFeedback('Saldo insuficiente para ahorrar. Acierta un ingreso primero.')
        return
      }

      setNotes((prevNotes) => {
        let hitNoteIndex = -1
        for (let index = 0; index < prevNotes.length; index += 1) {
          const note = prevNotes[index]
          if (note.lane !== laneIndex || note.hit) {
            continue
          }

          const progress = (nowRef.current - note.spawnedAt) / NOTE_DURATION
          if (progress >= 0.72 && progress <= 1.08) {
            hitNoteIndex = index
            break
          }
        }

        if (hitNoteIndex === -1) {
          setFeedback('Golpe fuera de ritmo. Ajusta el tiempo con el compás luminoso.')
          setStats((prev) => ({
            ...prev,
            comboStreak: 0,
            confidence: clamp(prev.confidence - 2, 10, 100)
          }))
          return prevNotes
        }

        const noteToHit = prevNotes[hitNoteIndex]

        const updatedNotes = [...prevNotes]
        updatedNotes.splice(hitNoteIndex, 1)
        handleSuccessfulHit(noteToHit)
        return updatedNotes
      })
    },
    [handleSuccessfulHit, isPlaying]
  )

  useEffect(() => {
    if (!isPlaying) {
      return undefined
    }

    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase()
      const lane = LANES.findIndex((item) => item.key === key)
      if (lane !== -1) {
        event.preventDefault()
        attemptHit(lane)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [attemptHit, isPlaying])

  const result = useMemo(() => {
    if (isPlaying || timeLeft !== 0) {
      return null
    }

    const victory = stats.meta >= 100 && stats.saldo >= 0 && stats.confidence >= 40

    return {
      victory,
      message: victory
        ? '¡Meta alcanzada! Mantienes el saldo positivo y llenaste la barra a tiempo.'
        : 'No alcanzaste la meta. Revisa el equilibrio entre ingresos, gastos y ahorros.',
      details: [
        `Barra de meta: ${Math.min(stats.meta, 120)}%`,
        `Saldo final: ${stats.saldo >= 0 ? '$' + Math.round(stats.saldo) : '-$' + Math.abs(Math.round(stats.saldo))}`,
        `Confianza del público: ${Math.round(stats.confidence)}%`
      ]
    }
  }, [isPlaying, stats.confidence, stats.meta, stats.saldo, timeLeft])

  const startGame = () => {
    resetGame()
    setIsPlaying(true)
    spawnNote()
  }

  const progressMeta = useMemo(() => Math.min(stats.meta, 100), [stats.meta])
  const confidenceClass = useMemo(() => {
    if (stats.confidence >= 70) return 'game__confidence--high'
    if (stats.confidence >= 40) return 'game__confidence--medium'
    return 'game__confidence--low'
  }, [stats.confidence])

  return (
    <div className="game">
      <header className="game__header">
        <div>
          <h4>Sinfonía de Metas · Vista previa interactiva</h4>
          <p>Controla las cuatro líneas con D, F, J y K. El objetivo es mantener saldo ≥ 0 y llenar la barra de meta.</p>
        </div>
        <div className="game__actions">
          <button type="button" onClick={startGame} disabled={isPlaying}>
            {isPlaying ? 'Partida en curso' : 'Iniciar práctica' }
          </button>
          <button type="button" onClick={resetGame} disabled={isPlaying}>
            Reiniciar
          </button>
        </div>
      </header>

      <div className="game__status">
        <div>
          <span>Tiempo restante</span>
          <strong>{timeLeft}s</strong>
        </div>
        <div>
          <span>Saldo</span>
          <strong className={stats.saldo >= 0 ? 'game__saldo-positive' : 'game__saldo-negative'}>
            ${Math.round(stats.saldo)}
          </strong>
        </div>
        <div>
          <span>Confianza</span>
          <strong className={`game__confidence ${confidenceClass}`}>{Math.round(stats.confidence)}%</strong>
        </div>
      </div>

      <div className="game__progress">
        <span>Barra de meta</span>
        <div className="game__progress-bar">
          <div className="game__progress-fill" style={{ width: `${progressMeta}%` }} />
        </div>
      </div>

      <div className="game__lanes">
        {LANES.map((lane) => (
          <div key={lane.id} className="game__lane">
            <header style={{ borderColor: lane.color }}>
              <span>{lane.name}</span>
              <strong>{lane.key.toUpperCase()}</strong>
            </header>
            <div className="game__lane-body">
              {notes
                .filter((note) => note.lane === lane.id)
                .map((note) => {
                  const progress = clamp((now - note.spawnedAt) / NOTE_DURATION, 0, 1)
                  return (
                    <div
                      key={note.id}
                      className={`game__note game__note--${lane.type}`}
                      style={{ transform: `translateY(${progress * 100}%)` }}
                    />
                  )
                })}
            </div>
            <div className="game__hit-zone">Zona de impacto</div>
          </div>
        ))}
      </div>

      <p className="game__feedback">{feedback}</p>

      {result && (
        <div className={`game__result ${result.victory ? 'game__result--victory' : 'game__result--fail'}`}>
          <strong>{result.message}</strong>
          <ul>
            {result.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>
      )}

      <aside className="game__legend">
        <h5>Referencias rápidas</h5>
        <ul>
          <li>Golpea ingresos antes de los ahorros para activar combos.</li>
          <li>Si fallas 3 gastos esenciales seguidos, la confianza cae drásticamente.</li>
          <li>Ignorar dos ahorros consecutivos frena la barra por unos segundos.</li>
          <li>Los gastos flexibles pueden omitirse, pero pierdes confianza.</li>
        </ul>
      </aside>
    </div>
  )
}

export default Unit1RhythmGame
