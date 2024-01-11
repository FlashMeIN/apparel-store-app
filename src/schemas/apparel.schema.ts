import Joi from "joi";

export const updateApparelSchema = Joi.object({
  code: Joi.string().required(),
  size: Joi.string().required(),
  stockQuantity: Joi.number().integer().min(0).required(),
  price: Joi.number().min(0).required(),
  requiredQuantity: Joi.number().integer().min(0),
});

// schema for validating multiple apparel update requests
export const updateMultipleApparelsSchema =
  Joi.array().items(updateApparelSchema);

// Joi schema for validating order fulfillment requests
export const checkFulfillmentSchema = Joi.object({
  order: Joi.array().items(
    Joi.object({
      code: Joi.string().required(),
      size: Joi.string().required(),
      quantity: Joi.number().integer().min(0).required(),
    })
  ),
});

//schema for validating order cost calculation requests
export const getLowestCostSchema = Joi.object({
  order: Joi.array().items(
    Joi.object({
      code: Joi.string().required(),
      size: Joi.string().required(),
      quantity: Joi.number().integer().min(0).required(),
    })
  ),
});
