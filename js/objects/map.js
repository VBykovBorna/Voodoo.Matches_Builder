import {Black, DisplayObject, FontAlign, FontStyle, FontWeight, GameObject, MessageDispatcher, TextField} from "black-engine";
import * as planck from 'planck-js';
import PhysicsOption from "../physics/physics-options";
import Match from "./matches/match";

export default class Map extends DisplayObject {
  constructor(physics) {
    super();

    this._physics = physics;

    this._init();
  }

  _init() {
    this._initMatches();
    // this._initGround();
  }

  _initGround() {
    const ground = this._ground = this._physics.world.createBody();
    ground.createFixture(planck.Edge(planck.Vec2(-40.0, 0.0), planck.Vec2(40.0, 0.0)), 0.0);

    const bounds = Black.stage.bounds;
    const groundX = bounds.center().x;
    const groundY = bounds.bottom;

    // const pos = planck.Vec2(groundX * 10, groundY * 30);

    // ground.setPosition(pos)
  }

  _initMatches() {
    const match = new Match(this._physics);
    this.add(match);

    const bounds = Black.stage.bounds;
    const groundX = 200; //bounds.center().x;
    const groundY = 600; //bounds.bottom;

    // const pos = planck.Vec2(300, 300);
    const pos = planck.Vec2(groundX, groundY);
    match.setPos(pos);
  }

  onResize() {
    const { _ground: ground } = this;
    const bounds = Black.stage.bounds;

    const s = PhysicsOption.worldScale;
    const groundX = bounds.center().x / s;
    const groundY = bounds.bottom / s;

    // ground.setPosition(planck.Vec2(groundX, groundY));

    // ground.x = groundX;
    // ground.y = groundY;
  }
}