import m from 'mithril';
import '@material/select/dist/mdc.select.css';
import '@material/select/dist/mdc.select';

export default class Select {
  /*
   * A selection field where the value can be choosen from a small given set.
   *
   * Attrs:
   *   name: string
   *     name of the form field.
   *   label: string
   *     Label which is shown above the selected value.
   *   onchange: funtion()
   *     Called when the selection has changed.
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
