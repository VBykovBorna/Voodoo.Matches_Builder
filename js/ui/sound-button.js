import {Black, DisplayObject, MessageDispatcher, Sprite} from "black-engine";

export default class SoundButton extends DisplayObject {
  constructor() {
    super();
    this._resize = null;

    this.events = new MessageDispatcher();

    this._textureOn = Black.assets.getTexture('textures/sound_on');
    this._textureOff = Black.assets.getTexture('textures/sound_off');

    this._sprite = new Sprite(this._textureOn);
    this._sprite.alignPivotOffset();

    this.addChild(this._sprite);

    this.touchable = true;
    this._sprite.touchable = true;

    this._sprite.on('pointerDown', (msg, p) => this._onClick());
  }

  _onClick() {
    this.events.post('onMuteClick');
  }

  setState(muteState) {
    this._sprite.texture = muteState ? this._textureOff : this._textureOn;
  }


  onAdded() {
    super.onAdded();

    this._resize = this.stage.on('resize', () => this.__onResize());
    this.__onResize();
  }

  onRemoved() {
    this._resize.off();
  }

  __onResize() {
    this.x = this.stage.bounds.x + 60;
    this.y = this.stage.bounds.y + 120;
  }
}
