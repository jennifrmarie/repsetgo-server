const xss = require('xss')

const WorkoutsService = {
  getAllWorkouts(db) {
    return db
      .from('reppy_workouts AS item')
      .select(
        'item.id',
        'item.name',
        'item.sets',
        'item.reps',
        'item.weight',
        'item.date',
      )
  },

  insertWorkout(db, newWorkout) {
    return db
      .insert(newWorkout)
      .into('reppy_workouts')
      .returning('*')
      .then(([workout]) => workout)
      .then(workout =>
        WorkoutsService.getById(db, workout.id)
      )
  },

  validateName(name) {
    if (name.length === 0) {
      return 'name is required'
    }
  },



  updateWorkout(db, id, workout) {
    console.log(id)
    console.log(workout)
    sql = db("reppy_workouts")
      .where({id:id})
      .update(workout)

    console.log(sql.toString())
      return sql;
  },

  deleteWorkout(db, id, workout) {
    sql = db("reppy_workouts")
      .where({ id:id })
      .delete(workout)
      return sql;
  },

  getById(db, id) {
    return WorkoutsService.getAllWorkouts(db)
      .where('item.id', id)
      .first()
  },

  serializeWorkout(workouts) {
    const { item } = workouts
    return {
      id: workouts.id,
      sets: workouts.sets,
      reps: workouts.reps,
      weight: workouts.weight,
      name: xss(workouts.name),
      date: new Date(workouts.date),
    }
  },

}

module.exports = WorkoutsService
