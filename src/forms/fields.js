import { isRequired, isUrl, isNumber as isNumberValidator, isEmail } from 'd2-ui/lib/forms/Validators';
import isString from 'd2-utilizr/lib/isString';
import isNumber from 'lodash.isnumber';
import log from 'loglevel';
import { config, getInstance } from 'd2/lib/d2';

// FormField components
import TextField from './form-fields/text-field';
import MultiSelect from './form-fields/multi-select';
import CheckBox from './form-fields/check-box';
import DropDown from './form-fields/drop-down';
import DropDownAsync from './form-fields/drop-down-async';
import DateSelect from './form-fields/date-select';

export const CHECKBOX = Symbol('CHECKBOX');
export const INPUT = Symbol('INPUT');
export const SELECT = Symbol('SELECT');
export const SELECTASYNC = Symbol('SELECTASYNC');
export const MULTISELECT = Symbol('MULTISELECT');
export const TEXT = Symbol('TEXT');
export const DATE = Symbol('DATE');
export const INTEGER = Symbol('INTEGER');
export const IDENTIFIER = Symbol('IDENTIFIER');
export const URL = Symbol('URL');
export const EMAIL = Symbol('EMAIL');
export const NUMBER = Symbol('NUMBER');

config.i18n.strings.add(isRequired.message);
config.i18n.strings.add(isUrl.message);
config.i18n.strings.add(isNumberValidator.message);
config.i18n.strings.add(isEmail.message);
config.i18n.strings.add('value_not_max');
config.i18n.strings.add('value_not_min');
config.i18n.strings.add('value_not_max');
config.i18n.strings.add('value_not_min');
config.i18n.strings.add('could_not_run_async_validation');
config.i18n.strings.add('value_not_unique');

function toInteger(value) {
    return Number.parseInt(value, 10);
}

function isIntegerValidator(value) {
    if (isString(value) && /\./.test(value)) {
        return false;
    }
    return Number.parseInt(value, 10) === Number.parseFloat(value);
}
isIntegerValidator.message = 'number_should_not_have_decimals';

function createValidatorFromValidatorFunction(validatorFn) {
    return {
        validator: validatorFn,
        message: validatorFn.message,
    };
}

function addValidatorForType(type, modelValidation, modelDefinition) {
    function maxNumber(value) {
        return Number(value) <= modelValidation.max;
    }
    maxNumber.message = 'value_not_max';

    function minNumber(value) {
        return Number(value) >= modelValidation.min;
    }
    minNumber.message = 'value_not_min';

    function maxTextOrArray(value) {
        return !value || value.length <= modelValidation.max;
    }
    maxTextOrArray.message = 'value_not_max';

    function minTextOrArray(value) {
        return !value || value.length >= modelValidation.min;
    }
    minTextOrArray.message = 'value_not_min';

    const validators = [];

    switch (type) {
    case NUMBER:
        validators.push(createValidatorFromValidatorFunction(isNumberValidator));
        break;
    case INTEGER:
        validators.push(createValidatorFromValidatorFunction(isNumberValidator));
        validators.push(createValidatorFromValidatorFunction(isIntegerValidator));

        if (isNumber(modelValidation.max)) {
            validators.push(createValidatorFromValidatorFunction(maxNumber));
        }

        if (isNumber(modelValidation.min)) {
            validators.push(createValidatorFromValidatorFunction(minNumber));
        }
        break;
    case IDENTIFIER:
    case INPUT:
        if (isNumber(modelValidation.max)) {
            validators.push(createValidatorFromValidatorFunction(maxTextOrArray));
        }

        if (isNumber(modelValidation.min)) {
            validators.push(createValidatorFromValidatorFunction(minTextOrArray));
        }

        break;
    case URL:
        validators.push(createValidatorFromValidatorFunction(isUrl));
        break;
    case EMAIL:
        validators.push(createValidatorFromValidatorFunction(isEmail));
    default:
        break;
    }

    return validators;
}

function getValidatorsFromModelValidation(modelValidation, modelDefinition) {
    let validators = [];

    if (modelValidation.required) {
        validators.push(createValidatorFromValidatorFunction(isRequired));
    }

    if (modelDefinition) {
        validators = validators.concat(addValidatorForType(modelValidation.type, modelValidation, modelDefinition));
    }

    return validators;
}

function getAsyncValidatorsFromModelValidation(modelValidation, modelDefinition, uid) {


    if (modelValidation.unique) {
        // TODO: Add asyncValidator
        return [checkAgainstServer];
    }
    return [];
}

function getFieldUIComponent(type) {
    switch (type) {
    case SELECT:
        return DropDown;
    case SELECTASYNC:
        return DropDownAsync;
    case CHECKBOX:
        return CheckBox;
    case MULTISELECT:
        return MultiSelect;
    case DATE:
        return DateSelect;
    case EMAIL:
    case INPUT:
    case IDENTIFIER:
    default:
        break;
    }
    return TextField;
}

export function createFieldConfig(fieldConfig, modelDefinition, models, model) {
    const basicFieldConfig = {
        name: fieldConfig.name,
        component: fieldConfig.component || getFieldUIComponent(fieldConfig.type),
        props: Object.assign(fieldConfig.fieldOptions || {}, {
            labelText: fieldConfig.fieldOptions.labelText,
            modelDefinition: modelDefinition,
            models: models,
            referenceType: fieldConfig.referenceType,
            referenceProperty: fieldConfig.name,
            isInteger: fieldConfig.type === INTEGER,
            multiLine: fieldConfig.name === 'description',
            fullWidth: true,
            translateOptions: fieldConfig.constants && !!fieldConfig.constants.length,
            isRequired: fieldConfig.required,
            options: (fieldConfig.fieldOptions.options || fieldConfig.constants || [])
                .map((constant) => {
                    if (constant.name && constant.value) {
                        return {
                            text: constant.name,
                            value: constant.value,
                        };
                    }

                    return {
                        text: constant,
                        value: constant.toString(),
                    };
                }),
        }),
    };

    // Checkbox fields should not be marked as required
    // This looks strange from a ui perspective as the user looks like he/she needs to check the box
    if (fieldConfig.type === CHECKBOX) {
        basicFieldConfig.props.isRequired = false;
    }

    if (fieldConfig.constants && fieldConfig.constants.length) {
        basicFieldConfig.translate = true;
    }

    const validators = [].concat(getValidatorsFromModelValidation(fieldConfig, modelDefinition));

    return Object.assign(fieldConfig, { validators }, basicFieldConfig);
}

export const typeToFieldMap = new Map([
    ['BOOLEAN', CHECKBOX],
    ['CONSTANT', SELECT],
    ['IDENTIFIER', IDENTIFIER], // TODO: Add identifiers for the type of field...
    ['REFERENCE', SELECTASYNC],
    ['TEXT', INPUT],
    ['EMAIL', EMAIL],
    ['PHONENUMBER', INPUT],
    ['COLLECTION', MULTISELECT],
    ['INTEGER', INTEGER],
    ['DATE', DATE],
    ['URL', URL],
    ['NUMBER', NUMBER],
]);
