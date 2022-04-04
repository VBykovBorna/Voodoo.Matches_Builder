import { Component, Black, Message } from 'black-engine';

export default class ResizeActionComponent extends Component {
  constructor(onResizeCallback, context) {
    super();

    this._callback = onResizeCallback;
    this._context = context;
    this._binding = null;
  }

  onAdded() {
    this._binding = this.stage.on(Message.RESIZE, this._onResize, this);
    this._onResize();
  }

  onRemoved() {
    super.onRemoved();
    this._binding.off();
  }

  _onResize() {
    this._callback.call(this._context, this.parent);
  }
}
