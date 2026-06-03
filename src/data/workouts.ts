import { db } from "@/db"
import { workouts } from "@/db/schema"
import { and, eq, gte, lt } from "drizzle-orm"

export async function getUserWorkouts(userId: string, date: Date) {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(end.getDate() + 1)

  return db.query.workouts.findMany({
    where: and(
      eq(workouts.user_id, userId),
      gte(workouts.started_at, start),
      lt(workouts.started_at, end),
    ),
    with: {
      workout_exercises: {
        with: {
          exercise: true,
          sets: true,
        },
        orderBy: (we, { asc }) => [asc(we.order)],
      },
    },
    orderBy: (w, { desc }) => [desc(w.started_at)],
  })
}
