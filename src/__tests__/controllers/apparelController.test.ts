import request from "supertest";
import server from "../../server";
import { readData, writeData } from "../../utils/dataSource";

const mockData = [{
  code: "ABC123",
  size: "M",
  stockQuantity: 50,
  price: 19.99,
}];

beforeEach(() => {
  writeData(mockData);
});

test("Update Apparel should return success for valid input", async () => {
  const response = await request(server)
    .post("/api/apparel/vendor/update")
    .set("api-key", "vendor-api-key")
    .send({
      code: "ABC123",
      size: "M",
      stockQuantity: 50,
      price: 19.99,
    });

  expect(response.status).toBe(200);
  expect(response.body).toEqual({ success: true });

  // Check if the data is updated
  const data = readData();
  expect(data.length).toBe(1);
  expect(data[0].code).toBe("ABC123");
  expect(data[0].size).toBe("M");
  expect(data[0].stockQuantity).toBe(50);
  expect(data[0].price).toBe(19.99);
});

test("Update multiple Apparel should return success for valid input", async () => {
  writeData([
    {
      code: "ABC123",
      size: "M",
      stockQuantity: 50,
      price: 19.99,
    },
    {
      code: "ABC123",
      size: "S",
      stockQuantity: 10,
      price: 19.99,
    },
  ]);
  const response = await request(server)
    .post("/api/apparel/vendor/update-multiple")
    .set("api-key", "vendor-api-key")
    .send([
      {
        code: "ABC123",
        size: "M",
        stockQuantity: 50,
        price: 19.99,
      },
      {
        code: "ABC123",
        size: "S",
        stockQuantity: 40,
        price: 20.99,
      },
    ]);

  expect(response.status).toBe(200);
  expect(response.body).toEqual({ success: true });

  // Check if the data is updated
  const data = readData();
  expect(data.length).toBe(2);
  expect(data[0].code).toBe("ABC123");
  expect(data[0].size).toBe("M");
  expect(data[0].stockQuantity).toBe(50);
  expect(data[0].price).toBe(19.99);

  expect(data[1].code).toBe("ABC123");
  expect(data[1].size).toBe("S");
  expect(data[1].stockQuantity).toBe(40);
  expect(data[1].price).toBe(20.99);
});

test('Check fulfillment should return success with valid order', async () => {
    const response = await request(server)
      .post('/api/apparel/user/check-fulfillment').set("api-key", "user-api-key")
      .send({
        order: [{ code: 'ABC123', size: 'M', quantity: 2 }],
      });
  
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, fulfillmentStatus: true });
  });
  
  test('Check fulfillment should return error with invalid order', async () => {
    const response = await request(server)
      .post('/api/apparel/user/check-fulfillment').set("api-key", "user-api-key")
      .send({
        order: [{ code: 'InvalidCode', size: 'InvalidSize', quantity: 2 }],
      });
  
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('fulfillmentStatus', false);
  });
  
  test('Get lowest cost should return success with valid order', async () => {
    const response = await request(server)
      .post('/api/apparel/user/get-lowest-cost').set("api-key", "user-api-key")
      .send({
        order: [{ code: 'ABC123', size: 'M', quantity: 2 }],
      });
  
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('lowestCost', 39.98);
  });
  
  test('Get lowest cost should return error with invalid order', async () => {
    const response = await request(server)
      .post('/api/apparel/user/get-lowest-cost').set("api-key", "user-api-key")
      .send({
        order: [{ code: 'InvalidCode', size: 'InvalidSize', quantity: 2 }],
      });
  
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('lowestCost', 0);
  });
// Cleanup
afterAll(() => {
  writeData(mockData);
});
