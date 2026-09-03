import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UnitCard from '../components/cards/UnitCard'
import AchievementCard from '../components/AchievementCard'
import NoteCard from '../components/NoteCard'
import UserProfile from '../components/UserProfile'
import { courseOverview } from '../data/courseStructure'
import { achievements } from '../data/achievements'
import { notes } from '../data/notes'
import { Sparkles, BookOpen, Gamepad2, GraduationCap, Trophy, StickyNote, UserRound } from 'lucide-react'
import { useCourseProgress } from '../progress/courseProgress'
import './css/HomePage.css'

const HomePage = ({ units }) => {
  const navigate = useNavigate()
  const { state, isUnitUnlocked } = useCourseProgress()
  const [activeTab, setActiveTab] = useState('modulos')
  const highlightIcons = [BookOpen, Sparkles, Gamepad2]
  
  const handleOpenUnit = (unit) => {
    if (!isUnitUnlocked(unit.id)) return
    navigate(`/unit/${unit.id}`)
  }

  const unitsWithProgress = units.map((unit) => ({
    ...unit,
    isUnlocked: isUnitUnlocked(unit.id),
    progress: state.units[unit.id],
  }))
  
  // Statistics
  const unlockedAchievements = achievements.filter(a => a.unlocked).length
  const totalAchievements = achievements.length
  
  return (
    <section className="home-page">
      <div className="home-container">
        
        {/* Hero Section */}
        <div className="home-hero">
          <div className="hero-decor-top"></div>
          <div className="hero-decor-bottom"></div>
          
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles />
              <span>Módulo Interactivo</span>
            </div>
            
            <h1 className="hero-title">
              {courseOverview.title}
            </h1>
            
            <p className="hero-description">
              {courseOverview.description}
            </p>

            {/* Highlight Cards */}
            <div className="hero-highlights">
              {courseOverview.highlights.map((highlight, index) => {
                const Icon = highlightIcons[index]
                return (
                  <div key={highlight} className="highlight-card">
                    <div className="highlight-icon">
                      <Icon />
                    </div>
                    <span>{highlight}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="home-tabs">
          <div className="tabs-list">
            <button 
              className={`tab-button ${activeTab === 'modulos' ? 'tab-button-active' : ''}`}
              onClick={() => setActiveTab('modulos')}
            >
              <GraduationCap />
              Módulos
            </button>
            <button 
              className={`tab-button ${activeTab === 'logros' ? 'tab-button-active' : ''}`}
              onClick={() => setActiveTab('logros')}
            >
              <Trophy />
              Logros
            </button>
            <button 
              className={`tab-button ${activeTab === 'notas' ? 'tab-button-active' : ''}`}
              onClick={() => setActiveTab('notas')}
            >
              <StickyNote />
              Notas
            </button>
            <button
              className={`tab-button ${activeTab === 'perfil' ? 'tab-button-active' : ''}`}
              onClick={() => setActiveTab('perfil')}
            >
              <UserRound />
              Perfil
            </button>
          </div>

          {/* Módulos Tab */}
          {activeTab === 'modulos' && (
            <div>
              <div className="section-header">
                <div className="section-title-row">
                  <div className="section-title-content">
                    <div className="section-accent"></div>
                    <h2>Unidades del módulo</h2>
                  </div>
                </div>
                <p className="section-description">
                  {courseOverview.welcome}
                </p>
              </div>

              <div className="units-grid">
                {unitsWithProgress.map((unit) => (
                  <UnitCard key={unit.id} unit={unit} onOpen={handleOpenUnit} />
                ))}
              </div>
            </div>
          )}

          {/* Logros Tab */}
          {activeTab === 'logros' && (
            <div>
              <div className="section-header">
                <div className="section-title-row">
                  <div className="section-title-content">
                    <div className="section-accent"></div>
                    <h2>Logros</h2>
                  </div>
                  <div className="section-stats">
                    {unlockedAchievements} / {totalAchievements} desbloqueados
                  </div>
                </div>
                <p className="section-description">
                  Completa desafíos y desbloquea logros mientras avanzas en tu aprendizaje financiero.
                </p>
              </div>

              <div className="achievements-grid">
                {achievements.map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </div>
          )}

          {/* Notas Tab */}
          {activeTab === 'notas' && (
            <div>
              <div className="section-header">
                <div className="section-title-row">
                  <div className="section-title-content">
                    <div className="section-accent"></div>
                    <h2>Mis notas</h2>
                  </div>
                </div>
                <p className="section-description">
                  Guarda conceptos importantes y recordatorios de cada unidad.
                </p>
              </div>

              {notes.length > 0 ? (
                <div className="notes-grid">
                  {notes.map((note) => (
                    <NoteCard key={note.id} note={note} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <StickyNote />
                  <p>Aún no tienes notas guardadas</p>
                  <p>Completa unidades para crear tus primeras notas</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'perfil' && <UserProfile />}
        </div>
      </div>
    </section>
  )
}

export default HomePage
