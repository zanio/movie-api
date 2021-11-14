DROP
DATABASE IF EXISTS  movie_db;
CREATE
DATABASE movie_db;
DROP
USER IF EXISTS movie_user;
CREATE
USER movie_user WITH PASSWORD 'movie_user_123';
GRANT ALL PRIVILEGES ON DATABASE
"movie_db" to gangarage;
