import { Pool } from "pg";

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'app_venta',
    password: '1234',
    port: 5432,
});

pool.connect()
    .then(()=>{
        console.log('Conectado a la base de datos')
    })
    .catch((error) => {
        console.error('Error al conectar a la base de datos'+ error)
    })

export default pool;