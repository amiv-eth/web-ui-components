# UI Components for AMIV Web Apps

A sparse collection of UI components to be used together with mithril and polythene.

# Components

## ListSelect
A component to select an item out of an API resource, e.g. a user.

![empty](https://gitlab.ethz.ch/amiv/web-ui-components/raw/master/docs/listselect/empty.png)  
![list for selection](https://gitlab.ethz.ch/amiv/web-ui-components/raw/master/docs/listselect/listopen.png)  
![selected](https://gitlab.ethz.ch/amiv/web-ui-components/raw/master/docs/listselect/selected.png)  
![submission](https://gitlab.ethz.ch/amiv/web-ui-components/raw/master/docs/listselect/submission.png)

## Input Fields
Input fields are all set up to display errors. These errors are e.g. set by the `Form` class that validates a full form against a jsonschema.

### Text Input
![text input](https://gitlab.ethz.ch/amiv/web-ui-components/raw/master/docs/inputfields/textinput.png)  
![error](https://gitlab.ethz.ch/amiv/web-ui-components/raw/master/docs/inputfields/texterror.png)

### Number Input
number input is not very well supported by modern browsers, use with caution.

![number input](https://gitlab.ethz.ch/amiv/web-ui-components/raw/master/docs/inputfields/number.png)  

### Date Time Input
Selection of date and time is build out of html date and time input types (as there is no datetime type that is widely supported yet).
The input field uses the native date selector from the browser.

![date time input](https://gitlab.ethz.ch/amiv/web-ui-components/raw/master/docs/inputfields/datetime.png)  
![selection of date](https://gitlab.ethz.ch/amiv/web-ui-components/raw/master/docs/inputfields/dateselection.png)  

### File Input
This field designed to fit into the standard material design forms while still relying mostly on native elements of the browsers.
![file input](https://gitlab.ethz.ch/amiv/web-ui-components/raw/master/docs/inputfields/file.png)

## Dropdown Card
A card that is collapsed by default and expands when selected, to hide content that would otherwise take too much screenspace.

![card closed](https://gitlab.ethz.ch/amiv/web-ui-components/raw/master/docs/dropdowncard/closed.png)  
![card open](https://gitlab.ethz.ch/amiv/web-ui-components/raw/master/docs/dropdowncard/open.png)  