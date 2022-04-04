/* jshint ignore:start */
// DO NOT CHANGE

window._gameplay.timerEndScreen = "{{creative.timerEndScreen}}";
window._gameplay.nbRetry = "{{creative.nbRetry}}";
window._gameplay.isEnd = false;
window._gameplay.timerLock = false;
window._gameplay.isInit = false;
window._gameplay.paused = false;
window._gameplay.nbClick = 0;
window._gameplay.started = false;
window._gameplay.redirectionAfterClick = "{{creative.redirectionAfterClick}}";
window._gameplay.restartAfterStore = "{{endLevel.restartAfterStore}}";
window._gameplay.autoStart = "{{advanced.autoStart}}";
window._gameplay.autoStartDelay = "{{advanced.autoStartDelay}}";

window._gameplayEvents = {};

window._gameplayEvents.checkAutoStart = function(){
  if(window._gameplay.autoStart){
    setTimeout(function(){
      if(!window._gameplay.started){
        if (typeof window._gameplayEvents.startGame === 'function'){
          window._gameplay.started = true;
          window._gameplayEvents.startGame();
        }
      }
    },window._gameplay.autoStartDelay*1000);
  }
}

window._gameplayEvents.startTimer = function(event){
  if(window._gameplay.timerLock) return;
  window._gameplay.timerLock = true;
  document.getElementById("start-screen").style.display = "none";
  if(!window._gameplay.started){
    window._gameplay.started = true;
    window._gameplayEvents.startGame();
  }
  setTimeout(function() {
    if(document.getElementById('retry-screen').style.display =="none" || document.getElementById('retry-screen').style.display=="")
      window._gameplayEvents.endGame("timer");
  }, window._gameplay.timerEndScreen*1000);
};

window._gameplayEvents.endGame = function(end){
  if(window._gameplay.isEnd) return;
  console.log("End Game : "+ end);
  window._gameplay.isEnd = true;
  if(window._voodooProvider == 'vungle')
    window.parent.postMessage('complete','*');
  window.showEndCard();
  if({{endLevel.available}})
  window._gameplayEvents.endLevel();
  setTimeout(function(){
    document.getElementById('end-screen').style.display = "flex";
    document.getElementById('end-screen').classList.remove('hide');
    if (typeof window.showEndScreen === 'function') {
      window.showEndScreen();
    }
  },300);
};

window._gameplayEvents.endLevel = function(){
  if(window._gameplay.lockEndLevel) return;
  window._gameplay.lockEndLevel = true;
  window._gameplay.isEndLevel = true;
  setTimeout(function(){
    window._gameplay.creative = window._gameplayEndLevel;
    window._gameplayEvents.restartGame();
    window._gameplay.paused = {{endLevel.paused}};
    window._gameplay.lockEndLevel = false;
  },{{endLevel.delay}}*1000)
};

window._gameplayEvents.endLevelAfterStore = function(type){
  if(window._gameplay.lockEndLevel) return;
  window._gameplay.lockEndLevel = true;
  window._gameplay.isEndLevel = true;
  if(!window._gameplay.restartAfterStore) return;
  if (document.getElementById('end-screen')) document.getElementById('end-screen').style.display = "none";
  var delay = type == "editor"? 500 : 1250;
  setTimeout(function(){
    window._gameplay.creative = window._gameplayEndLevel;
    window._gameplayEvents.restartGame();
    window._gameplay.paused = {{endLevel.paused}};
    window._gameplay.lockEndLevel = false;
  },delay)
};

window._gameplayEvents.lose = function () {
  if(window._gameplay.isEnd)return;
  if(window._gameplay.nbRetry>0){
    if (typeof window.showRetryScreen === 'function') {
      window.showRetryScreen();
    }
  }else{
    if(window._gameplay.restartAfterStore && window._gameplay.isEndLevel)
      window._gameplayEvents.endLevelAfterStore();
    else
      window._gameplayEvents.endGame("lose");
  }
}

window._gameplayEvents.retry = function () {
  document.getElementById('retry-screen').style.display ="none";
  window._gameplay.nbRetry--;
  window._gameplayEvents.restartGame();
}

window._gameplayEvents.exit = function(){
  window._gameplay.bannerClick = true;
  window._voodooExit();
  setTimeout(function() {
    window._gameplay.bannerClick = false;
  }, 500);
}

window._voodooIOS = "{{general.ios}}";
window._voodooANDROID = "{{general.android}}";

var lockClick = false;
var storeRedirection = function(){
  if(lockClick)return;
  lockClick = true;
  window._gameplay.nbClick ++;
  if(window._gameplay.nbClick >= window._gameplay.redirectionAfterClick && window._gameplay.redirectionAfterClick!=0){
    window._voodooExit("click");
  }
  setTimeout(function(){
    lockClick = false;
  },250)
}

document.addEventListener('touchend',storeRedirection);
document.addEventListener('touchcancel',storeRedirection);
document.addEventListener('pointerup',storeRedirection);

{{module.header.js}}
{{module.footer.js}}
{{module.startScreen.js}}
{{module.endScreen.js}}
{{module.retryScreen.js}}

/* jshint ignore:end */
