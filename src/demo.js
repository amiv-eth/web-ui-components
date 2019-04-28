import m from 'mithril';
import { addTypography } from 'polythene-css';
import { Select, DropdownCard, Chip } from '../index';
import icons from './icons';

const root = document.body;

addTypography();

const demo = {
  view: () => {
    return m('div', [
      m('h3', 'Select'),
      m('div', m(Select, {
        name: 'demo',
        label: 'select',
        options: ['a', 'b', 'c'],
        style: { width: '100px' },
      })),
      m('h3', 'Dropdown Card'),
      m('div', m(DropdownCard, { title: 'click me' }, 'hidden content')),
      m('h3', 'Chip'),
      m('div', [
        m(Chip, { svg: icons.users, background: '#eeeeee' }, 'users'),
        m(Chip, { background: '#eeeeee' }, 'plain'),
        m(Chip, {
          svg: icons.users,
          svgBackground: 'yellow',
          svgColor: 'blue',
          style: { border: '1px solid black' },
        }, 'many styles'),
      ]),
    ]);
  },
};

m.mount(root, demo);
