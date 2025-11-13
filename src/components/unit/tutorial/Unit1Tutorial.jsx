import { useMemo, useState } from 'react'
import './Unit1Tutorial.css'

const STATIONS = {
  metas: {
    id: 'metas',
    title: 'Recepción de metas',
    label: 'Meta SMART',
    highlight: 'Concreta tu meta con monto, fecha y propósito.',
    defaultGoal: {
      destino: 'Viaje a Mérida',
      monto: 12000,
      semanas: 20
    }
  },
  presupuesto: {
    id: 'presupuesto',
    title: 'Estación de presupuesto',
    label: 'Distribuye ingresos',
    highlight: 'Ordena ingresos frente a gastos esenciales y flexibles.',
    baseIngreso: 4800
  },
  ahorro: {
    id: 'ahorro',
    title: 'Estación de ahorro programado',
    label: 'Plan semanal',
    highlight: 'Llena cada caja semanal con aportes constantes.'
  }
}

const WEEK_TARGET = 600

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(value)

const Unit1Tutorial = ({ assistant, flow, setting }) => {
  const [activeStation, setActiveStation] = useState('metas')
  const [goal, setGoal] = useState(() => STATIONS.metas.defaultGoal)
  const [needs, setNeeds] = useState(2200)
  const [wants, setWants] = useState(900)
  const [autoSavings, setAutoSavings] = useState(600)
  const [weeks, setWeeks] = useState(() => new Array(4).fill(0))

  const ingresoDisponible = STATIONS.presupuesto.baseIngreso
  const assigned = needs + wants + autoSavings
  const balance = ingresoDisponible - assigned

  const goalScore = useMemo(() => {
    const { destino, monto, semanas } = goal
    const completeness = [destino, monto, semanas].reduce((acc, item) => (item ? acc + 1 : acc), 0)
    const precisionBonus = monto >= 1000 && semanas >= 4 ? 0.5 : 0
    return Math.min(1, completeness / 3 + precisionBonus / 2)
  }, [goal])

  const ruleFeedback = useMemo(() => {
    const needsRatio = Math.round((needs / ingresoDisponible) * 100)
    const wantsRatio = Math.round((wants / ingresoDisponible) * 100)
    const savingsRatio = Math.round((autoSavings / ingresoDisponible) * 100)

    return {
      needsRatio,
      wantsRatio,
      savingsRatio,
      message:
        needsRatio <= 55 && wantsRatio <= 35 && savingsRatio >= 20
          ? 'Distribución balanceada. Estás cerca del 50-30-20 adaptable.'
          : 'Ajusta tus fichas: prioriza esenciales ≤55%, gustos ≤35% y ahorro ≥20%.'
    }
  }, [needs, wants, autoSavings, ingresoDisponible])

  const weeklyFilled = weeks.filter((amount) => amount >= WEEK_TARGET).length

  const handleWeekFill = (index) => {
    setWeeks((prev) => {
      const next = [...prev]
      next[index] = next[index] >= WEEK_TARGET ? 0 : WEEK_TARGET
      return next
    })
  }

  return (
    <div className="tutorial">
      <div className="tutorial__map">
        <div className="tutorial__setting">
          <span className="tutorial__setting-label">Escenario</span>
          <p>{setting}</p>
        </div>
        <div className="tutorial__stations">
          {Object.values(STATIONS).map((station) => (
            <button
              key={station.id}
              type="button"
              className={`tutorial__station ${activeStation === station.id ? 'tutorial__station--active' : ''}`}
              onClick={() => setActiveStation(station.id)}
            >
              <span className="tutorial__station-label">{station.label}</span>
              <strong>{station.title}</strong>
              <p>{station.highlight}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="tutorial__content">
        <div className="tutorial__assistant">
          <span className="tutorial__assistant-tag">Asistente virtual</span>
          <h4>{assistant.name}</h4>
          <p className="tutorial__assistant-role">{assistant.role}</p>
          <p className="tutorial__assistant-personality">{assistant.personality}</p>
        </div>

        <div className="tutorial__panel">
          {activeStation === 'metas' && (
            <div className="tutorial__panel-card">
              <header>
                <h5>Panel holográfico de metas</h5>
                <span className="tutorial__metric">Claridad: {Math.round(goalScore * 100)}%</span>
              </header>
              <div className="tutorial__grid">
                <label>
                  Destino específico
                  <input
                    type="text"
                    value={goal.destino}
                    onChange={(event) => setGoal((prev) => ({ ...prev, destino: event.target.value }))}
                    placeholder="Ej. Viaje a Mérida"
                  />
                </label>
                <label>
                  Costo estimado (MXN)
                  <input
                    type="number"
                    min="500"
                    step="100"
                    value={goal.monto}
                    onChange={(event) =>
                      setGoal((prev) => ({ ...prev, monto: Number.parseInt(event.target.value || '0', 10) }))
                    }
                  />
                </label>
                <label>
                  Semanas para lograrlo
                  <input
                    type="number"
                    min="4"
                    max="52"
                    value={goal.semanas}
                    onChange={(event) =>
                      setGoal((prev) => ({ ...prev, semanas: Number.parseInt(event.target.value || '0', 10) }))
                    }
                  />
                </label>
              </div>
              <p className="tutorial__panel-text">
                Completa los campos para que Lía convierta la meta en un plan SMART. Cuanta más precisión, más rápido se llena la
                barra de progreso.
              </p>
              <div className="tutorial__progress">
                <div className="tutorial__progress-bar" style={{ width: `${Math.round(goalScore * 100)}%` }} />
              </div>
            </div>
          )}

          {activeStation === 'presupuesto' && (
            <div className="tutorial__panel-card">
              <header>
                <h5>Mesas interactivas de presupuesto</h5>
                <span className="tutorial__metric">Ingreso mensual: {formatCurrency(ingresoDisponible)}</span>
              </header>
              <div className="tutorial__grid tutorial__grid--three">
                <label>
                  Necesidades
                  <input
                    type="range"
                    min="1800"
                    max="2600"
                    step="50"
                    value={needs}
                    onChange={(event) => setNeeds(Number.parseInt(event.target.value, 10))}
                  />
                  <span className="tutorial__range-value">{formatCurrency(needs)}</span>
                </label>
                <label>
                  Gustos
                  <input
                    type="range"
                    min="600"
                    max="1400"
                    step="50"
                    value={wants}
                    onChange={(event) => setWants(Number.parseInt(event.target.value, 10))}
                  />
                  <span className="tutorial__range-value">{formatCurrency(wants)}</span>
                </label>
                <label>
                  Ahorro automático
                  <input
                    type="range"
                    min="400"
                    max="1000"
                    step="50"
                    value={autoSavings}
                    onChange={(event) => setAutoSavings(Number.parseInt(event.target.value, 10))}
                  />
                  <span className="tutorial__range-value">{formatCurrency(autoSavings)}</span>
                </label>
              </div>
              <div className="tutorial__panel-summary">
                <div>
                  <strong>Balance inmediato</strong>
                  <p className={balance >= 0 ? 'tutorial__balance-positive' : 'tutorial__balance-negative'}>
                    {balance >= 0 ? 'Te queda' : 'Falta cubrir'} {formatCurrency(Math.abs(balance))}
                  </p>
                </div>
                <div>
                  <strong>Distribución</strong>
                  <p>
                    {ruleFeedback.needsRatio}% necesidades · {ruleFeedback.wantsRatio}% gustos · {ruleFeedback.savingsRatio}% ahorro
                  </p>
                  <span className="tutorial__panel-hint">{ruleFeedback.message}</span>
                </div>
              </div>
            </div>
          )}

          {activeStation === 'ahorro' && (
            <div className="tutorial__panel-card">
              <header>
                <h5>Cajas de ahorro programado</h5>
                <span className="tutorial__metric">Semanas completas: {weeklyFilled}/4</span>
              </header>
              <p className="tutorial__panel-text">
                Haz clic en cada semana para llenar la caja con {formatCurrency(WEEK_TARGET)}. Visualiza cómo el plan semanal acelera
                la barra de la meta.
              </p>
              <div className="tutorial__weeks">
                {weeks.map((amount, index) => (
                  <button
                    key={`week-${index}`}
                    type="button"
                    className={`tutorial__week ${amount >= WEEK_TARGET ? 'tutorial__week--filled' : ''}`}
                    onClick={() => handleWeekFill(index)}
                  >
                    <span>Semana {index + 1}</span>
                    <strong>{amount >= WEEK_TARGET ? '✔ Completada' : formatCurrency(WEEK_TARGET)}</strong>
                  </button>
                ))}
              </div>
              <div className="tutorial__panel-summary">
                <div>
                  <strong>Aporte mensual comprometido</strong>
                  <p>{formatCurrency(weeks.reduce((acc, current) => acc + current, 0))}</p>
                </div>
                <div>
                  <strong>Motivación de Lía</strong>
                  <p>{weeklyFilled === weeks.length ? '¡Plan listo! Lía libera el reporte animado.' : 'Completa las cajas para cerrar el tutorial.'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="tutorial__flow">
        <h5>Ruta guiada paso a paso</h5>
        <ol>
          {flow.map((step) => (
            <li key={step.title}>
              <div>
                <strong>{step.title}</strong>
                <p>{step.description}</p>
              </div>
              <ul>
                {step.interactions.map((interaction) => (
                  <li key={interaction}>{interaction}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default Unit1Tutorial
