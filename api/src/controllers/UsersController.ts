import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepositories";
import * as yup from "yup"

class UserController{
    async create(req:Request,res:Response){
        const {name, email} = req.body;

        const schema = yup.object().shape({
            name:yup.string().required("Nome Obrigatório"),
            email: yup.string().email().required(),
        });
        // formas de validação
        
        //if(!(await schema.isValid(req.body)){
           // return res.status(400).json({error:"validation Failed!"})
       // }
       // 

       try{
        await schema.validate(req.body, {abortEarly:false})
       }catch(err){
        return res.status(400).json({error:err})

       }
        
        const usersRepository = getCustomRepository(UsersRepository)

        const userAlreadyExists = await usersRepository.findOne({
            email
        });
        if(userAlreadyExists){
            return res.status(400).json({
                error: "User alresdy exists",
            });

        }


        const user = usersRepository.create({
            name,email
        })
        await usersRepository.save(user)

        return res.status(201).json(user);

    }
    async show(req:Request, res:Response){
        const usersRepository = getCustomRepository(UsersRepository)

        const all = await usersRepository.find()
        
        return res.json(all);
    }

}
export { UserController };
