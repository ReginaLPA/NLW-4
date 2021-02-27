import {Request, Response} from "express";
import { getCustomRepository } from "typeorm";
import { stringify } from "uuid";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class AnswerController{

    //http://localhost:3333/answers/3?u=3cf95f0e-1f4e-48b1-80ac-35af8f6c2dea
    /**
     * Route params => parametros que compõe a rota
     * routes.get("/answers/:id") 
     * 
     * Query Params => Busca, paginação, não obrigatórios
     * chave=valor
     */
    async execute(req:Request, res: Response){
        const {value } = req.params;
        const { u } = req.query;

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const surveyUser = await surveysUsersRepository.findOne({
            id: String(u)
        });

        if(!surveyUser){
            return res.status(400).json({
                error:"Survey User does not exists!"
            })
        }

        surveyUser.value = Number(value);

        await surveysUsersRepository.save(surveyUser);

        return res.json(surveyUser);
    }
}
export { AnswerController }