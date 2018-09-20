import icons from './icons';

// a card that is usually collapsed, but pops out when clicked on the title
export class DropdownCard {
  constructor() {
    this.expand = false;
  }

  view({ attrs: { title, ...kwargs }, children }) {
    const toolbar = m(Toolbar, {
      compact: true,
      events: { onclick: () => { this.expand = !this.expand; } },
    }, [
      m(IconButton, {
        icon: { svg: m.trust(this.expand ? icons.downarrow : icons.rightarrow) },
      }),
      m(ToolbarTitle, { text: title }),
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

    return m(Card, { content, ...kwargs });
  }
}