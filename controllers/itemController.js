import { Item } from "../models/itemModel.js";


// Function to retrieve all tasks from the database
// NB!: Edit queries to match item model!!!
export const getAllItems = async (req, res) => {
  try {
    const numOfItems = await Item.find();
    if (numOfItems.length === 0) {
      return res.status(404).send({ error: "No items in database yet." });
    }

    const validQueries = ["name", "brand", "completed", "priority"];
    let filter = {};

    // Check for invalid query parameters
    const queryKeys = Object.keys(req.query);
    const invalidQueries = queryKeys.filter(
      (key) => !validQueries.includes(key)
    );
    if (invalidQueries.length > 0) {
      return res.status(400).send({
        message: "Invalid query parameter(s) used.",
        invalidQueries: invalidQueries,
        validQueries: validQueries,
      });
    }

    // Query cases
    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: "i" }; // Case-insensitive regex
    }

    if (req.query.dueDate) { // Format is YYYY-MM-DD
      const date = new Date(req.query.dueDate);
      if (!isNaN(date)) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        filter.dueDate = { $gte: startOfDay, $lte: endOfDay }; // Match entire day
      } else {
        return res.status(400).send({
          error: "Invalid date format for dueDate.",
          correctFormat: "YYYY-MM-DD"
        });
      }
    }

    if (req.query.completed) {
      // Ensure boolean conversion for "true" and "false" strings
      if (req.query.completed.toLowerCase() === "true") {
        filter.completionStatus = true;
      } else if (req.query.completed.toLowerCase() === "false") {
        filter.completionStatus = false;
      } else {
        return res.status(400).send({
          error: "Invalid value for 'completed'.",
          validValues: [true, false] });
      }
    }

    if (req.query.priority) {
      filter.priority = { $regex: req.query.priority, $options: "i" }; // Case-insensitive regex
    }

    const items = await Item.find(filter);
    if (items.length === 0) {
      return res.status(404).send({
        message: "No items found for given query.",
        query: req.query,
      });
    }

    return res.status(200).send(items);
  } catch (err) {
    console.error(err); // Log error for debugging
    return res.status(500).send({ error: "Error retrieving items." });
  }
};


// Function to get a item by ID
export const getItemsById = async (req, res) => {
  try {
    const item = await Item.findOne({ id: req.params.id });
    if (!item) {
      return res.status(404).send({ error: "Item not found." });
    }
    return res.status(200).send(item);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Error retrieving item." });
  }
};

// Function to post a new item to databse
export const postNewItem = async (req, res) => { // Already validated
  try {
    const lastItem = await Item.findOne().sort({ id: -1}).limit(1);
    const newId = lastItem ? lastItem.id + 1 : 1;

    const newItem = new Item({ ...req.body, id: newId });

    await newItem.save();
    return res.status(201).send({
      message: "Item Added Successfully.",
      new_task: newItem
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Error adding new item." });
  }
}


// Function to update a item by ID
export const updateItem = async (req, res) => { // Already validated
  try {
    const updatedItemInfo = req.body;

    const newItemInfo = await Item.findOneAndUpdate(
      { id: req.params.id },
      updatedItemInfo,
      { new: true },
    );

    if(!newItemInfo) {
      return res.status(404).send({ error: "Update cancelled as item ID not found." });
    }

    return res.status(200).send({
      message: "Item updated successfully.",
      new_details: newItemInfo,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Error updating item." });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const deletedItem = await Item.findOneAndDelete({ id: req.params.id });
    if(!deletedItem) {
      return res.status(404).send({ error: "Deletion cancelled as item ID not found." });
    }
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Error deleting item." });
  }
}