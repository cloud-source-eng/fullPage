import * as utils from '../common/utils.js';
import { getScrollSettings, isFullPageAbove } from '../common/utilsFP.js';
import { getOptions } from '../common/options.js';
import { doc, win, FP } from '../common/constants.js';
import { $html, $htmlBody } from '../common/cache.js';
import { getState, setState } from '../common/state.js';
import { scrollTo } from '../common/scrollTo.js';

export function scrollBeyondFullPage(){
    var dtop = getDestinationOffset();
    var scrollSettings = getScrollSettings(dtop);
    FP.test.top = -dtop + 'px';

    setState({canScroll: false});
    scrollTo(scrollSettings.element, scrollSettings.options, getOptions().scrollingSpeed, function(){
        setTimeout(function(){
            setState({isBeyondFullpage: true});
            setState({canScroll: true});
        },30);
    });
}

export function onKeyDown(){
    if(!isFullPageAbove()){
        return;
    }else{
        scrollUpToFullpage();
    }    
}

export function scrollUpToFullpage(){
    var item = utils.getLast(getState().sections).item;
    var scrollable = getScrollSettings(0).element;
    var scrollableTop = scrollable.self === win ? 0 : scrollable.getBoundingClientRect().top;
    var scrollableScrollTop = scrollable.self === win ? utils.getScrollTop() : scrollable.scrollTop;
    var elementTop = item.getBoundingClientRect().top - scrollableTop + scrollableScrollTop;

    var scrollSettings = getScrollSettings(elementTop);
    setState({canScroll: false});
    
    scrollTo(scrollSettings.element, scrollSettings.options, getOptions().scrollingSpeed, function(){
        setState({canScroll: true});
        setState({isBeyondFullpage: false});
        setState({isAboutToScrollToFullPage: false});
    });
}

function getDestinationOffset(){
    if(!getOptions().css3){
        var item = utils.getLast(getState().sections).item;
        var scrollable = getScrollSettings(0).element;
        var scrollableTop = scrollable.self === win ? 0 : scrollable.getBoundingClientRect().top;
        var scrollableScrollTop = scrollable.self === win ? utils.getScrollTop() : scrollable.scrollTop;
        var elementTop = item.getBoundingClientRect().top - scrollableTop + scrollableScrollTop;

        return elementTop + item.offsetHeight;
    }
    return utils.getScrollTop() +  utils.getWindowHeight();
}