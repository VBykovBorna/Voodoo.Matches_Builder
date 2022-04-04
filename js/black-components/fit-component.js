import { Black, Component, Message, Rectangle } from 'black-engine';

export default class FitComponent extends Component {
  /**
   *
   * @param {FitComponent.ALIGN=} align
   * @param {Rectangle|function} bounds
   * @param {boolean} fillRect
   */
  constructor(align = FitComponent.ALIGN.MIDDLE_CENTER, bounds = null, fillRect = true) {
    super();

    this._align = align;
    this._fillRect = fillRect;
    this._isActive = true;

    this._bounds = bounds;
  }

  updateLayout() {
    if (this.gameObject === null || this._isActive === false) return;

    const stage = this.gameObject.stage;
    let bounds = this._bounds || stage.bounds;

    if (typeof this._bounds === 'function') {
      bounds = this._bounds();
    }

    this._fitIntoRect(this.gameObject, bounds, this._fillRect, this._align);
    this.post('updateLayout');
  }

  onAdded(gameObject) {
    Black.stage.on(Message.RESIZE, this._onResize, this);

    this.updateLayout();
  }

  get fillRect() {
    return this._fillRect;
  }

  set fillRect(flag) {
    this._fillRect = flag;
    this.updateLayout();
  }

  get isActive() {
    return this._isActive;
  }

  set isActive(value) {
    this._isActive = value;
    this.updateLayout();
  }

  _onResize(m) {
    this.updateLayout();
  }

  _fitIntoRect(displayObject, bounds, fillRect, align) {
    let wD = displayObject.width / displayObject.scaleX;
    let hD = displayObject.height / displayObject.scaleY;

    let wR = bounds.width;
    let hR = bounds.height;

    let sX = wR / wD;
    let sY = hR / hD;

    let rD = wD / hD;
    let rR = wR / hR;

    let sH = fillRect ? sY : sX;
    let sV = fillRect ? sX : sY;

    let s = rD >= rR ? sH : sV;
    let w = wD * s;
    let h = hD * s;

    let tX = 0.0;
    let tY = 0.0;

    switch (align) {
      case FitComponent.ALIGN.LEFT:
      case FitComponent.ALIGN.TOP_LEFT:
      case FitComponent.ALIGN.BOTTOM_LEFT:
        tX = 0.0;
        break;

      case FitComponent.ALIGN.RIGHT:
      case FitComponent.ALIGN.TOP_RIGHT:
      case FitComponent.ALIGN.BOTTOM_RIGHT:
        tX = w - wR;
        break;

      default:
        tX = 0.5 * (w - wR);
    }

    switch (align) {
      case FitComponent.ALIGN.TOP:
      case FitComponent.ALIGN.TOP_LEFT:
      case FitComponent.ALIGN.TOP_RIGHT:
        tY = 0.0;
        break;

      case FitComponent.ALIGN.BOTTOM:
      case FitComponent.ALIGN.BOTTOM_LEFT:
      case FitComponent.ALIGN.BOTTOM_RIGHT:
        tY = h - hR;
        break;

      default:
        tY = 0.5 * (h - hR);
    }

    displayObject.x = bounds.x - tX;
    displayObject.y = bounds.y - tY;

    displayObject.scaleX = displayObject.scaleY = s;
  }
}

FitComponent.ALIGN = {
  LEFT: 'left',
  TOP_LEFT: 'topLeft',
  BOTTOM_LEFT: 'bottomLeft',
  RIGHT: 'right',
  TOP_RIGHT: 'topRight',
  BOTTOM_RIGHT: 'bottomRight',
  TOP: 'top',
  BOTTOM: 'bottom',
  MIDDLE_CENTER: 'middleCenter'
};
