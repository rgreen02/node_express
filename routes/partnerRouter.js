const express = require("express");
const bodyParser = require("body-parser");
const Partner = require("../models/partner");
const authenticate = require("../authenticate");
const cors = require("./cors");

const partnerRouter = express.Router();
partnerRouter.use(bodyParser.json());

partnerRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Partner.find()
      .then((partners) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partners);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Partner.create(req.body)
      .then((partner) => {
        if (
          req.user._id.equals(
            campsite.comments.id(req.params.commentId).author._id,
          )
        ) {
          console.log("Partner Created: ", partner);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(partner);
        }
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /partners");
  })
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Partner.deleteMany()
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((err) => next(err));
    },
  );

partnerRouter
  .route("/:partnerId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Partner.findById(req.params.partnerId)
      .then((partner) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partner);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /partners/${req.params.partnerId}`,
    );
  })
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Partner.findById(req.params.partnerId)
        .then((partner) => {
          if (partner) {
            if (req.body.description) {
              partner.description = req.body.description;
            }
            partner
              .save()
              .then((partner) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(partner);
              })
              .catch((err) => next(err));
          } else if (!partner) {
            err = new Error(`Partner ${req.params.partnerId} not found`);
            err.status = 404;
            return next(err);
          } else {
            err = new Error(`Comment ${req.params.partnerId} not found`);
            err.status = 404;
            return next(err);
          }
        })
        .catch((err) => next(err));
    },
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Partner.findByIdAndDelete(req.params.partnerId)
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((err) => next(err));
    },
  );

module.exports = partnerRouter;
