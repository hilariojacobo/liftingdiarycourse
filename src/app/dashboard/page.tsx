import { auth } from "@clerk/nextjs/server"
import { getUserWorkouts } from "@/data/workouts"
import { DashboardContent } from "./_components/dashboard-content"

export default async function DashboardPage(
  props: { searchParams: Promise<{ date?: string }> }
) {
  const { userId } = await auth()
  const { date: dateParam } = await props.searchParams
  const selectedDate = dateParam
    ? (() => { const [y, m, d] = dateParam.split("-").map(Number); return new Date(y, m - 1, d) })()
    : new Date()
  const rawWorkouts = await getUserWorkouts(userId!, selectedDate)

  const workouts = rawWorkouts.map((w) => ({
    id: w.id,
    name: w.name,
    startedAt: w.started_at.toISOString(),
    workoutExercises: w.workout_exercises.map((we) => ({
      id: we.id,
      order: we.order,
      exercise: { name: we.exercise.name },
      sets: we.sets.map((s) => ({
        setNumber: s.set_number,
        reps: s.reps,
        weight: s.weight,
      })),
    })),
  }))

  return <DashboardContent workouts={workouts} date={selectedDate.toISOString()} />
}
