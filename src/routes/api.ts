import { Router } from "express";
import * as ApiController from '../controllers/apiController'
import * as adminController from '../controllers/adminController'
import { Auth } from './../middlewares/auth';


const router = Router()

router.get('/ping', ApiController.ping)


// posts

router.get('/games', ApiController.GetAll)
router.get('/gamesMOST', ApiController.GetAllMost)
router.get('/games/:page', ApiController.GetAllPerPage)
router.get('/games/game/:id', ApiController.GetGame)
router.get('/games/category/:category', ApiController.GetPerCategory)
router.get('/games/category/:category/:page', ApiController.GetCategoryPerPage)

router.put('/games/:id', ApiController.updateGenre)
router.put('/games/count/:id', ApiController.click)

// -------

// admin

router.get('/admin/game/:id', adminController.GetGame)
router.get('/getCategory', adminController.getAll)
router.post('/addCategory', adminController.addNewCategory)

router.post('/deleteCategory', adminController.deleteCategory)
router.post('/admin/game', adminController.addNewGame)
router.delete('/admin/game/:id', adminController.deletePost)
router.put('/admin/game/:id', adminController.EditGame)


// login

router.post('/login', ApiController.Login)
router.post('/register', ApiController.Register)
router.post('/request', Auth.private, ApiController.AccountREQUEST)



// login




export default router 