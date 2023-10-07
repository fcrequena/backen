import pool from "../helpers/pg.conn";

export const valTypeProduct = async ( params, action ) => {
    const {codigo = undefined, nombre, descripcion, es_producto, activo} = params;

    if(action === 'create' || action === 'update'){
 
        if(!nombre || !descripcion || !es_producto === undefined || activo === undefined){
            throw new Error('Todos los campos son obligatorios');
        }
        
        if(nombre.length <= 1){
            throw new Error('El campo nombre debe ser mayor a 5 caracteres.');
        }
        
        if(descripcion.length <= 1){
            throw new Error('El campo nombre debe ser mayor a 5 caracteres.');
        }

    }

    if(action === 'create'){

        //validamos si el nombre existe
        const query = `select * from tip_tipo_producto where tip_nombre = '${nombre}'`;

        const result = await pool.query(query);
        if(result.rowCount !== 0){
            throw new Error('El nombre del tipo de producto ya existe.');
        }
    }

    if(action === 'update' || action === 'delete'){
        if(!codigo){
            throw new Error('Todos los campos son obligatorios');
        }
    }
 };


 export const valProduct = async ( params, action ) => {
    const {codigo = undefined, nombre, descripcion, tipo_producto, activo} = params;

    if(action === 'create' || action === 'update'){

        if(!nombre || !descripcion || !tipo_producto || activo === undefined){
            throw new Error('Todos los campos son obligatorios');
        }
        
        if(nombre.length <= 1){
            throw new Error('El campo nombre debe ser mayor a 5 caracteres.');
        }
        
        if(descripcion.length <= 1){
            throw new Error('El campo nombre debe ser mayor a 5 caracteres.');
        }

    }

    if(action === 'create'){

        //validamos si el nombre existe
        const query = `select * from pro_producto where pro_nombre = '${nombre}'`;

        const result = await pool.query(query);
        if(result.rowCount !== 0){
            throw new Error('El nombre del producto ya existe.');
        }
    }

    if(action === 'update' || action === 'delete'){
        if(!codigo){
            throw new Error('Todos los campos son obligatorios');
        }
    }
 }    

 export const valPointSale = async ( params, action ) => {
    const {codigo = undefined, nombre, descripcion, cantidad, activo} = params;

    if(action === 'create' || action === 'update'){

        if(!nombre || !descripcion || !cantidad || activo === undefined){
            throw new Error('Todos los campos son obligatorios');
        }
        
        if(nombre.length <= 1){
            throw new Error('El campo nombre debe ser mayor a 3 caracteres.');
        }
        
        if(descripcion.length <= 1){
            throw new Error('El campo nombre debe ser mayor a 3 caracteres.');
        }

    }

    if(action === 'create'){

        //validamos si el nombre existe
        const query = `select * from puv_punto_venta where puv_nombre = '${nombre}'`;

        const result = await pool.query(query);
        if(result.rowCount !== 0){
            throw new Error('El nombre del Punto de venta ya existe.');
        }
    }

    if(action === 'update' || action === 'delete'){
        if(!codigo){
            throw new Error('Todos los campos son obligatorios');
        }
    }
 }     

 export const valProductPointSale = async ( params, action ) => {
    const {codigo = undefined, producto, punto_venta, precio, activo} = params;

    if(action === 'create' || action === 'update'){

        if(!producto || !punto_venta || !precio || activo === undefined){
            throw new Error('Todos los campos son obligatorios');
        }

        if(precio < 0){
            throw new Error('El precio no puede ser negativo');
        }

    }

    //se maneja por constraint de la base de datos. 
    if(action === 'create'){
        const query = `SELECT * 
                        FROM ppv_producto_punto_venta pppv 
                        WHERE ppv_codpro = ${producto}
                                and ppv_codpuv  = ${punto_venta}`
        const result = await pool.query(query);

        if(result.rowCount !== 0){
            throw new Error('El producto ó servicio ya se encuentra asociado al punto de venta.');
        }

    }
 
    if(action === 'update' || action === 'delete'){
        if(!codigo){
            throw new Error('Todos los campos son obligatorios');
        }
    }
 } 

