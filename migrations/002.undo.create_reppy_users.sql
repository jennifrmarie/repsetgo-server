ALTER TABLE reppy_workouts
  DROP COLUMN IF EXISTS user_id;

DROP TABLE IF EXISTS reppy_users;
