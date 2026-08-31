import { useMemo, useState } from 'react'
import { CheckCircle2, Clock3, Save, ShieldCheck, UserRound } from 'lucide-react'
import { units } from '../data/courseStructure'
import { useCourseProgress } from '../progress/courseProgress'
import './UserProfile.css'

const statusLabels = {
  not_started: 'Sin iniciar',
  in_progress: 'En progreso',
  completed: 'Completada',
}

const formatDate = (value) => {
  if (!value) return '—'
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export default function UserProfile() {
  const { state, updateProfile, isUnitUnlocked } = useCourseProgress()
  const [form, setForm] = useState(state.user)
  const [saved, setSaved] = useState(false)

  const completedCount = useMemo(
    () => Object.values(state.units).filter((unit) => unit.status === 'completed').length,
    [state.units],
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    updateProfile(form)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2200)
  }

  return (
    <div className="profile-layout">
      <section className="profile-card" aria-labelledby="profile-title">
        <div className="profile-card-heading">
          <span className="profile-icon"><UserRound /></span>
          <div>
            <h2 id="profile-title">Perfil del participante</h2>
            <p>Estos datos identifican el progreso guardado en este dispositivo.</p>
          </div>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <label>
            Nombre completo
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              autoComplete="name"
              required
            />
          </label>
          <label>
            Correo electrónico
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              autoComplete="email"
              placeholder="nombre@correo.com"
            />
          </label>
          <label>
            Documento o código de participante
            <input
              value={form.documentId}
              onChange={(event) => setForm({ ...form, documentId: event.target.value })}
              placeholder="Opcional"
            />
          </label>
          <div className="profile-id">
            <span>ID de seguimiento</span>
            <code>{state.user.id}</code>
          </div>
          <button className="profile-save" type="submit">
            {saved ? <CheckCircle2 /> : <Save />}
            {saved ? 'Datos guardados' : 'Guardar perfil'}
          </button>
        </form>
      </section>

      <section className="profile-card profile-summary" aria-labelledby="summary-title">
        <div className="profile-card-heading">
          <span className="profile-icon profile-icon--green"><ShieldCheck /></span>
          <div>
            <h2 id="summary-title">Seguimiento del curso</h2>
            <p>{completedCount} de {units.length} unidades completadas con éxito.</p>
          </div>
        </div>

        <div className="progress-table-wrap">
          <table className="progress-table">
            <thead>
              <tr>
                <th>Unidad</th>
                <th>Estado</th>
                <th>Primer acceso</th>
                <th>Último acceso</th>
                <th>Finalización</th>
                <th>Accesos</th>
                <th>Intentos</th>
                <th>Mejor resultado</th>
              </tr>
            </thead>
            <tbody>
              {units.map((unit) => {
                const progress = state.units[unit.id]
                const status = isUnitUnlocked(unit.id) ? progress.status : 'locked'
                return (
                  <tr key={unit.id}>
                    <td><strong>{unit.number}</strong> {unit.title}</td>
                    <td>
                      <span className={`profile-status profile-status--${status}`}>
                        {status === 'locked' ? 'Bloqueada' : statusLabels[status]}
                      </span>
                    </td>
                    <td>{formatDate(progress.firstAccessedAt)}</td>
                    <td>{formatDate(progress.lastAccessedAt)}</td>
                    <td>{formatDate(progress.completedAt)}</td>
                    <td>{progress.accessCount}</td>
                    <td>{progress.evaluation.attempts}</td>
                    <td>
                      {progress.evaluation.bestScore === null
                        ? '—'
                        : `${progress.evaluation.bestScore}${progress.evaluation.total ? ` / ${progress.evaluation.total}` : ''}`}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="profile-note">
          <Clock3 />
          <p>Se conservan la fecha del primer y último acceso, la finalización exitosa y los intentos de evaluación.</p>
        </div>
      </section>
    </div>
  )
}
