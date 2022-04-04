import * as planck from 'planck-js';

const PhysicsOption = {
  gravity: planck.Vec2(0, 40.8),
  allowSleep: false,
  warmStarting: false,
  continuousPhysics: false,
  subStepping: false,
  blockSolve: true,
  velocityIterations: 20,
  positionIterations: 10,
  worldScale: 30,
  PAUSED: false,
  // PAUSED: true
};

export default PhysicsOption;