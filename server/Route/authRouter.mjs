import express from 'express'
import AuthHandler from '../Handler/Authhandler.mjs'


const AuthRouter = express.Router()


AuthRouter.post("/",AuthHandler.adminLogin)

AuthRouter.post("/student_login",AuthHandler.studentLogin)

AuthRouter.post("/student_update_password",AuthHandler.updatePassword)


AuthRouter.post('/student_forget_password',AuthHandler.forgetPassword)


AuthRouter.post("/co_login",AuthHandler.coLogin)

AuthRouter.post("/subadmin",AuthHandler.subAdminLogin)


export default AuthRouter;