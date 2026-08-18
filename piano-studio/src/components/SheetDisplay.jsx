export default function SheetDisplay({ notes, currentIndex = -1 }) {
  return (
    <div className="sheet" role="img" aria-label="简谱">
      {notes.map((note, i) => (
        <span key={i} className={`sheet-note${i === currentIndex ? ' is-current' : ''}`}>
          {note.chord
            ? <span className="sheet-chord">{note.chordLabels.map((label, j) => <span key={j} className="sheet-chord-note">{label}</span>)}</span>
            : <span className="sheet-pitch">{note.label}</span>}
          {note.beats > 1 && <span className="sheet-dash">{'-'.repeat(note.beats - 1)}</span>}
        </span>
      ))}
    </div>
  )
}
