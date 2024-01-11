import fs from 'fs';
import { Apparel } from '../models/apparelModel';

const dataFilePath = 'data.json';
const apiKeyFilePath = 'api-keys.json';

export const readData = (): Apparel[] => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

export const writeData = (data: Apparel[]): void => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
};

export const readApiKeys = (): { [key: string]: string } => {
    try {
      const keys = fs.readFileSync(apiKeyFilePath, 'utf8');
      return JSON.parse(keys);
    } catch (error) {
      return {};
    }
  };
