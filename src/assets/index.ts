/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 1/26/2019, 2:02:44 PM
 */
import ResourceManager, {IResourceEntry} from 'res-manager';

const assets: IResourceEntry[] = [];

[
  'button-back', 'confirm-ui', 'door', 'level-selcet', 'level1_background',
  'level1_background', 'level1_desk_withconlcle', 'level1_desk', 'level1_shelf_withconcle',
  'level1_shelf', 'level1_sofa_withconcle', 'mom-come-soon', 'progress-bar',
  'progress-box', 'result-bg', 'shoes1', 'shoes2', 'sofa',
  'star-one', 'star-three', 'star-two', 'star-yellow', 'star'
].forEach(name => {
  assets.push({
    preload: true,
    name,
    src: `require('./${name}')`,
    type: 'image',
    weight: 1
  })
})

const resManager = new ResourceManager();
resManager.init(assets);

export default resManager;
