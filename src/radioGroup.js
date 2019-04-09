import m from 'mithril';
import { RadioButton } from 'polythene-mithril';

/**
 * Generic RadioGroup component
 *
 * Attributes:
 *
 *   - `value` current checked value
 *   - `default` default checked value
 *   - `values` array of possible values like [{label: '', value: ''}]
 *   - `onChange` called whenever value changes with value as argument
 *
 * @return {RadioGroupComponent} generic checkbox as mithril component.
 */
export default class RadioGroup {
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
            vnode.attrs.onChange({ value: this.value });
          }
        },
      }));
    });
    return m('div', buttons);
  }
}
