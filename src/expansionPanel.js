import m from 'mithril';
import { Card, IconButton } from 'polythene-mithril';
import icons from './icons';
import Collapse from './collapse';

const styles = {
  root: {
    borderRadius: '2px',
    display: 'grid',
    gridTemplateRows: 'auto auto',
    gridTemplateAreas: "'header' 'content'",
  },
  headerContainer: {
    gridArea: 'header',
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gridTemplateAreas: "'header button'",
    alignItems: 'center',
    cursor: 'pointer',
  },
  headerContent: {
    gridArea: 'header',
  },
  headerButton: {
    gridArea: 'button',
  },
};

export default class ExpansionPanel {
  /**
   * Expansion panel component based on the material design guidelines.
   *
   * The only difference is that there is no restriction for the content of the sections header
   * and content.
   *
   * See also:
   * https://material.io/archive/guidelines/components/expansion-panels.html#expansion-panels-specs
   *
   * @param {boolean}            attrs.expanded        Flag indicating if the component should be
   *   expanded. After a change of this attribute, the animation is performed.
   * @param {boolean}            attrs.separated       Flag indicating if margin should be added at
   *   the top/bottom of the component when expanded.
   * @param {string}             attrs.separatedMargin Margin applied vertically when expanded.
   * @param {string}             attrs.duration        Duration of the enter/exit animations
   *   (default: 300ms)
   * @param {string}             attrs.animation       CSS animation
   *   (default: cubic-bezier(0.4, 0, 0.2, 1)
   * @param {function|Component} attrs.header          Function or component to show as header
   *
   *   Example:
   *   ```javascript
   *   ({ expanded, duration, animation }) => m('div', 'Example Header');
   *   ```
   * @param {function|Component} attrs.content         Function or component to show as content.
   *
   *   Example:
   *   ```javascript
   *   ({ expanded, duration, animation }) => m('div', 'Example content');
   *   ```
   * @param {function}           attrs.onChange        Callback when state (expanded or not) has
   *   changed because of an internal trigger.
   *
   *   Example:
   *   ```javascript
   *   expanded => console.log(`Expanded state changed to ${expanded}.`);
   *   ```
   */

  constructor() {
    this.expanded = false;
  }

  view({
    attrs: {
      expanded,
      separated = false,
      separatedMargin = '32px',
      duration = 300,
      animation = 'cubic-bezier(0.4, 0, 0.2, 1)',
      onChange = () => {},
      header,
      content,
      style,
      ...attrs
    },
  }) {
    this.expanded = expanded || this.expanded;

    const attributes = {
      expanded: this.expanded,
      duration,
      animation,
    };

    let headerItem;
    if (typeof header === 'function') {
      headerItem = header(attributes);
    } else {
      headerItem = header;
    }

    let contentItem;
    if (typeof content === 'function') {
      contentItem = content(attributes);
    } else {
      contentItem = content;
    }

    return m(Card, {
      style: {
        ...styles.root,
        transition: `margin ${duration}ms ${animation}`,
        margin: `${this.expanded && separated ? separatedMargin : '0'} 0`,
        ...style,
      },
      ...attrs,
      content: m('div', [
        m(
          'div',
          {
            role: 'button',
            style: styles.headerContainer,
            onclick: () => {
              this.expanded = !this.expanded;
              onChange(this.expanded);
            },
          },
          [
            m('div', { style: styles.headerContent }, headerItem),
            m('div', { style: styles.headerButton }, m(IconButton, {
              icon: {
                svg: { content: m.trust(this.expanded ? icons.uparrow : icons.downarrow) },
              },
            })),
          ],
        ),
        m(Collapse, attributes, contentItem),
      ]),
    });
  }
}
