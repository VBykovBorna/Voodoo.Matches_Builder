import {MessageDispatcher} from "black-engine";

export default class ResizeHandler {
  constructor() {
    this.events = new MessageDispatcher();

    this.init();
  }

  init() {

    let fixViewportHeight = function () {
      document.documentElement.style.height = window.innerHeight + "px";
      if (document.body.scrollTop !== 0) {
        window.scrollTo(0, 0);
      }
    }.bind(this);

    fixViewportHeight();

    document.body.style.webkitTransform = "translate3d(0,0,0)";

    const maxCheckTime = 750;
    let startTime = null;

    let tempWidth = 0;
    let tempHeight = 0;
    let handleId = null;

    const check = (timestamp) => {
      if (!startTime) startTime = timestamp;

      if (tempWidth !== window.innerWidth || tempHeight !== window.innerHeight) {
        fixViewportHeight();
        this.events.post('resize');
        tempWidth = window.innerWidth;
        tempHeight = window.innerHeight;
      }

      if (timestamp - startTime < maxCheckTime) {
        window.cancelAnimationFrame(handleId);
        handleId = window.requestAnimationFrame(check);
      }
    };

    window.cancelAnimationFrame(handleId);
    handleId = window.requestAnimationFrame(check);

    window.addEventListener('resize', (e) => {
      startTime = null;
      check(0);
    });

  }
}
