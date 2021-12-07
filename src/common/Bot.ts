export type Bot = {
  sendCard: (card, ...args) => void;
  say: (...args) => void;
  room: {
    id: string;
  };
};
