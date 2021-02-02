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

ALTER TABLE instructors ADD COLUMN updated_at timestamp DEFAULT (now())
ALTER TABLE members ADD COLUMN updated_at timestamp DEFAULT (now())

CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON instructors
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON members
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();