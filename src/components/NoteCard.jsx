import { StickyNote, Calendar } from 'lucide-react'
import './NoteCard.css'

const NoteCard = ({ note }) => {
  return (
    <div className={`note-card note-card-${note.color || 'blue'}`}>
      <div className="note-header">
        <StickyNote className="note-icon" />
        <div className="note-header-content">
          <h4 className="note-title">{note.title}</h4>
          <div className="note-date">
            <Calendar />
            <span>{note.date}</span>
          </div>
        </div>
      </div>
      
      <p className="note-content">
        {note.content}
      </p>
    </div>
  )
}

export default NoteCard
