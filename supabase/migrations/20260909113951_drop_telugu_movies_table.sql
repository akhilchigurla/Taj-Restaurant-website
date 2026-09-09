/*
# Remove telugu_movies table

The Telugu movie recommendation feature has been removed from the website.
This migration drops the now-unused `telugu_movies` table and its policies.

1. Dropped Tables
- `telugu_movies` — no longer referenced by any page or component
*/

DROP TABLE IF EXISTS telugu_movies;
