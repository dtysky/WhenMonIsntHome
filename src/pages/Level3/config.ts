/**
 * @File   : config.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 1/26/2019, 5:33:07 PM
 */
export default {
  height: 240,
  sub: [
    {
      timeout: 10,
      distDistance: 10,
      topToStepFactor: 1,
      maxVigilance: 100,
      vigilanceTh: 10,
      overVelocity: 1.5,
      autoReleaseTime: .5,
      mass: 30
    },
    {
      timeout: 10,
      distDistance: 10,
      topToStepFactor: 1,
      maxVigilance: 100,
      vigilanceTh: .75,
      overVelocity: 1.5,
      autoReleaseTime: .3,
      mass: 30
    },
    {
      timeout: 6,
      distDistance: 10,
      topToStepFactor: 1,
      maxVigilance: 60,
      vigilanceTh: .5,
      overVelocity: 1,
      autoReleaseTime: .3,
      mass: 30
    }
  ]
};
