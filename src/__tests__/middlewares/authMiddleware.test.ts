import { Request } from "express";
import { authorize } from "../../middlewares/authMiddleware";
import { readApiKeys } from "../../utils/dataSource";

test("Authorize middleware should allow user access with user API key", () => {
    const mockRequest: any = {
        headers: {
          'api-key': 'user-api-key',
        },
      };
  const mockResponse: any = {
    status: jest.fn(() => mockResponse),
    json: jest.fn(),
  };

  const mockNext = jest.fn();

  const apiKeys = readApiKeys();
  apiKeys["user-api-key"] = "user";

  authorize("user")(mockRequest as Request, mockResponse as any, mockNext);

  expect(mockNext).toHaveBeenCalled();
});

test("Authorize middleware should not allow user access with vendor API key", () => {
    const mockRequest: any = {
        headers: {
          'api-key': 'vendor-api-key',
        },
      };
  const mockResponse: any = {
    status: jest.fn(() => mockResponse),
    json: jest.fn(),
  };

  const mockNext = jest.fn();

  const apiKeys = readApiKeys();
  apiKeys["user-api-key"] = "user";

  authorize("user")(mockRequest as Request, mockResponse as any, mockNext);

  expect(mockNext).not.toHaveBeenCalled();
});
