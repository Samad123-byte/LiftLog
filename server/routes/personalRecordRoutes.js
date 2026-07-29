import express from "express";

import {
    getMyRecords,
    updatePersonalRecord,
    deleteRecord
} from "../controllers/personalRecordController.js";

import protect from "../middleware/authMiddleware.js";


const router = express.Router();


router.get(
    "/",
    protect,
    getMyRecords
);


router.post(
    "/",
    protect,
    updatePersonalRecord
);


router.delete(
    "/:id",
    protect,
    deleteRecord
);



export default router;