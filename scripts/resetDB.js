// Library imports
import mongoose from "mongoose";
import dotenv from "dotenv";

// Custom functions, models, etc. imports
import { connectToDatabase } from "../config/db.js";
import { Item } from "../models/itemModel.js";

dotenv.config();

await connectToDatabase();

const items = [
  // Create dummy items in same format as defined in itemModel
  {name: "change schema", dueDate: new Date(), priority: "HIGH"} // Example
];

const resetDatabase = async () => {
  try {
    console.log("\nClearing database...\n");
    await Item.deleteMany({}); // Clear the database before populating
    console.log("Database cleared!\n");
    console.log("Populating database...\n");

    for (const item of items) {
      // Check for empty name
      if (!item.name || item.name.trim() === "") {
        console.error("Error: Item name is missing or empty. Skipping this item.");
        continue;
      }

      // Get the last item to determine the next available ID
      const lastItem = await Item.findOne().sort({ id: -1 }).limit(1);
      const newId = lastItem ? lastItem.id + 1 : 1;

      // Create a new item with the auto-generated ID
      const newItem = new Item({ ...item, id: newId });
      await newItem.save(); // Save it to the database
      console.log(`Added item: ${item.name}`);
    }

    console.log("\nDatabase populated successfully!");
    console.log("\nClosing connection to MongoDB...");
    mongoose.connection.close(); // Close the connection when done
    console.log("Connection closed.\n");
  } catch (err) {
    console.error("Error populating database:", err.message);
  }
};

resetDatabase();
