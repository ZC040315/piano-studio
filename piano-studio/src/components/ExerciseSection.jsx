import Practice from './Practice.jsx'

export default function ExerciseSection({ exercise, onComplete }) {
  return (
    <section className="exercise">
      <h3>{exercise.title}</h3>
      <Practice exerciseId={exercise.id} onComplete={onComplete} />
    </section>
  )
}
