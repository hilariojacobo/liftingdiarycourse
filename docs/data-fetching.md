# Data Fetching

## Rule: Server Components Only

**All data fetching in this app must happen exclusively in Server Components.**

Do not fetch data in:
- Route Handlers (`app/api/*/route.ts`)
- Client Components (`"use client"`)
- `useEffect` hooks
- Third-party client-side data libraries (SWR, React Query, etc.)

If a Client Component needs data, fetch it in a Server Component ancestor and pass it down as props.

## Rule: Drizzle ORM via `/data` Helper Functions

**All database queries must go through helper functions in the `/data` directory.**

Do not write raw SQL. Do not call the database directly from page or layout components. Every query must be encapsulated in a named helper function that uses Drizzle ORM.

```
src/
  data/
    workouts.ts     # e.g. getUserWorkouts(), getWorkoutById()
    exercises.ts    # e.g. getUserExercises()
```

### Example helper function

```ts
// src/data/workouts.ts
import { db } from "@/db"
import { workouts } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getUserWorkouts(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId))
}
```

### Example usage in a Server Component

```tsx
// src/app/dashboard/page.tsx
import { getUserWorkouts } from "@/data/workouts"
import { auth } from "@/auth"

export default async function DashboardPage() {
  const session = await auth()
  const workouts = await getUserWorkouts(session.user.id)

  return <WorkoutList workouts={workouts} />
}
```

## Rule: Every Query Must Be Scoped to the Authenticated User

**A logged-in user must only ever be able to access their own data.**

Every helper function that reads user-owned data must accept a `userId` parameter and filter by it in the Drizzle query. Never fetch all rows and filter in application code — the `WHERE` clause must be in the database query.

```ts
// CORRECT — scoped at the query level
export async function getWorkoutById(workoutId: string, userId: string) {
  const result = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .limit(1)

  return result[0] ?? null
}
```

```ts
// WRONG — fetches the row then checks ownership in JS
export async function getWorkoutById(workoutId: string, userId: string) {
  const result = await db.select().from(workouts).where(eq(workouts.id, workoutId))
  if (result[0]?.userId !== userId) return null  // ❌ race condition, wrong approach
  return result[0]
}
```

The `userId` passed to every helper must come from the server-side session (`auth()`), never from a URL parameter, query string, or request body supplied by the client.

```tsx
// CORRECT — userId from trusted server session
const session = await auth()
const workout = await getWorkoutById(params.id, session.user.id)

// WRONG — userId from untrusted client input
const workout = await getWorkoutById(params.id, searchParams.userId)  // ❌
```
