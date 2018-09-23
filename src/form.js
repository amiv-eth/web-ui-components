import m from 'mithril';
import Ajv from 'ajv';
import { Checkbox } from 'polythene-mithril';
import { textInput, datetimeInput, numInput } from './inputFields';

export default class Form {
  /**
   * Requires:
   * - call constructor with vnode, resource, (valid, true by default)
   * - vnode.attrs.onfinish has to be a callback function that is called after
   *   the edit is finished
   * @param  {object} vnode   [as provided by mithril]
   * @param  {object} embedded  [any embedding query that should be added
   *                             to API requests for this resource]
   * @param  {Boolean} valid    [whether the view should be valid before the
   *                             first validation]
   * @param  {object} initialData   [initial data for the form]
   */
  constructor(vnode, valid = true, initialData = {}) {
    this.data = initialData;
    this.changed = false;
    // state for validation
    this.valid = valid;
    this.ajv = new Ajv({
      missingRefs: 'ignore',
      errorDataPath: 'property',
      allErrors: true,
    });
    this.errors = {};
  }

  /**
   * Sets the schema to validate this form.
   *
   * @param      {object}  schema  [jsonschema]
   */
  setSchema(schema) {
    // clean the schema of any keys that ajv does not like
    const objectSchema = Object.assign({}, schema);
    // console.log(objectSchema);
    // filter out any field that is not understood by the validator tool
    Object.keys(objectSchema.properties).forEach((property) => {
      if (objectSchema.properties[property].type === 'media' ||
          objectSchema.properties[property].type === 'json_schema_object') {
        objectSchema.properties[property].type = 'object';
      }
      if (objectSchema.properties[property].format === 'objectid') {
        delete objectSchema.properties[property];
      }
      // translate nullable field from OpenAPI specification to
      // possible type null in jsonschema
      if (objectSchema.properties[property].nullable) {
        objectSchema.properties[property].type = [
          'null',
          objectSchema.properties[property].type,
        ];
      }
    });
    this.ajv.addSchema(objectSchema, 'schema');
  }

  /**
   * bind form-fields to the object data and validation
   *
   * A binded form-field automatically updates this.data and calls validation
   * on the current data state with every change.
   *
   * @param  {object} options for the input element
   * @return {object} modified options passed to the input element
   */
  bind(attrs) {
    // initialize error-list for every bound field
    if (!this.errors[attrs.name]) this.errors[attrs.name] = [];

    const boundFormelement = {
      onChange: (name, value) => {
        this.changed = true;
        // bind changed data
        this.data[name] = value;

        console.log(this.data);

        this.validate();
      },
      getErrors: () => this.errors[attrs.name],
      value: this.data[attrs.name],
    };
    // add the given attributes
    Object.keys(attrs).forEach((key) => { boundFormelement[key] = attrs[key]; });

    return boundFormelement;
  }

  validate() {
    // validate against schema
    const validate = this.ajv.getSchema('schema');
    // sometimes the schema loading does not work or is not finished
    // before the first edit, this is to prevent crashes
    if (validate) {
      this.valid = validate(this.data);
      if (this.valid) {
        Object.keys(this.errors).forEach((field) => {
          this.errors[field] = [];
        });
      } else {
        // get errors for respective fields
        Object.keys(this.errors).forEach((field) => {
          const errors = validate.errors.filter(error =>
            `.${field}` === error.dataPath);
          this.errors[field] = errors.map(error => error.message);
        });
      }
    }
    m.redraw();
  }

  /**
   * Rendering Function to make form descriptions shorter
   *
   * @param  {object} Collection of descriptions for input form fields
   *                  {key: description}
   *                  with key matching the field in this.data
   *                  description containing type in ['text', 'number',
   *                  'checkbox', 'datetime'] and any attributes passed to the
   *                  input element
   * @return {string} mithril rendered output
   */
  renderPage(page) {
    return Object.keys(page).map((key) => {
      const field = page[key];
      if (field.type === 'text') {
        field.name = key;
        field.floatingLabel = true;
        delete field.type;
        return m(textInput, this.bind(field));
      } else if (field.type === 'number') {
        field.name = key;
        field.floatingLabel = true;
        delete field.type;
        return m(numInput, this.bind(field));
      } else if (field.type === 'checkbox') {
        field.checked = this.data[key] || false;
        field.onChange = ({ checked }) => {
          this.data[key] = checked;
        };
        delete field.type;
        return m(Checkbox, field);
      } else if (field.type === 'datetime') {
        field.name = key;
        delete field.type;
        return m(datetimeInput, this.bind(field));
      }
      return `key '${key}' not found`;
    });
  }

  /**
   * get the current form data state
   */
  getData() {
    return this.data;
  }
}
