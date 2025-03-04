import { pgTable, text, foreignKey, timestamp, integer, real, unique } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"




export const groups = pgTable("groups", {
	id: text("id").primaryKey().notNull(),
	title: text("title").notNull(),
});

export const workoutCompletions = pgTable("workout_completions", {
	id: text("id").primaryKey().notNull(),
	workoutId: text("workout_id").notNull(),
	start: timestamp("start", { mode: 'string' }).notNull(),
	end: timestamp("end", { mode: 'string' }).notNull(),
},
(table) => {
	return {
		workoutCompletionsWorkoutIdWorkoutsIdFk: foreignKey({
			columns: [table.workoutId],
			foreignColumns: [workouts.id],
			name: "workout_completions_workout_id_workouts_id_fk"
		}).onDelete("cascade"),
	}
});

export const workoutCompletionSeries = pgTable("workout_completion_series", {
	id: text("id").primaryKey().notNull(),
	workoutCompletionId: text("workout_completion_id").notNull(),
	reps: integer("reps").notNull(),
	load: real("load").notNull(),
	exerciseId: text("exercise_id").notNull(),
},
(table) => {
	return {
		workoutCompletionSeriesWorkoutCompletionIdWorkoutComplet: foreignKey({
			columns: [table.workoutCompletionId],
			foreignColumns: [workoutCompletions.id],
			name: "workout_completion_series_workout_completion_id_workout_complet"
		}).onDelete("cascade"),
		workoutCompletionSeriesExerciseIdExercisesIdFk: foreignKey({
			columns: [table.exerciseId],
			foreignColumns: [exercises.id],
			name: "workout_completion_series_exercise_id_exercises_id_fk"
		}).onDelete("cascade"),
	}
});

export const workoutExerciseSeries = pgTable("workout_exercise_series", {
	id: text("id").primaryKey().notNull(),
	workoutExerciseId: text("workout_exercise_id").notNull(),
	reps: integer("reps").notNull(),
	load: real("load").notNull(),
	order: integer("order").notNull(),
},
(table) => {
	return {
		workoutExerciseSeriesWorkoutExerciseIdWorkoutExercisesI: foreignKey({
			columns: [table.workoutExerciseId],
			foreignColumns: [workoutExercises.id],
			name: "workout_exercise_series_workout_exercise_id_workout_exercises_i"
		}).onDelete("cascade"),
	}
});

export const workoutExercises = pgTable("workout_exercises", {
	id: text("id").primaryKey().notNull(),
	workoutId: text("workout_id").notNull(),
	exerciseId: text("exercise_id").notNull(),
	order: integer("order").notNull(),
	rest: integer("rest").notNull(),
	note: text("note"),
},
(table) => {
	return {
		workoutExercisesExerciseIdExercisesIdFk: foreignKey({
			columns: [table.exerciseId],
			foreignColumns: [exercises.id],
			name: "workout_exercises_exercise_id_exercises_id_fk"
		}).onDelete("cascade"),
		workoutExercisesWorkoutIdWorkoutsIdFk: foreignKey({
			columns: [table.workoutId],
			foreignColumns: [workouts.id],
			name: "workout_exercises_workout_id_workouts_id_fk"
		}).onDelete("cascade"),
	}
});

export const exercises = pgTable("exercises", {
	id: text("id").primaryKey().notNull(),
	groupId: text("group_id").notNull(),
	title: text("title").notNull(),
	userId: text("user_id"),
},
(table) => {
	return {
		exercisesGroupIdGroupsIdFk: foreignKey({
			columns: [table.groupId],
			foreignColumns: [groups.id],
			name: "exercises_group_id_groups_id_fk"
		}),
		exercisesUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "exercises_user_id_users_id_fk"
		}),
	}
});

export const workouts = pgTable("workouts", {
	id: text("id").primaryKey().notNull(),
	title: text("title").notNull(),
	userId: text("user_id"),
},
(table) => {
	return {
		workoutsUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "workouts_user_id_users_id_fk"
		}),
	}
});

export const users = pgTable("users", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	email: text("email").notNull(),
	password: text("password").notNull(),
},
(table) => {
	return {
		usersEmailUnique: unique("users_email_unique").on(table.email),
	}
});