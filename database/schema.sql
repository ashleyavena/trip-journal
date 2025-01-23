set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "Users" (
  "userId" serial PRIMARY KEY,
  "username" text NOT NULL,
  "hashedPassword" text NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "Trips" (
  "tripId" serial PRIMARY KEY,
  "userId" integer NOT NULL,
  "title" text NOT NULL,
  "description" text,
  "startDate" date NOT NULL,
  "endDate" date
);

--  not null means mandatory

CREATE TABLE "Photos" (
  "photoId" serial PRIMARY KEY,
  "tripId" integer NOT NULL,
  "photoUrl" text NOT NULL,
  "uploadedAt" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "Locations" (
  "locationId" serial PRIMARY KEY,
  "tripId" integer NOT NULL,
  "name" text NOT NULL,
  "latitude" text NOT NULL,
  "longitude" text NOT NULL
);

COMMENT ON COLUMN "Trips"."description" IS 'Content of the post';

ALTER TABLE "Trips" ADD FOREIGN KEY ("userId") REFERENCES "Users" ("userId");

ALTER TABLE "Photos" ADD FOREIGN KEY ("tripId") REFERENCES "Trips" ("tripId");

ALTER TABLE "Locations" ADD FOREIGN KEY ("tripId") REFERENCES "Trips" ("tripId");
