const fieldOrderByName = new Map([
    ['dataElement', [
        'name', 'shortName', 'code', 'description', 'formName', 'domainType', 'valueType', 'aggregationType',
        'zeroIsSignificant', 'url', 'categoryCombo', 'optionSet', 'commentOptionSet', 'legendSet', 'aggregationLevels']],
    ['dataElementGroup', ['name', 'shortName', 'code', 'description', 'dataElements']],
    ['dataElementGroupSet', ['name', 'shortName', 'code', 'description', 'compulsory', 'dataDimension', 'dataElementGroups']],
    ['category', ['name', 'shortName', 'code', 'description', 'dataDimensionType', 'dataDimension', 'categoryOptions']],
    ['categoryOption', ['name', 'shortName', 'code', 'description', 'startDate', 'endDate', 'organisationUnits']],
    ['categoryCombo', ['name', 'shortName', 'code', 'dataDimensionType', 'skipTotal', 'categories']],
    ['categoryOptionGroup', ['name', 'shortName', 'code', 'description', 'dataDimensionType', 'categoryOptions']],
    ['categoryOptionGroupSet', ['name', 'description', 'dataDimension', 'dataDimensionType', 'categoryOptionGroups']],
    ['indicator', ['name', 'shortName', 'code', 'description', 'annualized', 'decimals', 'indicatorType', 'legendSet', 'url']],
    ['indicatorGroup', ['name', 'indicators']],
    ['indicatorType', ['name', 'factor', 'number']],
    ['indicatorGroupSet', ['name', 'description', 'compulsory', 'indicatorGroups']],
    ['dataSet', [
        'name',
        'shortName',
        'code',
        'description',
        'expiryDays',
        'openFuturePeriods',
        'timelyDays',
        'periodType',
        'categoryCombo',
        'notificationRecipients',
        'notifyCompletingUser',
        'workflow',
        'mobile',
        'fieldCombinationRequired',
        'validCompleteOnly',
        'noValueRequiresComment',
        'legendSet',
        'skipOffline',
        'dataElementDecoration',
        'renderAsTabs',
        'renderHorizontally',
        'dataElements',
        'indicators',
    ]],
    ['organisationUnit', [
        'name',
        'shortName',
        'code',
        'description',
        'openingDate',
        'closedDate',
        'comment',
        'url',
        'contactPerson',
        'address',
        'email',
        'phoneNumber',
    ]],
    ['organisationUnitGroup', [
        'name',
        'shortName',
        'code',
        'description',
        'symbol',
        'organisationUnits',
    ]],
    ['organisationUnitGroupSet', [
        'name',
        'shortName',
        'code',
        'description',
        'compulsory',
        'dataDimension',
        'organisationUnitGroups',
    ]],
    ['organisationUnitLevel', [
        'name',
        'offlineLevels',
    ]],
    ['constant', [
        'name',
        'shortName',
        'code',
        'description',
        'value',
    ]],
    ['attribute', [
        'name',
        'code',
        'valueType',
        'optionSet',
        'mandatory',
        'unique',
        'dataElementAttribute',
        'dataElementGroupAttribute',
        'indicatorAttribute',
        'indicatorGroupAttribute',
        'dataSetAttribute',
        'organisationUnitAttribute',
        'organisationUnitGroupAttribute',
        'organisationUnitGroupSetAttribute',
        'userAttribute',
        'userGroupAttribute',
        'programAttribute',
        'programStageAttribute',
        'trackedEntityAttribute',
        'trackedEntityAttributeAttribute',
        'categoryOptionAttribute',
        'categoryOptionGroupAttribute',
        'documentAttribute',
        'optionAttribute',
        'optionSetAttribute',
        'constantAttribute',
        'legendSetAttribute',
    ]],
]);

export default {
    /**
     * @method
     *
     * @params {String} schemaName The name of the schema for which to get the field order
     * @returns {Array} An arraylist of field names
     * This can be used to set field order on the `FormFieldsManager`
     *
     * @example
     * ```
     * import fieldOverrides from 'field-overrides';
     *
     * let dataElementOverrides = fieldOverrides.for('dataElement');
     * ```
     */
    for(schemaName) {
        if (schemaName && fieldOrderByName.has(schemaName)) {
            return fieldOrderByName.get(schemaName);
        }
        return ['name', 'shortName', 'code'];
    },
};
