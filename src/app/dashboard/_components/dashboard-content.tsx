"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const mockWorkouts = [
  { id: 1, name: "Bench Press", sets: 3, reps: 10, weight: "80kg" },
  { id: 2, name: "Squat", sets: 4, reps: 8, weight: "100kg" },
  { id: 3, name: "Deadlift", sets: 3, reps: 5, weight: "120kg" },
]

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

export function DashboardContent() {
  const [date, setDate] = useState<Date>(new Date())
  const [open, setOpen] = useState(false)

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Workout Log</h1>

      <div className="mb-8">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-2 sm:w-auto">
              <CalendarIcon className="size-4" />
              {formatDate(date)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                if (d) {
                  setDate(d)
                  setOpen(false)
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold">
          Workouts for {formatDate(date)}
        </h2>
        {mockWorkouts.length === 0 ? (
          <p className="text-muted-foreground">No workouts logged for this date.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {mockWorkouts.map((workout) => (
              <Card key={workout.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{workout.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {workout.sets} sets × {workout.reps} reps @ {workout.weight}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
