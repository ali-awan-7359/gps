// backend/routes/treatmentCenterRoutes.js
const express = require("express");
const router = express.Router();
const TreatmentCenter = require("../models/treatmentCenterModel");

// Get all treatment centers
router.get("/", async (req, res) => {
  try {
    const centers = await TreatmentCenter.find();
    res.json(centers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch treatment centers" });
  }
});

// Get treatment centers by location
router.get("/nearby", async (req, res) => {
  const { lat, lng, radius } = req.query;
  try {
    const centers = await TreatmentCenter.find({
      coordinates: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radius / 3963.2], // radius in miles
        },
      },
    });
    res.json(centers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch nearby treatment centers" });
  }
});

module.exports = router;
