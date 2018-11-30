import m from 'mithril';
import { Icon } from 'polythene-mithril';

export default class Chip {
  /**
   * A Chip component as from the material design guidelines
   *
   * @param {string}           attrs.svg           SVG icon shown before the content of the chip
   * @param {string}           attrs.background    Background color of the chip
   * @param {string}           attrs.textColor     Color for the text
   * @param {string}           attrs.svgColor      Color for the svg icon
   * @param {string}           attrs.svgBackground Background color for the svg icon
   * @param {function}         attrs.onClick       Callback function when the user clicked
   * @param {string|component} children            Children to show within the chip.
   *   This is just a text in most cases.
   */

  static view({
    attrs: {
      svg,
      background = '#fff',
      textColor = '#000',
      svgColor = '#000',
      svgBackground = '#ddd',
      ...attrs
    },
    children,
  }) {
    let svgIcon;

    if (svg) {
      svgIcon = m('div', {
        style: {
          backgroundColor: svgBackground,
          borderRadius: '12px',
          margin: '0px 4px 0px -2px',
          height: '24px',
          width: '24px',
          padding: '2px 2px 2px 4px',
        },
      }, m(Icon, { svg: { content: m.trust(svg) }, size: 'small', style: { svgColor } }));
    }

    return m('div', {
      style: {
        height: '32px',
        backgroundColor: background,
        color: textColor,
        borderRadius: '16px',
        // if there is a border, things are weirdly shifted
        padding: attrs.border ? '3px 8px 4px 6px' : '4px 8px',
        display: 'inline-flex',
        ...attrs.style,
      },
      ...attrs.onclick ? { onclick: attrs.onClick } : {},
    }, [
      svgIcon,
      m('div', { style: { lineHeight: '24px' } }, children),
    ]);
  }
}
