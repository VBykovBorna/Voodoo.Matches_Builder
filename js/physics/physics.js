import * as planck from 'planck-js';
import PhysicsOption from './physics-options';
// import Update from './update';

export default class Physics {
  constructor() {
    this.world = planck.World(PhysicsOption);

    this.updatePhysics = null;
    
    this.init();
  }

  clear() {
    const world = this.world;

    for (let b = world.getBodyList(); b; b = b.getNext()) {
      world.destroyBody(b);
    }
  }

  update() {
    this.updatePhysics.update();
  }

  init() {
    const { world } = this;

    this.updatePhysics = new Update(world, planck);
    new Collider(world, planck);
  }
}