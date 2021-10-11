import pg from 'pg'
const PgPool =  pg.Pool;
const pool = new PgPool( {
    user: "postgres",
    password: "1234",
    host: "localhost",
    port: 5433,
    database: "sport"
})

export {pool};
