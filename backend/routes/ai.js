const express = require("express");
const router = express.Router();
const {
  getRecommendations,
  chatAssistant,
  smartSearch,
} = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

router.post("/recommend", protect, getRecommendations);
router.post("/chat", chatAssistant);
router.post("/smart-search", smartSearch);

module.exports = router;
