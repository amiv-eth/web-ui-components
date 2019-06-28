import m from 'mithril';
import { MDCSelect } from '@material/select';
import '@material/select/dist/mdc.select.css';

export default class Select {
  /**
   * A selection field where the value can be choosen from a small given set.
   *
   * @param {object}   attrs             Unless specified below, attrs will be
   *   passed into the <select/> input field.
   * @param {string}   attrs.name        Name of the form field.
   * @param {string}   attrs.label       Text which is shown above the selected value.
   *   (Does not work properly when MDCSelect js component is not used!)
   * @param {string}   attrs.placeholder Placeholder text displayed when nothing is selected.
   * @param {function} attrs.onChange    Function (name, value) -
   *   this function is called every time that the value of the select changes
   *   (i.e. not the focus, as would happen with polythene inputs)
   * @param {array}    attrs.options     Array containing the selectable items
   *   * as a list of strings (value and label will be the same)
   *     Example: `['item1', 'item2']`
   *   * as a list of objects (set label and value independently)
   *     Example: `[{ label: 'label1', value: 'value1' }, { label: 'label2', value: 'value2' }]`
   * @param {string}   attrs.value       Selected value
   */

  oncreate({ dom }) {
    this.mdcSelect = new MDCSelect(dom.querySelector(`#${this.name}`));
  }

  view({
    attrs: {
      className,
      style,
      options,
      name,
      label = '',
      placeholder = '',
      onChange = () => {},
      getErrors = () => [],
      ...kwargs
    },
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
    return m('div', { className, style }, [
      m(
        'div.mdc-select',
        {
          id: name,
          'aria-controls': `${name}-helper-text`,
          'aria-describedby': `${name}-helper-text`,
          style: {
            backgroundColor: 'transparent',
          },
        },
        [
          m('i.mdc-select__dropdown-icon'),
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
              m.trust(`<option value="" disabled selected hidden>${placeholder}</option>`),
              ...options.map((option) => {
                const isObject = typeof option === 'object' && option !== null;
                const value = isObject && option.value !== undefined ? option.value : option;
                const textLabel = isObject && option.label !== undefined ? option.label : option;

                return m('option', { value }, textLabel);
              }),
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
          style: { color: 'rgba(221, 44, 0, 1)', 'font-size': '12px', margin: '6px 0 0' },
        },
        getErrors(),
      ),
    ]);
  }
}
