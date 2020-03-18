CREATE TABLE reppy_workouts (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    reps INTEGER,
    sets INTEGER,
    weight INTEGER,
    date TIMESTAMP DEFAULT now() NOT NULL
);
