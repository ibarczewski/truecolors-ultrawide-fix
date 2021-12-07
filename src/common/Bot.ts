export type Bot = {
  dmCard: (userId: string, card) => void;
  sendCard: (card, ...args) => void;
  say: (...args) => void;
  room: {
    id: string;
  };
};
