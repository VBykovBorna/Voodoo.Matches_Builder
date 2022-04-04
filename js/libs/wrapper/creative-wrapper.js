import {Partner} from "./partner";
import {VisibilityHandler} from "./helpers/visibility-handler";
import ResizeHandler from "./helpers/resize-handler";
import {VoodooWrapper} from "./partners/voodoo/voodoo-wrapper";

export class CreativeWrapper {
  constructor() {
    this.partnerName = CreativeWrapper.PARTNER_NAME[__PARTNER__];
    this.config = config;

    this._partner = null;
    this._visibilityHandler = null;
    this._resizeHandler = null;
  }

  get state() {
    return this._partner.state;
  }

  set state(value) {
    this._partner.state = value;
  }

  get events() {
    return this._partner.events;
  }

  init() {
    this._updateConfigParams();

    this._definePartner();

    this._partner.init();
    this._initHelpers();
  }

  startAdd() {
    this._partner.start();
  }

  onCTAShown() {
    this.events.post('onEndGame');
  }

  onCTAClicked() {
    this.events.post('onInstall');
  }

  onInteraction() {
    this.events.post('onInteraction');
  }

  hideSplashScreen() {
    this.events.post('onHideSplashScreen');
  }

  getParam(paramKey) {
    return this._partner.getParam(paramKey);
  }

  getParams() {
    return this._partner.getParams();
  }

  _initHelpers() {
    this._visibilityHandler = new VisibilityHandler(this.partnerName === CreativeWrapper.PARTNER_NAME.voodoo_dev);
    this._resizeHandler = new ResizeHandler();

    this._visibilityHandler.events.on('pause', () => {
      this._partner.events.post('pause');
    });
    this._visibilityHandler.events.on('resume', () => {
      this._partner.events.post('resume');
    });
    this._resizeHandler.events.on('resize', () => {
      this._partner.events.post('resize');
    });
  }

  _updateConfigParams() {
    let urlParam = this._getUrlVars();

    Object.keys(this.config).forEach(key => {
      if (typeof urlParam[key] !== 'undefined') {
        const property = this.config[key];
        if (property.type === 'number' || property.type === 'int') {
          this.config[key].value = Number(urlParam[key]);
        } else if (property.type === 'bool') {
          this.config[key].value = urlParam[key] === 'true';
        } else if (property.type === 'enum') {
          this.config[key].value = unescape(urlParam[key]);
        } else if (property.type === 'color') {
          this.config[key].value = unescape(urlParam[key]);
        } else {
          this.config[key].value = unescape(urlParam[key]);
        }
      }
    });
  }

  _getUrlVars() {
    let vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
      function (m, key, value) {
        vars[key] = value;
      });
    return vars;
  }

  _definePartner() {
    switch (this.partnerName) {
      case CreativeWrapper.PARTNER_NAME.voodoo:
        this._partner = new VoodooWrapper(this.config, false);
        break;
      case CreativeWrapper.PARTNER_NAME.voodoo_dev:
        this._partner = new VoodooWrapper(this.config, true);
        break;
      default:
      case CreativeWrapper.PARTNER_NAME.none:
        this._partner = new Partner(this.config);
        break;
    }
  }
}

CreativeWrapper.START_CREATIVE = function () {
};

CreativeWrapper.PARTNER_NAME = {
  'none': 0,
  'voodoo': 1,
  'voodoo_dev': 2
};

CreativeWrapper.STATE = {
  'none': 0,
  'ready': 1,
  'live': 2,
  'started': 3,
  'playing': 4,
};
