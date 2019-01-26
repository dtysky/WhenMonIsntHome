/**
 * @File   : timer.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 1/27/2019, 12:30:56 AM
 */
class Timer {
  public onComplete: () => void;
  public onUpdate: (countDown: number) => void;
  private total: number;
  private pre: number = 0;
  private t: number;
  private started: boolean = false;

  constructor() {
    requestAnimationFrame(this.update);
  }

  public start(
    total: number,
    onUpdate: (countDown: number) => void,
    onComplete: () => void
  ) {
    this.onComplete = onComplete;
    this.onUpdate = onUpdate;
    this.total = total;
    this.t = 0;
    this.started = true;
  }

  public stop() {
    this.started = false;
  }

  private update = (time: number) => {
    if (!this.pre) {
      this.pre = time;
      return requestAnimationFrame(this.update);;
    }

    if (this.started) {
      const delta = time - this.pre;
      this.pre = time;
      this.t += delta / 1000;
      const countDown = this.total - this.t;
      this.onUpdate(countDown < 0 ? 0 : countDown);

      if (this.t >= this.total) {
        this.onComplete();
        this.started = false;
      }
    }

    requestAnimationFrame(this.update);
  }
}

export default new Timer();
