DROP DATABASE IF EXISTS gymmanagerdb;
CREATE DATABASE gymmanagerdb;

CREATE TABLE "instructors" (
    "id" integer NOT NULL,
    "name" text,
    "avatar_url" text,
    "gender" text,
    "services" text,
    "birth" timestamp without time zone,
    "created_at" timestamp without time zone
);

CREATE TABLE "members" (
    "id" integer NOT NULL,
    "name" text,
    "avatar_url" text,
    "email" text,
    "gender" text,
    "birth" timestamp without time zone,
    "blood" text,
    "weight" integer,
    "height" integer,
    "instructor_id" integer
);
