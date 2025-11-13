import './UnitVideo.css'

const UnitVideo = ({ title, description, image, duration = '6 minutos' }) => {
  return (
    <div className="unit-video">
      <div className="unit-video__media">
        <img src={image} alt={`Ilustración del video ${title}`} />
        <div className="unit-video__overlay">
          <span className="unit-video__badge">Video próximamente</span>
          <p className="unit-video__note">Prepárate para la explicación guiada sobre {title.toLowerCase()}.</p>
        </div>
      </div>
      <div className="unit-video__meta">
        <p className="unit-video__description">{description}</p>
        <div className="unit-video__tags">
          <span className="unit-video__tag">Duración estimada: {duration}</span>
          <span className="unit-video__tag">Formato: Historia + ejemplos SMART</span>
        </div>
      </div>
    </div>
  )
}

export default UnitVideo
