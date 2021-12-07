export const mockBot = {
  sendCard: jest.fn()
};

export const mockWebex = {
  attachmentActions: {
    get: jest.fn().mockReturnValue(undefined)
  }
};

export const mockFramework = {
  start: jest.fn(),
  getBotByRoomId: jest.fn().mockImplementation(() => mockBot),
  getWebexSDK: jest.fn().mockReturnValue(mockWebex),
  on: jest.fn(),
  hears: jest.fn(),
  debug: jest.fn()
};

const mock = jest.fn().mockImplementation(() => mockFramework);

export default mock;
