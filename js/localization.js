// TODO: refactor to es6 class

var Localization = function () { };

Localization.prototype.init = function () {
  this._strings = [];
  this._language = null;

  if (navigator && navigator.userAgent && (this._language = navigator.userAgent.match(/android.*\W(\w\w)-(\w\w)\W/i))) {
    this._language = this._language[1];
  }

  if (!this._language && navigator) {
    if (navigator.languages) {
      this._language = navigator.languages[0];
    } else if (navigator.language) {
      this._language = navigator.language;
    } else if (navigator.browserLanguage) {
      this._language = navigator.browserLanguage;
    } else if (navigator.systemLanguage) {
      this._language = navigator.systemLanguage;
    } else if (navigator.userLanguage) {
      this._language = navigator.userLanguage;
    }

    if (this._language)
      this._language = this._language.toLowerCase();
  }

  if (!this._language)
    this._language = 'en';
};

Localization.prototype.registerString = function (string, translations) {
  this._strings[string] = translations;
};

Localization.prototype.registerStrings = function (translations) {
  for (var string in translations) {
    this.registerString(string, translations[string]);
  }
};

Localization.prototype.getLanguage = function () {
  return this._language;
};

Localization.prototype.getLanguageGroup = function () {
  return this._language ? this._language.substring(0, 2) : null;
};

Localization.prototype.setLanguage = function (val) {
  this._language = val ? val.toString() : this._language;
};

Localization.prototype.get = function (string, macros) {
  var genericLocale = this.getLanguageGroup();
  var s = this._strings[string] && this._strings[string].en || string;

  if (this._strings[string] && this._strings[string][this._language]) {
    s = this._strings[string][this._language];
  } else if (this._strings[string] && typeof this._strings[string][genericLocale] !== 'undefined') {
    if (this._strings[string][genericLocale] !== '') {
      s = this._strings[string][genericLocale];
    } else {
      s = this._strings[string].en;
    }
  }

  if (macros) {
    for (var macro in macros) {
      s = s.replace(macro, macros[macro]);
    }
  }

  return s;
};

Localization.prototype.parseRegisteredStrings = function () {
  this._localized = false;
  this._localizedForRegion = false;
  for (var string in this._strings) {
    if (string.indexOf('Game is loading') > -1) break;
    if (typeof this._strings[string][this._language.substr(0, 2)] !== 'undefined') {
      this._localized = true;
    }
    if (typeof this._strings[string][this.getLanguage()] !== 'undefined') {
      this._localizedForRegion = true;
    }
  }
};

Localization.prototype.isLocalized = function () {
  if (typeof this._localized === 'undefined') this.parseRegisteredStrings();
  return this._localized;
};

Localization.prototype.isLocalizedForRegion = function () {
  if (typeof this._localizedForRegion === 'undefined') this.parseRegisteredStrings();
  return this._localizedForRegion;
};

var localization = new Localization();
localization.init();
export default localization;
