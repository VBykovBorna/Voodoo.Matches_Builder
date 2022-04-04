import {DisplayObject, FontAlign, FontStyle, FontWeight, GameObject, Graphics, MessageDispatcher, TextField} from "black-engine";
import * as planck from 'planck-js';
import PhysicsOption from "../../physics/physics-options";

export default class Match extends DisplayObject {
  constructor(physics) {
    super();

    this._physics = physics;

    this._width = 10;
    this._height = 80;

    this._view = null;
    this._body = null;

    this._init();
  }

  // activate() {
  //   this._body.setActive(true);
  // }

  // deactivate() {
  //   this._body.setActive(false);
  // }

  setPos(pos) {
    const s = PhysicsOption.worldScale;
    pos.x /= s;
    pos.y /= s;

    this._body.setPosition(pos);
  }

  _init() {
    this._initView();
    this._initBody();
  }

  _initView() {
    const width = this._width;
    const height = this._height;

    const view = this._view = new Graphics();
    view.fillStyle(0xffffff, 1);
    view.roundedRect(0, 0, width, height, 2);
    view.fill();

    this.add(view)
    view.alignAnchor(0.5);
  }

  _initBody() {
    const width = this._width;
    const height = this._height;
    const s = PhysicsOption.worldScale;

    const body = this._body = this._physics.world.createDynamicBody();
    const fixture = body.createFixture(planck.Box(width * 0.5/s, height * 0.5/s), {
      friction: 0.5,
      restitution: 0.05,
      isSensor: true
    });

    body.setGravityScale(0.3);
    body.view = this._view;
    body.setUserData(this._view);
    body.setActive(false);
  }
}