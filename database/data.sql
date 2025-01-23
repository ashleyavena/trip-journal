-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

--  insert into "todos"
--    ("task", "isCompleted")
--    values
--      ('Learn to code', false),
--      ('Build projects', false),
--      ('Get a job', false);


-- INSERT INTO "Users" ("username", "hashedPassword")
-- VALUES ('ashley', 'hashedPassword123');


insert into "Trips" ("userId", "title","description", "startDate")
values
(1, 'Japan trip', 'went to Tokyo and Kyoto for winter break', '2025-01-01');
