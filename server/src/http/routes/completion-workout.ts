import { db } from '@/db'
import {
  workoutCompletions,
  workoutCompletionSeries,
  workoutExercises,
  workoutExerciseSeries,
  workouts,
} from '@/db/schema'
import { dayjs } from '@/lib/dayjs'
import { and, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { auth } from '../middlewares/auth'

export const completionWorkout: FastifyPluginAsyncZod = async app => {
  app.register(auth).post(
    '/workouts/:id/completion',
    {
      schema: {
        tags: ['Treino'],
        summary: 'Finaliza um treino',
        security: [{ bearerAuth: [] }],
        params: z.object({
          id: z.string(),
        }),
        body: z.object({
          start: z.string(),
          end: z.string(),
          exercises: z.array(
            z.object({
              exerciseId: z.string(),
              isNew: z.boolean(),
              rest: z.coerce.number(),
              series: z.array(
                z.object({
                  serieId: z.string(),
                  load: z.coerce.number(),
                  reps: z.coerce.number(),
                  completed: z.boolean(),
                })
              ),
            })
          ),
        }),
        response: {
          200: z.object({ message: z.string() }),
          401: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const { start, end, exercises } = request.body
      const userId = await request.getCurrentUserId()

      const [workout] = await db
        .select()
        .from(workouts)
        .where(and(eq(workouts.id, id), eq(workouts.userId, userId)))

      if (!workout) {
        return reply.code(401).send({ message: 'Unauthorized' })
      }

      const [workoutCompletion] = await db
        .insert(workoutCompletions)
        .values({
          workoutId: id,
          start: dayjs(start).toDate(),
          end: dayjs(end).toDate(),
        })
        .returning({ id: workoutCompletions.id })

      await Promise.all(
        exercises.map(async (exercise, index) => {
          if (exercise.isNew) {
            await db.insert(workoutExercises).values({
              workoutId: id,
              exerciseId: exercise.exerciseId,
              order: index + 1,
              rest: exercise.rest,
            })
          }
          exercise.series.map(async (serie, index) => {
            const { serieId, load, reps, completed } = serie
            if (completed && load > 0 && reps > 0) {
              if (serieId) {
                await db
                  .update(workoutExerciseSeries)
                  .set({ load, reps })
                  .where(eq(workoutExerciseSeries.id, serieId))
              } else {
                const [workoutExercise] = await db
                  .select({ id: workoutExercises.id })
                  .from(workoutExercises)
                  .where(
                    and(
                      eq(workoutExercises.workoutId, id),
                      eq(workoutExercises.exerciseId, exercise.exerciseId)
                    )
                  )

                await db.insert(workoutExerciseSeries).values({
                  workoutExerciseId: workoutExercise.id,
                  load,
                  reps,
                  order: index + 1,
                })
              }

              await db.insert(workoutCompletionSeries).values({
                workoutCompletionId: workoutCompletion.id,
                exerciseId: exercise.exerciseId,
                load,
                reps,
              })
            }
          })
        })
      )

      return reply
        .status(200)
        .send({ message: 'Treino finalizado com sucesso' })
    }
  )
}
