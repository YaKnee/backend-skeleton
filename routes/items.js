import express from "express";
import {
  deleteItem,
  getAllItems,
  getItemsById,
  postNewItem,
  updateItem,
} from "../controllers/ItemController.js";
import { authenticate } from "../middlewares/authenticateUser.js";
import { validateItem } from "../middlewares/validateItem.js";

export const itemRouter = express.Router();

itemRouter.get("/", authenticate(["admin", "regular"]), getAllItems);
itemRouter.get("/:id", authenticate(["admin", "regular"]), getItemsById);
// Post/Put/Delete require admin privilege
itemRouter.post("/", authenticate(["admin"]), validateItem, postNewItem); // Validate before create
itemRouter.put("/:id", authenticate(["admin"]), validateItem, updateItem); // Validate before update
itemRouter.delete("/:id", authenticate(["admin"]), deleteItem);
