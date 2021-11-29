export type Bot = {
  sendCard: (card) => void;
  say: (...args) => void;
  room: {
    id: string;
  };
};
