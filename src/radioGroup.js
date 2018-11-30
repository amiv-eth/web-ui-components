import m from 'mithril';
import { RadioButton } from 'polythene-mithril';

export default class RadioGroup {
  /**
   * Generic RadioGroup component
   *
   * @param {string}   attrs.value    Current checked value
   * @param {string}   attrs.default  Default checked value
   * @param {array}    attrs.values   Array of possible values.
   *   Example: [{label: 'l1', value: 'v1'}, {label: 'l2', value: 'v2'}]
   * @param {function} attrs.onChange Called whenever the value changes
   *   Example: function callback(value) { ... }
   */

  constructor(vnode) {
    this.value = vnode.attrs.value || vnode.attrs.default;
  }
  onupdate(vnode) {
    if (vnode.attrs.value && vnode.attrs.value !== this.value) {
      this.value = vnode.attrs.value;
    }
  }
  view(vnode) {
    const buttons = [];
    vnode.attrs.values.forEach((option, index) => {
      if (index) {
        buttons.push(m('br'));
      }
      buttons.push(m(RadioButton, {
        ...option,
        checked: this.value === option.value,
        onChange: (state) => {
          if (state.checked) {
            this.value = option.value;
            vnode.attrs.onChange(this.value);
          }
        },
      }));
    });
    return m('div', buttons);
  }
}
