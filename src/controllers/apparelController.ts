import { Request, Response } from 'express';
import { readData, writeData } from '../utils/dataSource';
import {
  checkFulfillmentSchema,
  getLowestCostSchema,
  updateApparelSchema,
  updateMultipleApparelsSchema,
} from '../schemas/apparel.schema';

/**
 * Updates the stock quantity and price of a single apparel item.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {void}
 */
export const updateApparel = (req: Request, res: Response): void => {
  const { error } = updateApparelSchema.validate(req.body);

  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }

  const { code, size, stockQuantity, price } = req.body;

  const data = readData();
  const index = data.findIndex((a) => a.code === code && a.size === size);

  if (index !== -1) {
    data[index].stockQuantity = stockQuantity;
    data[index].price = price;
    writeData(data);
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: 'Apparel not found' });
  }
};

/**
 * Updates the stock quantity and price of multiple apparel items.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {void}
 */
export const updateMultipleApparels = (req: Request, res: Response): void => {
  const { error } = updateMultipleApparelsSchema.validate(req.body);

  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }

  const updates = req.body;
  const data = readData();

  updates.forEach((update: any) => {
    const { code, size, stockQuantity, price } = update;
    const index = data.findIndex((a) => a.code === code && a.size === size);

    if (index !== -1) {
      data[index].stockQuantity = stockQuantity;
      data[index].price = price;
    }
  });

  writeData(data);
  res.json({ success: true });
};

/**
 * Checks if the given order can be fulfilled based on the available stock.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {void}
 */
export const checkFulfillment = (req: Request, res: Response): void => {
  const { error } = checkFulfillmentSchema.validate(req.body);

  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }

  const { order } = req.body;
  const data = readData();

  const fulfillmentStatus = order.every((item: any) => {
    const apparel = data.find((a) => a.code === item.code && a.size === item.size);
    return apparel && apparel.stockQuantity >= item.quantity;
  });

  res.status(200).json({ success: true, fulfillmentStatus });
};

/**
 * Calculates the lowest cost to fulfill the given order.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {void}
 */
export const getLowestCost = (req: Request, res: Response): void => {
  const { error } = getLowestCostSchema.validate(req.body);

  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }

  const { order } = req.body;
  const data = readData();

  let lowestCost = 0;

  order.forEach((item: any) => {
    const apparel = data.find((a) => a.code === item.code && a.size === item.size);
    if (apparel) {
      // TODO: logic for lowest price
      lowestCost += apparel.price * item.quantity;
    }
  });

  res.json({ success: true, lowestCost });
};
