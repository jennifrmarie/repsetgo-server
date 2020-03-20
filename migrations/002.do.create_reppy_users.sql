CREATE TABLE reppy_users (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_name TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  date TIMESTAMP DEFAULT now() NOT NULL
);

ALTER TABLE reppy_workouts
  ADD COLUMN
    user_id INTEGER REFERENCES reppy_users(id)
    ON DELETE SET NULL;
