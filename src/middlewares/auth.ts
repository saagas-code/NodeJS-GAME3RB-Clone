import {Request, Response, NextFunction} from 'express'
import dotenv from 'dotenv'
import JWT from 'jsonwebtoken'

dotenv.config()

export const Auth = {
    private: async (req: Request, res: Response, next: NextFunction) => {
        let sucess = false;

        if(req.headers.authorization) {
    
            const [authType, token] = req.headers.authorization.split(' ')
            if(authType === 'Bearer') {
                try {
                    const decoded = JWT.verify(
                        token,
                        process.env.JWT_SECRET_KEY as string
                    );
                    console.log('DECODED', decoded)
                    sucess = true
                } catch(err) {
                    
                }
            }
        }

        if(sucess) {
            next();
        } else {
            res.status(403); // Not Authorized
            res.json({error: 'Não autorizado'})
        }
    }
}