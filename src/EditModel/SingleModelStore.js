import Store from 'd2-flux/store/Store';
import {getInstance as getD2}  from 'd2';
import Rx from 'rx';

function loadModelFromD2(objectType, objectId) {
    return getD2().then(d2 => {
        if (d2.models[objectType]) {
            return d2.models[objectType]
                .get(objectId, objectType === 'dataElement' ? {fields: ':all,dataElementGroups[id,name,dataElementGroupSet[id]]'} : undefined);
        }
        return Promise.reject('Invalid model');
    });
}

const singleModelStoreConfig = {
    getObjectOfTypeById({objectType, objectId}) {
        loadModelFromD2(objectType, objectId)
            .then(model => {
                this.setState(model);
            });
    },

    getObjectOfTypeByIdAndClone({objectType, objectId}) {
        loadModelFromD2(objectType, objectId)
            .then(model => {
                model.id = undefined;
                this.setState(model);
            });
    },

    save() {
        const importResultPromise = this.state.save()
            .then(response => {
                if (response.response.importCount.imported === 1) {
                    return response;
                }

                if (response.response.importConflicts && response.response.importConflicts.length > 0) {
                    return Promise.reject(response.response.importConflicts[0].value);
                }
                return Promise.reject('Failed to save');
            });

        return Rx.Observable.fromPromise(importResultPromise);
    },
};

export default {
    create(config) {
        const storeConfig = Object.assign({}, singleModelStoreConfig, config || {});

        return Store.create(storeConfig);
    },
};