import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  numeric,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const exercises = pgTable('exercises', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export const workouts = pgTable('workouts', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull(),
  name: text('name').notNull(),
  started_at: timestamp('started_at').notNull().defaultNow(),
  completed_at: timestamp('completed_at'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export const workout_exercises = pgTable('workout_exercises', {
  id: serial('id').primaryKey(),
  workout_id: integer('workout_id')
    .notNull()
    .references(() => workouts.id, { onDelete: 'cascade' }),
  exercise_id: integer('exercise_id')
    .notNull()
    .references(() => exercises.id, { onDelete: 'restrict' }),
  order: integer('order').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export const sets = pgTable('sets', {
  id: serial('id').primaryKey(),
  workout_exercise_id: integer('workout_exercise_id')
    .notNull()
    .references(() => workout_exercises.id, { onDelete: 'cascade' }),
  set_number: integer('set_number').notNull(),
  reps: integer('reps'),
  weight: numeric('weight', { precision: 6, scale: 2 }),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export const exercises_relations = relations(exercises, ({ many }) => ({
  workout_exercises: many(workout_exercises),
}));

export const workouts_relations = relations(workouts, ({ many }) => ({
  workout_exercises: many(workout_exercises),
}));

export const workout_exercises_relations = relations(workout_exercises, ({ one, many }) => ({
  workout: one(workouts, {
    fields: [workout_exercises.workout_id],
    references: [workouts.id],
  }),
  exercise: one(exercises, {
    fields: [workout_exercises.exercise_id],
    references: [exercises.id],
  }),
  sets: many(sets),
}));

export const sets_relations = relations(sets, ({ one }) => ({
  workout_exercise: one(workout_exercises, {
    fields: [sets.workout_exercise_id],
    references: [workout_exercises.id],
  }),
}));
