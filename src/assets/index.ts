/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 1/26/2019, 2:02:44 PM
 */
import ResourceManager, {IResourceEntry} from 'res-manager';

const assets: IResourceEntry[] = [
  {
    preload: true,
    name: 'test',
    src: require('./test.jpg'),
    type: 'image',
    weight: 26
  },
];

const resManager = new ResourceManager();
resManager.init(assets);

export default resManager;