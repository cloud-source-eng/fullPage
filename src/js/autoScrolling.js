import * as utils from './common/utils.js';
import { silentScroll } from './common/silentScroll.js';
import { getScrollSettings } from './common/utilsFP.js';
import { 
    setVariableState,
    getOptions,
    getOriginals,
    getContainer
} from './common/options.js';
import { getState } from './common/state.js';
import { FP, win } from './common/constants.js';
import { $body, $htmlBody } from './common/cache.js';
import { setRecordHistory } from './anchors/setRecordHistory.js';
import { SCROLLABLE } from './common/selectors.js';

FP.setAutoScrolling = setAutoScrolling;
FP.test.setAutoScrolling = setAutoScrolling;

/**
* Sets the autoScroll option.
* It changes the scroll bar visibility and the history of the site as a result.
*/
export function setAutoScrolling(value, type){
    //removing the transformation
    if(!value){
        silentScroll(0);
    }
    
    setVariableState('autoScrolling', value, type);

    var element = getState().activeSection.item;

    if(getOptions().autoScrolling && !getOptions().scrollBar){
        utils.css($htmlBody, {
            'overflow': 'hidden',
            'height': '100%'
        });

        utils.removeClass($body, SCROLLABLE);
        setRecordHistory(getOriginals().recordHistory, 'internal');

        //for IE touch devices
        utils.css(getContainer(), {
            '-ms-touch-action': 'none',
            'touch-action': 'none'
        });

        if(element != null){
            var scrollable = getScrollSettings(0).element;
            var scrollableTop = scrollable.self === win ? 0 : scrollable.getBoundingClientRect().top;
            var scrollableScrollTop = scrollable.self === win ? utils.getScrollTop() : scrollable.scrollTop;
            var elementTop = element.getBoundingClientRect().top - scrollableTop + scrollableScrollTop;

            //moving the container up
            silentScroll(elementTop);
        }
    }else{
        utils.css($htmlBody, {
            'overflow' : 'visible',
            'height' : 'initial'
        });

        utils.addClass($body, SCROLLABLE);

        var recordHistory = !getOptions().autoScrolling ? false : getOriginals().recordHistory;
        setRecordHistory(recordHistory, 'internal');

        //for IE touch devices
        utils.css(getContainer(), {
            '-ms-touch-action': '',
            'touch-action': ''
        });

        //scrolling the page to the section with no animation
        if (element != null) {
            var scrollable = getScrollSettings(0).element;
            var scrollableTop = scrollable.self === win ? 0 : scrollable.getBoundingClientRect().top;
            var scrollableScrollTop = scrollable.self === win ? utils.getScrollTop() : scrollable.scrollTop;
            var elementTop = element.getBoundingClientRect().top - scrollableTop + scrollableScrollTop;

            var scrollSettings = getScrollSettings(elementTop);
            scrollSettings.element.scrollTo(0, scrollSettings.options);
        }
    }
}