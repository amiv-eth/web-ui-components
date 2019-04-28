import m from 'mithril';
import Stream from 'mithril/stream';
import {
  List, ListTile, Search, IconButton, Button, Toolbar, ToolbarTitle,
} from 'polythene-mithril';
import infinite from 'mithril-infinite';
import icons from './icons';


const BackButton = {
  view: ({ attrs }) => m(IconButton, {
    icon: { svg: m.trust(icons.back) },
    ink: false,
    events: { onclick: attrs.leave },
  }),
};
const ClearButton = {
  view: ({ attrs }) => m(IconButton, {
    icon: { svg: m.trust(icons.clear) },
    ink: false,
    events: { onclick: attrs.clear },
  }),
};


class SearchField {
  // copy-paste from polythene-mithril examples
  oninit() {
    this.value = Stream('');
    this.setInputState = Stream();

    this.clear = () => this.value('');
    this.leave = () => this.value('');
  }

  view({ attrs }) {
    // incoming value and focus added for result list example:
    const value = attrs.value !== undefined ? attrs.value : this.value();
    return m(Search, Object.assign(
      {},
      {
        textfield: {
          label: attrs.placeholderText,
          onChange: (newState) => {
            this.value(newState.value);
            this.setInputState(newState.setInputState);
            // onChange callback added for result list example:
            if (attrs.onChange) attrs.onChange(newState, this.setInputState);
          },
          value,
          defaultValue: attrs.defaultValue,
        },
        buttons: {
          focus: {
            before: m(BackButton, { leave: this.leave }),
          },
          focus_dirty: {
            before: m(BackButton, { leave: this.leave }),
            after: m(ClearButton, { clear: this.clear }),
          },
          dirty: {
            before: m(BackButton, { leave: this.leave }),
            after: m(ClearButton, { clear: this.clear }),
          },
        },
      },
      attrs,
    ));
  }
}


export default class ListSelect {
  /**
   * A selection field where the value can be choosen from a large list of items
   * loaded from an API resource (e.g. select a user or an event).
   *
   * @param {object}      attrs.controller              a `DataListController`
   *     Used as a controller for the list state
   * @param {string}      attrs.placeholderText         placeholder text (default: 'type here')
   *     Shown when searchfield is empty
   * @param {string}      attrs.cancelText              label for cancel button (default: 'cancel')
   * @param {string}      attrs.submitText              label for submit button (default: 'submit')
   * @param {function}    attrs.selectedText            function(item)
   *     Function that maps the selected API object to a string that can be displayed as the
   *     selected item. e.g. `${item.firstname} ${item.lastname}` in case of a user.
   * @param {function}    attrs.listTileAttrs           funtion(item)
   *     Function that maps an API object to attributes of a polythene 'ListTile' to display the
   *     possibilities out of which the user can select one.
   * @param {function}    attrs.onSelect                function(item)
   *     Callback when an item is selected
   * @param {function}    attrs.onSubmit                function(item)
   *     Callback when an item is submitted.
   *     Submittion is only possible if this function is set.
   * @param {function}    attrs.onCancel                function()
   *     Callback when the selection is cancelled.
   *     Cancellation is only possible if this function is set.
   * @param {string}      attrs.buttonClassName         class name for the buttons
   *     class name applied to the buttons (submit, cancel), (defaut: blue-button)
   * @param {object}      attrs.toolbarAttrs            attributes passed to the toolbar component
   * @param {string}      attrs.toolbarAttrs.background background color of the toolbar/searchfield
   *     (default: 'rgb(78, 242, 167)')
   * @param {object}      attrs.listAttrs               attributes passed to the list component
   * @param {string}      attrs.listAttrs.background background color of the search result list
   *     (default: 'white')
   * @param {string|null} attrs.listAttrs.height        height of the search result list.
   *     Unrestricted if set to null. (default: '400px')
   * @param {boolean}     attrs.listAttrs.permanent     show the search result list permanently
   *     This is independent of focus state of the searchfield. (default: false)
   */

  constructor({ attrs: { listTileAttrs, onSelect = false } }) {
    this.showList = false;
    this.searchValue = '';
    this.listTileAttrs = listTileAttrs;
    // initialize the Selection
    this.selected = null;
    this.onSelect = onSelect;
  }

  onupdate({ attrs: { selection = null } }) {
    // make it possible to change the selection from outside, e.g. to set the field to an
    // existing group moderator
    if (selection) this.selected = selection;
  }

  item() {
    return (data) => {
      const attrs = {
        compactFront: true,
        hoverable: true,
        className: 'themed-list-tile',
        events: {
          onclick: () => {
            if (this.onSelect) { this.onSelect(data); }
            this.selected = data;
            this.showList = false;
          },
        },
      };
      // Overwrite default attrs
      Object.assign(attrs, this.listTileAttrs(data));
      return m(ListTile, attrs);
    };
  }

  view({
    attrs: {
      controller,
      onSubmit = false,
      onCancel = false,
      selectedText,
      placeholderText = 'type here',
      cancelText = 'cancel',
      submitText = 'submit',
      buttonClassName = 'blue-button',
      toolbarAttrs,
      listAttrs,
    },
  }) {
    const toolbarAppliedAttrs = { background: 'rgb(78, 242, 167)', ...toolbarAttrs };
    const listAppliedAttrs = {
      background: 'white', height: '400px', permanent: false, ...listAttrs,
    };

    return m('div', [
      m(
        Toolbar,
        {
          ...toolbarAppliedAttrs,
          compact: true,
          style: { ...toolbarAppliedAttrs.style, background: toolbarAppliedAttrs.background },
        },
        this.selected ? [
          m(IconButton, {
            icon: { svg: m.trust(icons.clear) },
            ink: false,
            events: {
              onclick: () => {
                if (this.onSelect) { this.onSelect(null); }
                this.selected = null;
              },
            },
          }),
          m(ToolbarTitle, { text: selectedText(this.selected) }),
          onSubmit
            ? m(Button, {
              label: submitText,
              className: buttonClassName,
              events: {
                onclick: () => {
                  onSubmit(this.selected);
                  this.selected = null;
                  controller.setSearch('');
                  controller.refresh();
                },
              },
            })
            : null,
        ]
          : [
            m(SearchField, Object.assign(
              {},
              {
                placeholderText,
                style: { background: toolbarAppliedAttrs.background },
                onChange: ({ value, focus }) => {
                  // onChange is called either if the value or focus of the SearchField
                  // changes.
                  // At value change we want to update the search
                  // at focus change we hide the list of results. As focus change also
                  // happens while clicking on an item in the list of results, the list
                  // is hidden after a short Timeout that has to be sufficiently long
                  // to register the onclick of the listitem. Can be a problem for different
                  // OS and browsers.
                  if (focus) {
                    this.showList = true;
                  } else if (!focus) {
                    // don't close the list immidiately, as 'out of focus' could
                    // also mean that the user is clicking on a list item
                    setTimeout(() => {
                      this.showList = false;
                      m.redraw();
                    }, 500);
                  }
                  if (value !== this.searchValue) {
                    // if we always update the search value, this would also happen
                    // immidiately in the moment where we click on the listitem.
                    // Then, the list get's updated before the click is registered.
                    // So, we make sure this state change is due to value change and
                    // not due to focus change.
                    this.searchValue = value;
                    controller.debouncedSearch(value);
                  }
                },
              },
            )),
            onCancel
              ? m(Button, {
                label: cancelText,
                className: buttonClassName,
                events: { onclick: onCancel },
              })
              : null,
          ],
      ),
      (this.showList || listAppliedAttrs.permanent) && !this.selected
        ? m(List, {
          ...listAppliedAttrs,
          style: {
            ...listAppliedAttrs.style,
            height: listAppliedAttrs.height,
            background: listAppliedAttrs.background,
          },
          tiles: m(infinite, controller.infiniteScrollParams(this.item())),
        })
        : null,
    ]);
  }
}
