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
      timeout: 15,
      goodTime: 6,
      distDistance: 10,
      topToStepFactor: 1,
      maxVigilance: 100,
      vigilanceTh: 10,
      goodVigilance: 50,
      overVelocity: 1.5,
      autoReleaseTime: .5,
      mass: 30
    },
    {
      timeout: 12,
      goodTime: 6,
      distDistance: 10,
      topToStepFactor: 1,
      maxVigilance: 2,
      vigilanceTh: .75,
      goodVigilance: 1,
      overVelocity: 1.5,
      autoReleaseTime: .3,
      mass: 30
    },
    {
      timeout: 9,
      goodTime: 6,
      distDistance: 10,
      topToStepFactor: 1,
      maxVigilance: 2,
      vigilanceTh: .5,
      goodVigilance: 1,
      overVelocity: 1.2,
      autoReleaseTime: .3,
      mass: 30
    }
  ]
};
