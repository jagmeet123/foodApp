const express = require('express');
const bookingModel = require('../model/bookingModels');
const bookingRouter = express.Router();
const { ProtectRoute, isAuthorized, bodyChecker } = require('../Helper/FnUtils');
const { getElement, getElements, createElement, deleteElement, updateElement } = require('../Helper/Factory');

//-----------------functions-------------------

const getBookings = getElements(bookingModel)
const getBooking = getElement(bookingModel)
const updateBooking = updateElement(bookingModel)

//------------------routes--------------------

bookingRouter.use(ProtectRoute)

bookingRouter
    .route("/:id")
    .get(getBooking)
    .patch(updateBooking)
// .delete(deleteBooking)
// ****************************************************
bookingRouter
    .route("/")
    .get(getBookings)


module.exports= bookingRouter;