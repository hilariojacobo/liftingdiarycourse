"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Set = {
  setNumber: number
  reps: number | null
  weight: string | null
}

type WorkoutExercise = {
  id: number
  order: number
  exercise: { name: string }
  sets: Set[]
}

type Workout = {
  id: number
  name: string
  startedAt: string
  workoutExercises: WorkoutExercise[]
}

function formatDate(date: Date): string {
  const day = date.getDate()
  const suffix =
    day % 100 >= 11 && day % 100 <= 13
      ? "th"
      : day % 10 === 1
        ? "st"
        : day % 10 === 2
          ? "nd"
          : day % 10 === 3
            ? "rd"
            : "th"
  return `${day}${suffix} ${format(date, "MMM yyyy")}`
}

export function DashboardContent({
  workouts,
  date,
}: {
  workouts: Workout[]
  date: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const selectedDate = new Date(date)

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Workout Log</h1>

      <div className="mb-8">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-2 sm:w-auto">
              <CalendarIcon className="size-4" />
              {formatDate(selectedDate)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(d) => {
                if (d) {
                  router.push(`/dashboard?date=${format(d, "yyyy-MM-dd")}`)
                  setOpen(false)
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold">
          Workouts for {formatDate(selectedDate)}
        </h2>
        {workouts.length === 0 ? (
          <p className="text-muted-foreground">No workouts logged for this date.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {workouts.map((workout) => (
              <Card key={workout.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{workout.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {workout.workoutExercises.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No exercises logged.</p>
                  ) : (
                    <ul className="flex flex-col gap-1">
                      {workout.workoutExercises.map((we) => (
                        <li key={we.id} className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">{we.exercise.name}</span>
                          {we.sets.length > 0 && (
                            <span>
                              {" — "}
                              {we.sets.map((s, i) => (
                                <span key={i}>
                                  {i > 0 && ", "}
                                  {s.reps != null ? `${s.reps} reps` : "—"}
                                  {s.weight != null ? ` @ ${s.weight}kg` : ""}
                                </span>
                              ))}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
