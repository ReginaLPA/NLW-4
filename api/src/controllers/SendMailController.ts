import {Request,Response} from "express"
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurverysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepositories";
import SendMailServices from "../services/SendMailServices";
import {resolve} from "path";
import { AppError } from "../errors/AppError";

class SendMailController{
    async execute(req:Request,res:Response){
        const {email, survey_id} = req.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const user = await usersRepository.findOne({email});
        
        if(!user){
            throw new AppError("User does not exists")
           
        }
        
        const survey = await surveysRepository.findOne({id:survey_id});

        if(!survey){
            throw new AppError("Survey does not exists!")
        }

       
  
        const npsPath = resolve(__dirname, "..","views","emails", "npsMails.hbs");

        const surveyUserAllreadyExists = await surveysUsersRepository.findOne({
            where: { user_id: user.id, value: null },
            relations:["user", "survey"],
        });

        const variables = {
            name:user.name,
            title:survey.title,
            description: survey.description,
            id: "",
            Link:process.env.URL_MAIL,

        }

        if(surveyUserAllreadyExists){
            variables.id = surveyUserAllreadyExists.id;
            await SendMailServices.execute(email,survey.title, variables, npsPath)
            return res.json(surveyUserAllreadyExists);
        }

        //salvar as informações na table 
        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id
    });
    
        await surveysUsersRepository.save(surveyUser)
        
        //Enviar e-mail para o usuário
        variables.id = surveyUser.id;
        await SendMailServices.execute(email, survey.title, variables, npsPath);

        return res.json(surveyUser)
    }
}
export { SendMailController}