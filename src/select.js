import m from 'mithril';
import '@material/select/dist/mdc.select.css';
import '@material/select/dist/mdc.select';

export default class Select {
  /**
   * A selection field where the value can be choosen from a small given set.
   *
   * @param {object}   attrs          unless specified below, attrs will be
   *   passed into the <select/> input field.
   * @param {string}   attrs.name     name of the form field.
   * @param {string}   attrs.label    Text which is shown above the selected value.
   * @param {function} attrs.onchange function (name, value) -
   *   this function is called every time that the value of the select changes
   *   (i.e. not the focus, as would happen with polythene inputs)
   */
  static view({ attrs: { options, name, label = '', onchange = () => {}, ...kwargs } }) {
    return m('div.mdc-select', { style: { height: '41px' } }, [
      m('select.mdc-select__native-control', {
        style: { 'padding-top': '10px' },
        onchange: ({ target: { value } }) => { onchange(value); },
        ...kwargs,
      }, options.map(option => m('option', { value: option }, option))),
      m('label', { class: 'mdc-floating-label mdc-floating-label--float-above' }, label),
      m('div.mdc-line-ripple'),
    ]);
  }
}
