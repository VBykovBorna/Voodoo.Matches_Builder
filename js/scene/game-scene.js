import {DisplayObject, FontAlign, FontStyle, FontWeight, GameObject, MessageDispatcher, TextField} from "black-engine";

export default class GameScene extends GameObject {
  constructor() {
    super();

    this.events = new MessageDispatcher(false);

    this._init();
  }

  start() {
    this.touchable = true;
  }

  pause() {
    this._isPaused = true;
  }

  resume() {
    this._isPaused = false;
  }

  _init() {
    this._initBg();

    this.events.on('tap', () => {
      this._onTap();
    });
  }

  _initBg() {
    const text = this._text = new TextField(
      'Hello world!',
      "Baloo",
      0xffffff,
      30,
      FontStyle.NORMAL,
      FontWeight.NORMAL,
      5,
      0x010d55, 
    );

    text.align = FontAlign.CENTER;
    text.alignPivotOffset();
    text.y = 1;

    this.add(text);

    text.x = 300;
    text.y = 300;
  }

  _onTap() {
    console.log('tap')
  }

  update(dt) {
    if (this._isPaused)
      return;

  }
}
