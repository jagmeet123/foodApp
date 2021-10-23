const express = require('express');
const planModel = require('../model/planModels');
const planRouter = express.Router();
const { ProtectRoute, isAuthorized, bodyChecker } = require('../Helper/FnUtils');
const { getElement, getElements, createElement, deleteElement, updateElement } = require('../Helper/Factory')

//-----------------functions-------------------
const createPlan = createElement(planModel)
const getPlans = getElements(planModel)
const getPlan = getElement(planModel)
const updatePlan = updateElement(planModel)
const deletePlan = deleteElement(planModel)

//------------------routes--------------------
planRouter.use(ProtectRoute)

planRouter
    .route('/')
    .post(bodyChecker,isAuthorized(["admin"]), createPlan)
    .get(ProtectRoute,isAuthorized(["admin", "ce"]),getPlans)

planRouter
    .route('/:id')
    .get(getPlan)
    .patch(bodyChecker,isAuthorized(["admin", "ce"]), updatePlan)
    .delete(bodyChecker,isAuthorized(["ce"]), deletePlan)

planRouter
    .route('/sortByRating')
    .get(getBestPlan)    

async function getBestPlan(req,res){
    try{
        let plans = await planModel.find().sort("-averageRating").populate({
            path:"reviews",
            select:"review rating"
        })
        res.status(200).json({
            message:"Best Plans",
            plans
        })
    }catch(err){
        res.json({
            message: err.message
        })
    }
}

module.exports = planRouter;