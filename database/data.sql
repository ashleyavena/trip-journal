-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

--  insert into "todos"
--    ("task", "isCompleted")
--    values
--      ('Learn to code', false),
--      ('Build projects', false),
--      ('Get a job', false);


INSERT INTO "Users" ("username", "hashedPassword")
VALUES ('ashleyavena', '$argon2id$v=19$m=65536,t=3,p=4$9w90dXuMrNiZj1MKloRwiQ$TZBidljOtQjThmhWXC2/N4wqJj2smWEmu6S7pVnKbLw');


INSERT INTO "Trips" ("tripId", "userId", "title", "description", "startDate", "endDate", "coverPhoto")
VALUES
  (1, 1, 'TOKYO', 'What a great trip it was to the Land of the Rising Sun during winter break!', '2025-01-01', '2025-01-14', '/images/IMG_4921-1738912071650.jpeg');


INSERT INTO "Locations" ("tripId", "name", "latitude", "longitude")
VALUES
  (1,1, 'Tokyo', 35.6762, 139.6503);


INSERT INTO "Photos" ("tripId", "photoUrl")
VALUES
  (51, 14, '/images/IMG_4921-1738912071650.jpeg', 2025-02-07T07:07:52.310695Z),
  (42, 13, '/images/IMG_4216-1738911870553.jpeg',
2025-02-07T07:04:31.778408Z),
   (50,14, '/images/DSC08884-1738912071412.jpeg', 2025-02-07T07:07:52.301524Z);
