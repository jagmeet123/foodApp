const express = require('express');
const userModel = require('../model/userModels');
const userRouter = express.Router();
const { ProtectRoute, isAuthorized, bodyChecker } = require('../Helper/FnUtils');
const { getElement, getElements, createElement, deleteElement, updateElement } = require('../Helper/Factory')

//-----------------functions-------------------

const createUser = createElement(userModel)
const getUsers = getElements(userModel)
const getUserById = getElement(userModel)
const updateUser = updateElement(userModel)
const deleteUser = deleteElement(userModel)

//------------------routes--------------------

userRouter.use(ProtectRoute)

userRouter
    .route('/')
    .post(bodyChecker,isAuthorized(["admin"]), createUser)
    .get(ProtectRoute,isAuthorized(["admin", "ce"]),getUsers)

userRouter
    .route('/:id')
    .get(getUserById)
    .patch(bodyChecker,isAuthorized(["admin", "ce"]), updateUser)
    .delete(bodyChecker,isAuthorized(["ce"]), deleteUser)

module.exports = userRouter;