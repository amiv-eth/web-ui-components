import m from 'mithril';
import debounce from './debounce';

const COLLAPSE_BODY_CLASS = 'collapse__body';
const ONGOING_EXTEND_ANIMATION = 'extending';
const ONGOING_COLLAPSE_ANIMATION = 'collapsing';
const STATE_IDLE = 'idle';

export default class Collapse {
  /**
   * Collapsible component for generic usage
   *
   * @param {string}   attrs.duration     Duration of the enter/exit animations (default: 300ms)
   * @param {string}   attrs.animation    CSS animation (default: ease-in-out)
   * @param {boolean}  attrs.expanded     Flag indicating if the component should be expanded.
   *   After a change of this attribute, the animation is performed.
   */

  constructor({ attrs: { expanded = false, duration = 300, animation = 'ease-out' } }) {
    this.state = STATE_IDLE;
    this.expanded = expanded;
    this.duration = duration;
    this.animation = animation;

    this.delayedRedrawAfterAnimation = debounce(() => {
      this.state = STATE_IDLE;
      m.redraw();
    }, duration, false);
  }

  oncreate({ dom }) {
    this._updateContentElementReference(dom);
  }

  onupdate({ dom }) {
    this._updateContentElementReference(dom);
  }

  onbeforeupdate() {
    if (this.contentElement) {
      // Measure the actual height of the content element before rendering,
      // so we can apply the calculated value while the CSS animation.
      this.height = this.constructor._getContentHeight(this.contentElement);
    }
  }

  view({ attrs: { expanded = false }, children }) {
    if (this.expanded !== expanded) {
      // Initiate an animation when the expanded value has toggled.
      if (expanded && this.state !== ONGOING_EXTEND_ANIMATION) {
        this.state = ONGOING_EXTEND_ANIMATION;
        this.expanded = true;
        this.delayedRedrawAfterAnimation();
      } else if (!expanded && this.state !== ONGOING_COLLAPSE_ANIMATION) {
        this.state = ONGOING_COLLAPSE_ANIMATION;
      }
    }

    let height;

    if (this.expanded) {
      // Set the calculated height of the content element explicitly,
      // so that the CSS animation works correctly.
      height = this.state !== STATE_IDLE ? `${this.height}px` : 'auto';
    } else {
      height = '0';
    }

    const container = m(
      'div', { className: this.expanded ? 'expanded' : '' },
      m(
        'div',
        {
          style: {
            transition: `height ${this.duration}ms ${this.animation}`,
            overflow: 'hidden',
            height,
          },
        },
        m('div', { className: COLLAPSE_BODY_CLASS }, children),
      ),
    );

    if (this.state === ONGOING_COLLAPSE_ANIMATION && this.expanded) {
      // Workaround to make sure the CSS exit animation works correctly.
      // Ensures that the height is entered as style before initiating the
      // exit animation. With height = auto, the animation does not work.
      // The timeout of 1ms is required so that the view() function call
      // can be finished before changing the expanded value. Otherwise,
      // the height value is not changed from auto to the explicit value.
      setTimeout(() => {
        this.expanded = false;
        m.redraw();
        this.delayedRedrawAfterAnimation();
      }, 1);
    }

    return container;
  }

  _updateContentElementReference(dom) {
    const body = dom.querySelector(`.${COLLAPSE_BODY_CLASS}`);
    // eslint-disable-next-line prefer-destructuring
    this.contentElement = body.children[0];
  }

  // Get the calculated height of a dom element.
  static _getContentHeight(element) {
    if (!element) return 0;
    const styles = window.getComputedStyle(element);
    const margin = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
    return Math.ceil(element.offsetHeight + margin);
  }
}
