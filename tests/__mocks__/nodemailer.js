const sendMailMock = jest.fn().mockResolvedValue({
  accepted: ["test@example.com"],
  rejected: [],
  envelopeTime: 10,
  messageTime: 20,
  messageSize: 123,
  response: "250 OK: message queued",
});

const createTransportMock = jest.fn(() => ({
  sendMail: sendMailMock,
  verify: jest.fn().mockResolvedValue(true),
}));

const nodemailerMock = {
  createTransport: createTransportMock,
  getTestMessageUrl: jest.fn(),
};

export default nodemailerMock;

//Named exports
export const createTransport = createTransportMock;
export const __mockSendMail = sendMailMock;
