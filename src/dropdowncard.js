import m from 'mithril';
import { Toolbar, IconButton, ToolbarTitle, Card } from 'polythene-mithril';
import icons from './icons';

// a card that is usually collapsed, but pops out when clicked on the title
export default class DropdownCard {
  /*
   * Attrs:
   *   title: string
   *     the title of the card
   *   other attrs:
   *     any other attributes for a Card from polythene.
   *
   */
  constructor() {
    this.expand = false;
  }
  view({ attrs, children }) {
    // all the attributes that are not the title
    const kwargs = Object.assign({}, attrs);
    delete kwargs.title;

    const toolbar = m(Toolbar, {
      compact: true,
      events: { onclick: () => { this.expand = !this.expand; } },
    }, [
      m(IconButton, {
        icon: { svg: m.trust(this.expand ? icons.downarrow : icons.rightarrow) },
      }),
      m(ToolbarTitle, { text: attrs.title }),
    ]);

    const content = [{ any: { content: toolbar } }];
    if (this.expand) {
      content.push(...children.map(child => ({
        any: {
          style: {
            padding: '0 10px 10px 10px',
          },
          content: child,
        },
      })));
    }

    return m(Card, Object.assign({ content }, kwargs));
  }
}
