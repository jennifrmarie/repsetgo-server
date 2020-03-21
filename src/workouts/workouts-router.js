const express = require('express')
const WorkoutsService = require('./workouts-service')
const { requireAuth } = require('../middleware/jwt-auth')
const jsonBodyParser = express.json()
const path = require('path')

const workoutsRouter = express.Router()

workoutsRouter
  .route('/')
  .get((req, res, next) => {
    WorkoutsService.getAllWorkouts(req.app.get('db'))
      .then(workouts => {
        res.json(workouts.map(WorkoutsService.serializeWorkout))
      })
      .catch(next)
  })

  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { name, sets=false, reps=false, weight=false, date } = req.body
    const newWorkout = { name, sets, reps, weight, date }

    for (const field of ['name'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body.`
        })

    const nameError = WorkoutsService.validateName(name)

    if (nameError)
      return res.status(400).json({ error: nameError })

    newWorkout.user_id = req.user.id

    WorkoutsService.insertWorkout(
      req.app.get('db'),
      newWorkout
    )
      .then(workout => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${workout.id}`))
          .json(WorkoutsService.serializeWorkout(workout))
      })
      .catch(next)
  })


workoutsRouter
  .route('/:item_id')
  .all(requireAuth)
  .get((req, res) => {
    res.json(WorkoutsService.serializeWorkout(res.workout))
  })
  .put(requireAuth, jsonBodyParser, (req, res, next) => {
    const { name, sets=false, reps=false, weight=false, date } = req.body
    const newWorkout = { name, sets, reps, weight, date }
    newWorkout.user_id = req.user.id

    WorkoutsService.updateWorkout(
      req.app.get('db'),
      req.params.item_id,
      newWorkout
    )
      .then(workout => {
        res
          .status(202)
          .location(path.posix.join(req.originalUrl, `/${workout.id}`))
          .json(WorkoutsService.serializeWorkout(workout))
      })
      .catch(next)
  })
  .get((req, res) => {
    res.json(WorkoutsService.serializeWorkout(res.workout))
  })
  .delete(requireAuth, jsonBodyParser, (req, res, next) => {
    WorkoutsService.deleteWorkout(
      req.app.get('db'),
      req.params.item_id,
    )
      .then(workout => {
        res
          .status(200)
          .location(path.posix.join(req.originalUrl, `/${workout.id}`))
          .json(WorkoutsService.serializeWorkout(workout)).end()
      })
      .catch(next)
  })





module.exports = workoutsRouter
