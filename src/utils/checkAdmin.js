const checkAdmin = (admin)=>{
    return ((req,res,next)=>{
        if (admin === true){
            next();
        } else{
            res.json({error: -1, descripcion: `Ruta '${req.route.path}' Método '${req.route.stack[0].method}' - No Autorizada`})
        }
    })
}

export default checkAdmin;