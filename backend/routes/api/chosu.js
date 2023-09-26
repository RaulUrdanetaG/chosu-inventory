const router = require("express").Router();

const Tag = require("../../models/tag.model");
const Item = require("../../models/item.model");
const { checkToken } = require("../../middlewares/middleware");
require("dotenv").config();

router.get("/items", checkToken, async (req, res) => {
  try {
    const items = await Item.find();

    res.json(items);
  } catch (error) {
    res.json({ error: error.message });
  }
});

router.get("/tags", checkToken, async (req, res) => {
  try {
    const tags = await Tag.find();

    res.json(tags);
  } catch (error) {
    res.json({ error: error.message });
  }
});

router.get("/:itemId", async (req, res) => {
  const { itemId } = req.params;
  try {
    const items = await Item.findById(itemId);

    res.json(items);
  } catch (error) {
    res.json({ error: error.message });
  }
});

// router.get('/tags')

router.post("/addItem", checkToken, async (req, res) => {
  try {
    const newItem = await Item.create(req.body);
    res.json(newItem);
  } catch (error) {
    res.json({ error: error });
  }
});

module.exports = router;
