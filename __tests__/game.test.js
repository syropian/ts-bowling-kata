const Game = require("../src").default;

describe("Bowling Game Kata", () => {
  it("splits the rolls into proper frames", () => {
    const game = new Game();

    game.roll(3);
    game.roll(5);

    expect(game.frames).toEqual([[3, 5], []]);

    game.roll(1);
    game.roll(7);

    expect(game.frames).toEqual([[3, 5], [1, 7], []]);

    game.roll(2);
    game.roll(4);

    expect(game.frames).toEqual([[3, 5], [1, 7], [2, 4], []]);
  });

  describe("Handling strikes and spares", () => {
    it("can determine if a strike was thrown for a given frame", () => {
      const game = new Game();

      game.roll(3);
      game.roll(5);

      game.roll(10);

      expect(game.frameWasStrike(1)).toBe(true);
    });

    it("can determine if a spare was thrown for a given frame", () => {
      const game = new Game();

      game.roll(3);
      game.roll(5);

      game.roll(6);
      game.roll(4);

      expect(game.frameWasSpare(1)).toBe(true);
    });

    it("adds the following 2 throws after a strike to the previous frame", () => {
      const game = new Game();

      game.roll(3);
      game.roll(5);

      game.roll(10);

      game.roll(6);
      game.roll(4);

      expect(game.frames).toEqual([[3, 5], [20, 0], [6, 4], []]);
    });

    it("adds the following 1 throw after a spare to the previous frame", () => {
      const game = new Game();

      game.roll(3);
      game.roll(5);

      game.roll(6);
      game.roll(4);

      game.roll(2);
      game.roll(5);

      expect(game.frames).toEqual([[3, 5], [8, 4], [2, 5], []]);
    });
  });

  it("can get the total score of all frames", () => {
    const game = new Game();

    game.roll(3);
    game.roll(5);

    game.roll(10);

    game.roll(6);
    game.roll(4);

    expect(game.getScore()).toBe(38);
  });

  describe("The last frame", () => {
    it("allows 3 consectutive strikes", () => {
      const game = new Game();

      for (let i = 0; i <= 17; i++) {
        game.roll(4);
      }

      game.roll(10);
      game.roll(10);
      game.roll(10);

      expect(game.frames.slice(-1).pop()).toEqual([10, 10, 10]);
    });

    it("allows an additional 2 strikes if the first throw was a strike", () => {
      const game = new Game();

      for (let i = 0; i <= 17; i++) {
        game.roll(4);
      }

      game.roll(10);
      game.roll(3);
      game.roll(1);

      expect(game.frames.slice(-1).pop()).toEqual([10, 3, 1]);
    });

    it("allows an additional 1 throw 2 throwswere a spare", () => {
      const game = new Game();

      for (let i = 0; i <= 17; i++) {
        game.roll(4);
      }

      game.roll(6);
      game.roll(4);
      game.roll(5);

      expect(game.frames.slice(-1).pop()).toEqual([6, 4, 5]);
    });

    it("does not allow a 3rd throw if you leave an open frame after the first 2 throws", () => {
      const game = new Game();

      for (let i = 0; i <= 17; i++) {
        game.roll(4);
      }

      game.roll(3);
      game.roll(2);
      game.roll(5);

      expect(game.frames.slice(-1).pop()).toEqual([3, 2]);
    });
  });
});
