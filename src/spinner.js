import m from 'mithril';
import { Icon } from 'polythene-mithril';
import icons from './icons';
import './animations.css';

const styles = {
  root: {
    opacity: '0',
    width: '48px',
    height: '48px',
  },
  visible: {
    opacity: '1',
  },
  icons: {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    color: '#e8462b',
    width: '100%',
    height: '100%',
  },
  gear: {
    animationName: 'spin',
    animationDuration: '2500ms',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'ease',
  },
};

export default class Spinner {
  /**
   * Infinite spinner with AMIV logo
   *
   * @param {boolean} attrs.show Specifies if the spinner is visible or not.
   *   Spinner is not visible by default (i.e. { show: false })
   *
   * Example:
   *   ```javascript
   *   m(Spinner, { show: true })
   *   ```
   */

  static view({ attrs: { style = {}, show = false, ...attrs } }) {
    return m(
      'div',
      { style: { ...styles.root, ...(show ? styles.visible : {}), ...style }, ...attrs },
      [
        m(Icon, { svg: m.trust(icons.amivDiode), style: styles.icons }),
        m(Icon, {
          svg: m.trust(icons.amivGear),
          style: { ...styles.icons, ...styles.gear },
        }),
      ],
    );
  }
}
