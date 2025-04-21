import Joi from "joi";

// Example of item schema
const itemValidationSchema = Joi.object({
    name: Joi.string().min(3).required(), // Name must be at least 3 characters long
    dueDate: Joi.date().greater(new Date()).optional(), // Optional dueDate, can be a future date
    completed: Joi.boolean().default(false), // Completed is optional and defaults to false
    priority: Joi.string().valid("None", "Low", "Medium", "High").default("Low") // Priority must be one of the allowed values
}).min(1);

export const validateItem = (req, res, next) => {
    const { error } = itemValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map((detail) => detail.message);
        return res.status(400).send({ errors: errorMessage });
    }
    next();
};