import m from 'mithril';
import '@material/select/dist/mdc.select.css';
import '@material/select/dist/mdc.select';

export default class Select {
  static view({ attrs: { options, name, label = '', onchange = () => {}, ...kwargs } }) {
    return m('div.mdc-select', { style: { height: '41px' } }, [
      m('select.mdc-select__native-control', {
        style: { 'padding-top': '10px' },
        onchange: ({ target: { value } }) => { onchange(value); },
        ...kwargs,
      }, options.map(option => m('option', { value: option }, option))),
      m('label.mdc-floating-label', label),
      m('div.mdc-line-ripple'),
    ]);
  }
}
