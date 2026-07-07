const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
    getAddresses,
    getAddressByType,
    saveAddress,
    deleteAddress
} = require("../controller/addressController");

router.get("/", auth, getAddresses);             // get both addresses
router.get("/:type", auth, getAddressByType);    // get by type: /addresses/shipping or /addresses/billing
router.post("/", auth, saveAddress);             // create or update
router.delete("/:type", auth, deleteAddress);    // delete by type

module.exports = router;