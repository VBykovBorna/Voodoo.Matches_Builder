import { AssetLoader } from "black-engine";

export default class InlineAssetLoader extends AssetLoader {
  constructor(url, data) {
    super(url);

    this.mData = data;
  }

  load() {
    this.onLoad();
  }
}
