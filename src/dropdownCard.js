import m from 'mithril';
import { Toolbar, ToolbarTitle } from 'polythene-mithril';
import ExpansionPanel from './expansionPanel';

export default class DropdownCard {
  /**
   * A [card](https://arthurclemens.github.io/polythene-demos/mithril/#/card) that is usually
   * collapsed, but pops out when clicked on the title
   *
   * @param {objects}   attrs           Any attributes for a Card from polythene
   * @param {string}    attrs.title     The title of the card -
   *   this will be the only thing visible if the card is collapsed
   * @param {boolean}   attrs.expanded  Flag indicating if the component should be
   *   expanded. After a change of this attribute, the animation is performed.
   * @param {boolean}   attrs.separated Flag indicating if margin should be added at
   *   the top/bottom of the component when expanded.
   * @param {string}    attrs.duration  Duration of the enter/exit animations
   *   (default: 300ms)
   * @param {string}    attrs.animation CSS animation
   *   (default: cubic-bezier(0.4, 0, 0.2, 1)
   * @param {function}  attrs.onChange  Callback when state (expanded or not) has changed
   * @param {Component} children        Any content in the polythene card
   */

  static view({ attrs: { expanded, separated = false, title = '', ...attrs }, children }) {
    const toolbar = m(Toolbar, { compact: true }, m(ToolbarTitle, { text: title }));

    return m(ExpansionPanel, {
      expanded,
      separated,
      header: toolbar,
      content: m('div', children.map(child => m(
        'div', {
          style: {
            padding: '0 10px 10px 10px',
          },
        },
        child,
      ))),
      ...attrs,
    });
  }
}
