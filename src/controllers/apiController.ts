import {Request, Response} from 'express'
import dotenv from 'dotenv'
import Games from '../models/Games'
import Accounts from '../models/Accounts'
import  JWT  from 'jsonwebtoken';

const bcrypt = require('bcrypt');
dotenv.config()


export const ping = (req: Request, res: Response) => {
    res.json({pong: true})
}
export const GetAll = async (req: Request, res: Response) => {
    try {
        const page = req.query["page"] as unknown as number
        const limit = req.query["limit"] as unknown as number
        const { q } = req.query
        // const { id } = req.params;
        
        let query = {}

        if(q) {
            query = { link: {$regex: q}}
        }

        let games = await Games.find({
            ...query
        }).skip(4 * page).limit(limit)

        let length = await Games.find({
            ...query
        })

        return res.json({games, length})
    } 
    catch (error) {

        console.error(error)
        return res.status(500).json({error: "Internal server error."})
    }
}

export const GetAllPerPage = async (req: Request, res: Response) => {
    
    try {
        const  page = Number(req.params.page)
        const { q } = req.query

        let query = {}

        if(q) {
            query = { link: {$regex: q}}
        }

        let games = await Games.find({
            ...query
        }).skip(4 * page).limit(4)

        let length = await Games.find({
            ...query
        })

        return res.json({games, length})
    } catch (error) {
        console.error(error)
        return res.status(500).json({error: "Internal server error."})
    }
}

export const GetAllMost = async (req: Request, res: Response) => {
    try {
        let games = await Games.find({}).sort({ counts: -1 }).limit(4)
        return res.json({games})
    } 
    catch (error) {
        console.error(error)
        return res.status(500).json({error: "Internal server error."})
    }
}


export const GetPerCategory = async (req: Request, res: Response) => {
    try {
        const { category } = req.params;

        let games = await Games.find({
            genre: category
        }).limit(4)

        let length = await Games.find({
            genre: category
        })

        res.json({games, length})
    } 
    catch (error) {
        console.error(error)
        return res.status(500).json({error: "Internal server error."})
    }
}

export const GetCategoryPerPage = async (req: Request, res: Response) => {
    try {
        const  page = Number(req.params.page)
        const { category } = req.params

        let games = await Games.find({
            genre: category
        }).skip(4 * page).limit(4)

        let length = await Games.find({
            genre: category
        })

        return res.json({games, length})
    } 
    catch (error) {
        console.error(error)
        return res.status(500).json({error: "Internal server error."})
    }
}

export const GetGame = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const games = await Games.findOne({
            link: id
        })

        if(!games) {
            return res.status(404).json()
        }

        return res.json({games})
    } 
    catch (error) {
        console.error(error)
        return res.status(500).json({error: "Internal server error."})
    }
}


export const updateGenre = async (req: Request, res: Response) => {
    try {
        
        const { id } = req.params;
        const { category } = req.body;

        const games = await Games.findOne({
            link: id
        })

        if(!games) {
            return res.status(404).json()
        }

        games.genre.push(category)

        await games.save()

        res.json({games})
    } 
    catch (error) {
        console.error(error)
        return res.status(500).json({error: "Internal server error."})
    }
}


export const click = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { counts } = req.body;

            const hasGame = await Games.findOne(
                {link: id}
            )
            
            if(!hasGame) {
                return res.status(404).json()
            }

            const game = await Games.updateOne(
                {link: id},
                {counts: counts}
            )

            return res.json({game})
        } catch (error) {
            console.error(error)
            return res.status(500).json({error: "Internal server error."})
        }
        
    
    
}














export const AccountREQUEST = async (req: Request, res: Response) => {
    if(req.body.username) {
        let username: string = req.body.username
    
        let user = await Accounts.findOne({
            username: username
        });

        res.json({user})
    }
}
export const Login = async (req: Request, res: Response) => {
    try {
        if(req.body.username && req.body.password) {
            let username: string = req.body.username
            let password: string =  req.body.password
            
    
            const user = await Accounts.findOne({
                username: username,
            })
            
            if(!user) {
                return res.json({status: false, message: 'Usuário não encontrado.'})
            }

            if(user) {
                if(await bcrypt.compare(password, user?.password)) {
                    const token = JWT.sign(
                        {id: user._id, username: user.username},
                        process.env.JWT_SECRET_KEY as string,
                        {expiresIn: '1h'}
                    )
                    res.json({status: true, user, token})
                } else {
                    res.json({status: false})
                }
            }
            
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({error: "Internal server error."})
    }
    
}

export const Register = async (req: Request, res: Response) => {
    try {
        if(req.body.username && req.body.password) {
            let {username, password} = req.body;
            const salt = await bcrypt.genSalt(10)
            const passHASH = await bcrypt.hash(password, 10)
            
            let hasUser = await Accounts.findOne({username: username});
    
            if(hasUser) {
                return res.json({message: 'Usuário já cadastrado', status: false})
            }

            const newUser = new Accounts({
                username: username,
                password: passHASH
            })
            newUser.save()
            return res.status(201)
            .json({id: newUser._id, user: newUser.username, status: true, message: 'Conta criada com sucesso.' });

        } 

    } catch (error) {
        console.error(error)
        return res.status(500).json({error: "Internal server error."})
    }
}






