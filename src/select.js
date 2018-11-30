import m from 'mithril';
import '@material/select/dist/mdc.select.css';
import '@material/select/dist/mdc.select';
import { MDCSelect } from '@material/select';

export default class Select {
  /**
   * A selection field where the value can be choosen from a small given set.
   *
   * @param {object}   attrs          unless specified below, attrs will be
   *   passed into the <select/> input field.
   * @param {string}   attrs.name     name of the form field.
   * @param {string}   attrs.label    Text which is shown above the selected value.
   * @param {function} attrs.onChange function (name, value) -
   *   this function is called every time that the value of the select changes
   *   (i.e. not the focus, as would happen with polythene inputs)
   * @param {array}    attrs.options  Array containing the selectable items
   * @param {string}   attrs.value    Selected value
   */

  oncreate({ dom }) {
    this.foo = new MDCSelect(dom.querySelector(`#${this.name}`));
  }

  view({
    attrs: { options, name, label = '', onChange = () => {}, getErrors = () => [], ...kwargs },
  }) {
    this.name = name;
    let rippleColor = { 'background-color': 'rgba(0, 0, 0, 0.6)' };
    let textColor = { color: 'rgba(0, 0, 0, 0.6)' };
    let borderBottomColor = { 'border-bottom-color': 'rgba(0, 0, 0, 0.6)' };

    if (getErrors().length !== 0) {
      rippleColor = { 'background-color': 'rgba(221, 44, 0, 1)' };
      textColor = { color: 'rgba(221, 44, 0, 1)' };
      borderBottomColor = { 'border-bottom-color': 'rgba(221, 44, 0, 1)' };
    }
    return m('div', [
      m(
        'div.mdc-select',
        {
          id: name,
          'aria-controls': `${name}-helper-text`,
          'aria-describedby': `${name}-helper-text`,
        },
        [
          m(
            'select.mdc-select__native-control',
            {
              style: borderBottomColor,
              onchange: ({ target: { value } }) => {
                onChange({ value });
              },
              ...kwargs,
            },
            [
              m.trust('<option value="" disabled selected></option>'),
              ...options.map(option => m('option', { value: option }, option)),
            ],
          ),
          m(
            'label',
            {
              class: 'mdc-floating-label mdc-floating-label--float-above',
              style: textColor,
            },
            label,
          ),
          m('div.mdc-line-ripple', {
            style: rippleColor,
          }),
        ],
      ),
      m(
        'p.pe-textfield-error',
        {
          id: `${name}-helper-text`,
          style: { color: 'rgba(221, 44, 0, 1)', 'font-size': '12px' },
        },
        getErrors(),
      ),
    ]);
  }
}
