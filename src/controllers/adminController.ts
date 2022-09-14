import {Request, Response} from 'express'
import dotenv from 'dotenv'
import Categories from '../models/Categories'
import Games from '../models/Games'

dotenv.config()



export const ping = (req: Request, res: Response) => {
    res.json({pong: true})
}

export const getAll = async (req: Request, res: Response) => 
    {
    let list = await Categories.find({})
    return res.json({list})
    
}
export const GetGame = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const games = await Games.findOne({
            link: {$regex: `${id}`}
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



export const addNewGame = async (req: Request, res: Response) => {
    try {
        if(req.body.title && req.body.img) {
            let {title, img, name, size, developer, publisher, release, screen1, screen2, trailer, about,
            torrent, direct, post, link, genre, count} = req.body
            
            const hasPost = await Games.findOne({
                link: link,
            })
    
            if(hasPost) {
                return res.json({message: 'Post já cadastrado.', status: false})
            }
    
            const newField = new Games({
                title: title,
                img: img,
                details: {
                    name: name,
                    size: size,
                    developer: developer,
                    publisher: publisher,
                    release: release,
                },
                screenshot: [
                    screen1,
                    screen2
                ],
                trailer: trailer,
                about: about,
                downloads: {
                    torrent: torrent,
                    direct: direct
                },
                post: post,
                link: link,
                counts: count
            })
            newField.genre.push(genre)
            
            newField.save()
            return res.status(201).json({newField, status: true})
        } 
    } catch (error) {
        console.error(error)
        return res.status(500).json({error: "Internal server error."})
    }
    
}

export const deletePost = async (req: Request, res: Response) =>  {
    try {
        
        let { id } = req.params
    
        let json = await Games.findOneAndDelete({
            link: {$regex: `${id}`}
        })
    
        if(json) {
            return res.json({status: true})
        } else {
            return res.json({status: false})
        }
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({error: "Internal server error."})
    }
 }

export const addNewCategory = async (req: Request, res: Response) => {
    if(req.body.category) {
        let neww: string = req.body.category

        const newField = new Categories({
            category : neww.toLocaleLowerCase()
        })
        
        newField.save()
        return res.json({newField})
    }
    
    
}

export const deleteCategory = async (req: Request, res: Response) => {
    if(req.body.category) {
        let neww: string = req.body.category

        let json = await Categories.findOneAndDelete({
            category: {$regex: `${neww}`.toLowerCase()}
        })

        return res.json({'Deletado com sucesso.': json})
    }
    
}

export const EditGame = async (req: Request, res: Response) => {
    
        let {title, img, size, developer, publisher, release, screen1, screen2, trailer, about,
        torrent, direct, post, link, genre, count} = req.body
        
        let { id } = req.params

        const updateField = await Games.findOneAndUpdate({
            link: {$regex: `${id}`}, 
        },
        {  
            title: title,
            img: img,
            details: {
                size: size,
                developer: developer,
                publisher: publisher,
                release: release,
            },
            screenshot: [
                screen1,
                screen2
            ],
            trailer: trailer,
            about: about,
            downloads: {
                torrent: torrent,
                direct: direct
            },
            post: post,
            counts: count,
            $push: {genre: genre},
            link: link,
        })
                
        if(updateField) {
            res.json({status: true})
        } else {
            res.json({status: false})
        }
   
    
}

