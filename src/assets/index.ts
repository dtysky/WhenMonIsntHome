/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 1/26/2019, 2:02:44 PM
 */
import ResourceManager, {IResourceEntry} from 'res-manager';

const assets: IResourceEntry[] = [];

[
  'button-back', 'confirm-ui', 'door', 'level-select', 'level1_background',
  'level1_background', 'level1_desk_withconlcle', 'level1_desk', 'level1_shelf_withconcle',
  'level1_shelf', 'level1_sofa_withconcle', 'mom-come-soon', 'progress-bar',
  'progress-box', 'result-bg', 'shoes1', 'shoes2', 'sofa',
  'star-1', 'star-3', 'star-2', 'star-yellow', 'star',
  'level3-bg', 'level3-notice', 'level3-bar', 'level3-foot-left', 'level3-foot-right'
].forEach(name => {
  assets.push({
    preload: true,
    name,
    src: require(`./${name}.png`),
    type: 'image',
    weight: 1
  })
});

assets.push({
  preload: true,
  name: 'level3-snoze',
  src: require('./level3-snoze.gif'),
  type: 'image',
  weight: 1
});

assets.push({
  preload: true,
  name: 'star-0',
  src: require('./star-0.gif'),
  type: 'image',
  weight: 1 
});

const resManager = new ResourceManager();
resManager.init(assets);

export default resManager;
