import m from 'mithril';
import { TextField } from 'polythene-mithril';


export class textInput {
  /*
   * text input field with error handling
   * 
   * Attrs:
   *   name: string
   *     key assigned to this input
   *   getErrors: function()
   *     This function is called at every view() to get the errors
   *     for the input field. This allows updates of all form field errors
   *     with a simple `m.redraw()`.
   *   onChange: function(name, value)
   *     this function is called every time that the value of the input changes
   *   ...attrs:
   *     any additional attributes are passed to the 'TextField' of polythene
   */
  constructor({ attrs: { getErrors, name } }) {
    // Link the error-getting function from the binding
    this.getErrors = () => [];
    this.name = name;
    if (getErrors) {
      this.getErrors = getErrors;
    }
    this.value = '';
  }

  view({ attrs }) {
    // set display-settings accoridng to error-state
    const errors = this.getErrors();

    const attributes = Object.assign({}, attrs);
    attributes.valid = errors.length === 0;
    attributes.error = errors.join(', ');
    attributes.style = Object.assign({
      'margin-top': '-10px',
      'margin-bottom': '-10px',
    }, attributes.style);
    attributes.onChange = ({ value }) => {
      if (value !== this.value) {
        this.value = value;
        attrs.onChange(this.name, value);
      }
    };
    return m(TextField, attributes);
  }
}

export class numInput extends textInput {
  /*
   * number input field with error handling
   * 
   * Attrs:
   *   name: string
   *     key assigned to this input
   *   getErrors: function()
   *     This function is called at every view() to get the errors
   *     for the input field. This allows updates of all form field errors
   *     with a simple `m.redraw()`.
   *   onChange: function(name, value)
   *     this function is called every time that the value of the input changes
   *   ...attrs:
   *     any additional attributes are passed to the 'TextField' of polythene
   */
  view({ attrs }) {
    // set display-settings accoridng to error-state
    const errors = this.getErrors();

    const attributes = Object.assign({}, attrs);
    attributes.type = 'number';
    attributes.valid = errors.length === 0;
    attributes.error = errors.join(', ');
    attributes.style = Object.assign({
      'margin-top': '-10px',
      'margin-bottom': '-10px',
    }, attributes.style);
    attributes.onChange = ({ value }) => {
      if (value !== this.value) {
        this.value = value;
        attrs.onChange(this.name, parseInt(value, 10));
      }
    };
    return m(TextField, attributes);
  }
}

export class datetimeInput {
  /*
   * input field for datetime with error handling
   * 
   * Attrs:
   *   name: string
   *     key assigned to this input
   *   label: string
   *     label shown with this input field, has to fit into 200px
   *   value: (optional)
   *     initial value of the field, in form such that it is parsable by Date(value)
   *   getErrors: function()
   *     This function is called at every view() to get the errors
   *     for the input field. This allows updates of all form field errors
   *     with a simple `m.redraw()`.
   *   onChange: function(name, value)
   *     this function is called every time that the value of the input changes
   *   ...attrs:
   *     any additional attributes are passed to the 'TextField' of polythene
   */
  constructor({ attrs: { getErrors, name, onChange } }) {
    // Link the error-getting function from the binding
    this.getErrors = () => [];
    this.name = name;
    if (getErrors) { this.getErrors = getErrors; }
    this.value = '';
    this.date = false;
    this.time = false;
    this.onChangeCallback = onChange;
  }

  onChange() {
    if (this.date && this.time) {
      const date = new Date(this.date);
      const splitted = this.time.split(':');
      date.setHours(splitted[0]);
      date.setMinutes(splitted[1]);
      if (this.onChangeCallback) {
        // the ISO String contains 3 positions for microseconds, this kind of fomrat
        // is not accepted by the API
        this.onChangeCallback(this.name, `${date.toISOString().slice(0, -5)}Z`);
      }
    }
  }

  view({ attrs: { label, value } }) {
    // set display-settings accoridng to error-state
    const errors = this.getErrors();
    let initialDate;
    let initialTime;
    if (value) {
      const parsed = new Date(value);
      // convert to locale timezone
      const locale = {
        year: parsed.getFullYear(),
        month: `${parsed.getMonth()}`.padStart(2, '0'),
        date: `${parsed.getDate()}`.padStart(2, '0'),
        hour: `${parsed.getHours()}`.padStart(2, '0'),
        minute: `${parsed.getMinutes()}`.padStart(2, '0'),
      };
      initialDate = `${locale.year}-${locale.month}-${locale.date}`;
      initialTime = `${locale.hour}:${locale.minute}`;
    }

    const date = {
      type: 'date',
      style: {
        width: '150px',
        float: 'left',
      },
      onChange: ({ value: newDate }) => {
        if (newDate !== this.date) {
          this.date = newDate;
          this.onChange();
        }
      },
      valid: errors.length === 0,
      error: errors.join(', '),
      value: this.date || initialDate,
    };

    const time = {
      type: 'time',
      style: {
        width: '100px',
      },
      onChange: ({ value: newTime }) => {
        if (newTime !== this.time) {
          this.time = newTime;
          this.onChange();
        }
      },
      valid: errors.length === 0,
      value: this.time || initialTime,
    };
    return m('div', [
      m(TextField, {
        label,
        disabled: true,
        style: {
          width: '200px',
          float: 'left',
        },
      }),
      m(TextField, date),
      m(TextField, time),
    ]);
  }
}


export class fileInput {
  /*
   * file input field with error handling
   * 
   * Attrs:
   *   name: string
   *     key assigned to this input
   *   label: string
   *     label shown with this input field, has to fit into 200px
   *   getErrors: function()
   *     This function is called at every view() to get the errors
   *     for the input field. This allows updates of all form field errors
   *     with a simple `m.redraw()`.
   *   onChange: function(name, file)
   *     this function is called every time that the file changes
   *   ...attrs:
   *     any additional attributes are passed to the 'TextField' of polythene
   */
  constructor({ attrs: { getErrors, name, onChange } }) {
    // Link the error-getting function from the binding
    this.getErrors = () => [];
    this.name = name;
    if (getErrors) { this.getErrors = getErrors; }
    this.onChangeCallback = onChange;
    this.file = null;
  }

  view({ attrs: { label, accept } }) {
    // set display-settings accoridng to error-state
    const errors = this.getErrors();

    const image = {
      type: 'file',
      accept,
      onchange: ({ target: { files: [file] } }) => {
        if (file !== this.file) {
          // as we only accept one file, it is always the first element
          // of the list
          this.file = file;
          console.log(this.file);
          this.onChangeCallback(this.name, this.file);
        }
      },
    };

    return m('div', { style: { display: 'flex' } }, [
      m(TextField, {
        label,
        disabled: true,
        style: {
          width: '200px',
          float: 'left',
        },
        valid: errors.length === 0,
        error: errors.join(', '),
      }),
      m('input', image),
    ]);
  }
}