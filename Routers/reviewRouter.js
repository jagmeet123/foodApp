const express = require('express');
const reviewModel = require('../model/reviewModels');
const reviewRouter = express.Router();
const { ProtectRoute, isAuthorized, bodyChecker } = require('../Helper/FnUtils');
const { getElement, getElements, createElement, deleteElement, updateElement } = require('../Helper/Factory');
const planModel = require('../model/planModels');

//-----------------functions-------------------

const getReviews = getElements(reviewModel)
const getReview = getElement(reviewModel)
const updateReview = updateElement(reviewModel)

//------------------routes--------------------

reviewRouter.use(ProtectRoute)

reviewRouter
    .route('/getUserPlanAlso')
    .get(getUserPlanAlso)

reviewRouter
    .route('/')
    .post(bodyChecker, isAuthorized(["admin"]), createReview)
    .get(ProtectRoute, isAuthorized(["admin", "ce"]), getReviews)

reviewRouter
    .route('/:id')
    .get(getReview)
    .patch(bodyChecker, isAuthorized(["admin", "ce"]), updateReview)
    .delete(bodyChecker, isAuthorized(["ce"]), deleteReview)

async function createReview(req, res) {
    try {
        let review = await reviewModel.create(req.body);

        let planId = review.plan;
        let plan = await planModel.findById(planId);
        plan.reviews.push(review["_id"]); // ref we need to pass review id

        if (plan.averageRating) {
            let sum = plan.averageRating * plan.reviews.length;
            let finalRating = (sum + review.rating) / (plan.reviews.length + 1);
            plan.averageRating = finalRating;
        } else {
            plan.averageRating = review.rating;
        }
        await plan.save();
        res.status(200).json({
            message:"review created",
            review
        })

    } catch (err) {
        res.json({
            message: err.message
        })
    }
}

async function deleteReview(req, res) {
    try {
        let review = await reviewModel.findByIdAndDelete(req.body.id);

        let planId = review.plan;
        let plan =  await planModel.findById(planId);
        let indexOfReview = plan.reviews.indexOf(review["_id"]);
        plan.reviews.splice(indexOfReview,1);
        await plan.save();
        res.status(200).json({
            message:"review deleted",
            review
        })
        
    } catch (err) {
        res.json({
            message: err.message
        })
    }
}

async function getUserPlanAlso(req, res) {
    console.log('getUserPlanAlso')
    try {
        let reviews = await reviewModel.find().populate({
            path: "user plan",
            select: "name price discount"
        })
        res.status(200).json({
            reviews
        })
    } catch (err) {
        res.json({
            message: err.message
        })
    }
}

module.exports = reviewRouter;