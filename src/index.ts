type Frame = [number?, number?, number?];

export default class Game {
  public currentFrameIndex: number = 0;
  public frames: Array<Frame> = [[]];

  roll(points: number) {
    const currentFrame = this.getCurrentFrame();
    const onLastFrame: boolean = this.currentFrameIndex === 9;
    const throwWasStrike: boolean = this.rollWasStrike(points);
    const throwWasSpare: boolean = this.rollWasSpare(points);

    if (throwWasStrike) {
      if (!onLastFrame) {
        currentFrame.push(10, 0);
        this.nextFrame();
      } else {
        if (currentFrame.length < 3) {
          currentFrame.push(10);
        }
      }
    } else {
      if (!onLastFrame) {
        if (currentFrame.length < 2) {
          currentFrame.push(points);
          if (currentFrame.length === 2) {
            this.nextFrame();
          }
        }
      } else {
        if (throwWasSpare) {
          if (currentFrame.length < 2) {
            currentFrame.push(points);
          }
        } else {
          const currentFrameScore: number = currentFrame.reduce(
            (acc, curr) => acc + curr,
            0
          );
          if (currentFrame.length <= 1 || currentFrameScore >= 10) {
            currentFrame.push(points);
          }
        }
      }
    }
  }

  public rollWasStrike(points: number): boolean {
    const currentFrameRolls: number = this.getCurrentFrame().length;
    if (this.currentFrameIndex < 9) {
      return this.getCurrentFrame().length === 0 && points === 10;
    } else {
      return (
        points === 10 &&
        (currentFrameRolls === 0 ||
          this.getCurrentFrame()[currentFrameRolls - 1] === 10)
      );
    }
  }

  public rollWasSpare(points: number): boolean {
    const currentFrame = this.getCurrentFrame();

    if (currentFrame.length !== 1) {
      return false;
    }

    return points + currentFrame[currentFrame.length - 1] === 10;
  }

  private nextFrame() {
    this.scorePotentialStrikeOrSpare();
    this.currentFrameIndex++;
    if (this.currentFrameIndex < 10) {
      this.frames.push([]);
    }
  }

  private getCurrentFrame(): Frame {
    return this.frames[this.currentFrameIndex];
  }

  public frameWasStrike(frameIndex: number): boolean {
    return this.frames[frameIndex][0] >= 10 && this.frames[frameIndex][1] === 0;
  }

  private frameWasSpare(frameIndex: number): boolean {
    return (
      !this.frameWasStrike(frameIndex) &&
      this.frames[frameIndex].length === 2 &&
      this.frames[frameIndex][0] + this.frames[frameIndex][1] >= 10
    );
  }

  private scorePotentialStrikeOrSpare() {
    const previousFrameIndex: number = this.currentFrameIndex - 1;
    const previousFrame: Frame = this.frames[previousFrameIndex];
    const currentFrameIndex: Frame = this.frames[this.currentFrameIndex];

    if (this.currentFrameIndex > 0) {
      if (this.frameWasStrike(previousFrameIndex)) {
        previousFrame[0] += currentFrameIndex.reduce(
          (acc, curr): number => acc + curr
        );
      } else if (this.frameWasSpare(previousFrameIndex)) {
        previousFrame[0] += currentFrameIndex[0];
      }
    }
  }

  getScore(): number {
    return this.frames.flat().reduce((acc, curr): number => acc + curr);
  }
}
