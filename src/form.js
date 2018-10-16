import m from 'mithril';
import Ajv from 'ajv';
import { Checkbox } from 'polythene-mithril';
import { TextInput, DatetimeInput, NumInput } from './inputFields';
import { RadioGroup } from './radioGroup';
import Select from './select';

export default class Form {
  /**
   * Requires:
   * - call constructor with vnode, resource, (valid, true by default)
   * - vnode.attrs.onfinish has to be a callback function that is called after
   *   the edit is finished
   *
   * @param {object}  _vnode              as provided by mithril
   * @param {boolean} valid               whether the view should be valid before the first
   *                                      validation
   * @param {number}  enumSelectThreshold enums with more values are rendered with a Select input.
   *                                      Enum fields with number of values below the threshold are
   *                                      rendered using RadioGroups.
   * @param {object}  initialData         initial data for the form
   */
  constructor(_vnode, valid = true, enumSelectThreshold = 4, initialData = {}) {
    this.data = initialData;
    this.enumSelectThreshold = enumSelectThreshold;
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
   * Uses [AJV](https://ajv.js.org/)
   *
   * @param {object}  schema  jsonschema
   */
  setSchema(schema) {
    // clean the schema of any keys that ajv does not like
    const objectSchema = Object.assign({}, schema);
    // filter out any field that is not understood by the validator tool
    Object.keys(objectSchema.properties).forEach((property) => {
      if (objectSchema.properties[property].type === 'media' ||
          objectSchema.properties[property].type === 'json_schema_object') {
        objectSchema.properties[property].type = 'object';
      }
      if (objectSchema.properties[property].format === 'objectid') {
        delete objectSchema.properties[property];
      } else if (objectSchema.properties[property].nullable) {
        // translate nullable field from OpenAPI specification to
        // possible type null in jsonschema
        objectSchema.properties[property].type = [
          'null',
          objectSchema.properties[property].type,
        ];
        if ('enum' in objectSchema.properties[property]) {
          objectSchema.properties[property].enum.push(null);
        }
      }
    });
    this.schema = objectSchema;
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
   * Rendering function to render the whole schema.
   *
   * @param  {object|array|null} fields to be rendered.
   *                             - Object containing a valid JSON schema.
   *                               Additional properties (not defined by JSON schema)
   *                               are handed directly to the input field component.
   *                             - Array containing a list of field names to be rendered
   *                               from the existing JSON schema.
   *                             - Null means that the full existing JSON schema is rendered.
   * @return {string}            mithril rendered output
   */
  renderSchema(fields = null) {
    if (Array.isArray(fields)) {
      // render specified fields from JSON schema.
      return fields.map((key) => {
        const property = this.schema.properties[key];
        return this._renderField(key, property);
      });
    }

    if (fields === null) {
      // render full JSON schema.
      return Object.keys(this.schema.properties).map((key) => {
        const property = this.schema.properties[key];
        return this._renderField(key, property);
      });
    }

    if (!fields.properties) {
      // invalid JSON schema
      return m('');
    }

    // render given JSON schema.
    return Object.keys(fields.properties).map((key) => {
      const property = fields.properties[key];
      return this._renderField(key, property);
    });
  }

  /**
   * get the current form data state
   */
  getData() {
    return this.data;
  }

  /**
   * Renders a single field.
   */
  _renderField(key, field) {
    const attrs = field;

    if (field.enum) {
      attrs.name = key;
      attrs.label = field.label || field.title;

      if (field.enum.length < this.enumSelectThreshold) {
        // below threshold -> render as RadioGroup
        attrs.buttons = field.enum.map(item => ({
          value: item,
          label: item,
        }));
        delete attrs.enum;
        return m(RadioGroup, this.bind(attrs));
      }

      // above threshold -> render as Select field
      attrs.options = field.enum;
      delete attrs.enum;
      return m(Select, this.bind(attrs));
    } else if (field.type === 'string') {
      if (field.format === 'date-time') {
        attrs.name = key;
        attrs.label = field.label || field.title;
        delete attrs.type;
        delete attrs.format;
        return m(DatetimeInput, this.bind(attrs));
      }

      attrs.floatingLabel = true;
      delete attrs.type;
      return m(TextInput, this.bind(attrs));
    } else if (field.type === 'number') {
      attrs.name = key;
      attrs.label = field.label || field.title;
      attrs.floatingLabel = true;
      delete attrs.type;
      return m(NumInput, this.bind(attrs));
    } else if (field.type === 'boolean') {
      attrs.checked = this.data[key] || false;
      attrs.label = field.label || field.title;
      attrs.onChange = ({ checked }) => {
        this.data[key] = checked;
      };
      delete attrs.type;
      return m(Checkbox, attrs);
    }
    return `key '${key}' not found`;
  }
}
