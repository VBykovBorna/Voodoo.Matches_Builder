import {Black, DisplayObject, FontAlign, FontStyle, FontWeight, GameObject, MessageDispatcher, TextField} from "black-engine";
import * as planck from 'planck-js';
import PhysicsOption from "../physics/physics-options";
import Match from "./matches/match";

export default class Map extends DisplayObject {
  constructor(physics) {
    super();

    this._physics = physics;
    this._s = PhysicsOption.worldScale;

    this._init();
  }

  _init() {
    this._initMatches();
    this._initGround();
  }

  _initGround() {
    const ground = this._ground = this._physics.world.createBody(planck.Vec2(0, 0));
    const width = 1000;
    const height = 20;
    const s = this._s;

    ground.createFixture(planck.Box(width/s, height/s));

    const bounds = Black.stage.bounds;
    const groundX = bounds.center().x / s;
    const groundY = (bounds.bottom - 100) / s;

    ground.setPosition(planck.Vec2(groundX, groundY));
  }

  _initMatches() {
    const count = 10;

    for (let i = 0; i < count; i++) {
      const match = new Match(this._physics);
      this.add(match);
  
      const bounds = Black.stage.bounds;
      const groundX = 100 + 30 * i; //bounds.center().x;
      const groundY = 300; //bounds.bottom;
  
      // const pos = planck.Vec2(300, 300);
      const pos = planck.Vec2(groundX, groundY);
      match.setPos(pos);
    }
  }

  onResize() {
    const { _ground: ground } = this;
    const bounds = Black.stage.bounds;

    // const s = PhysicsOption.worldScale;
    // const groundX = bounds.center().x / s;
    // const groundY = (bounds.bottom - 100) / s;

    // ground.setPosition(planck.Vec2(groundX, groundY));
  }
}