import { relations } from "drizzle-orm/relations";
import { workouts, workoutCompletions, workoutCompletionSeries, exercises, workoutExercises, workoutExerciseSeries, groups, users } from "./schema";

export const workoutCompletionsRelations = relations(workoutCompletions, ({one, many}) => ({
	workout: one(workouts, {
		fields: [workoutCompletions.workoutId],
		references: [workouts.id]
	}),
	workoutCompletionSeries: many(workoutCompletionSeries),
}));

export const workoutsRelations = relations(workouts, ({one, many}) => ({
	workoutCompletions: many(workoutCompletions),
	workoutExercises: many(workoutExercises),
	user: one(users, {
		fields: [workouts.userId],
		references: [users.id]
	}),
}));

export const workoutCompletionSeriesRelations = relations(workoutCompletionSeries, ({one}) => ({
	workoutCompletion: one(workoutCompletions, {
		fields: [workoutCompletionSeries.workoutCompletionId],
		references: [workoutCompletions.id]
	}),
	exercise: one(exercises, {
		fields: [workoutCompletionSeries.exerciseId],
		references: [exercises.id]
	}),
}));

export const exercisesRelations = relations(exercises, ({one, many}) => ({
	workoutCompletionSeries: many(workoutCompletionSeries),
	workoutExercises: many(workoutExercises),
	group: one(groups, {
		fields: [exercises.groupId],
		references: [groups.id]
	}),
	user: one(users, {
		fields: [exercises.userId],
		references: [users.id]
	}),
}));

export const workoutExerciseSeriesRelations = relations(workoutExerciseSeries, ({one}) => ({
	workoutExercise: one(workoutExercises, {
		fields: [workoutExerciseSeries.workoutExerciseId],
		references: [workoutExercises.id]
	}),
}));

export const workoutExercisesRelations = relations(workoutExercises, ({one, many}) => ({
	workoutExerciseSeries: many(workoutExerciseSeries),
	exercise: one(exercises, {
		fields: [workoutExercises.exerciseId],
		references: [exercises.id]
	}),
	workout: one(workouts, {
		fields: [workoutExercises.workoutId],
		references: [workouts.id]
	}),
}));

export const groupsRelations = relations(groups, ({many}) => ({
	exercises: many(exercises),
}));

export const usersRelations = relations(users, ({many}) => ({
	exercises: many(exercises),
	workouts: many(workouts),
}));