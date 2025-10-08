import { ValidationError } from 'sequelize';

export const errorHandler = (err, req, res, next) => {
    if(process.env.NODE_ENV !== 'test'){
        console.error(`[ERROR] ${err}`);
    }
    

    // If error has statusCode (HttpError)
    if(err.statusCode){
        return res.status(err.statusCode).json({ error: err.message });
    }

    // If its a Sequelize validation error
    if(err instanceof ValidationError){
        return res.status(400)
                .json({
                    error: 'Validation error',
                    details: err.errors.map( e => e.message )
                });
    }

    // Unexpected error
    res.status(500)
    .json({ 
        error: 'Internal Server Error',
        message: err.message
    });
};

export default errorHandler;