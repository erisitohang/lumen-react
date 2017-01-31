/**
 * Import all ActionType as an object.
 */
import * as ActionType from '../constants/actionType';

/**
 * Import all apiAction as an object.
 */
import * as apiAction from './apiAction';

/**
 * Import all apiService as an object.
 */
import * as apiService from '../services/apiService';

/**
 * Import all converter as an object.
 */
import * as Converter from '../utils/converter';

/**
 * Actions that are dispatched from crudAction
 */
var commonActions = {
    list: function (entity, data) {
        return {
            type: ActionType.LIST,
            entity: entity,
            data: data
        }
    },

    selectItem: function (entity, data) {
        return {
            type: ActionType.SELECT_ITEM,
            entity: entity,
            data: data
        }
    },

    delete: function (entity, id) {
        return {
            type: ActionType.DELETE,
            entity: entity,
            id: id
        }
    },

};

/**
 * These are the actions every CRUD in the application uses.
 *
 * Every time an action that requires the API is called, it first Dispatches an "apiRequest" action.
 *
 * ApiService returns a promise which dispatches another action "apiResponse".
 *
 * entity = 'Product', 'Employee', ...
 */


export function fetchAll(entity, data) {
    return function (dispatch) {
        dispatch(apiAction.apiRequest());
        return apiService.fetch(entity, data).then((response) => {
            dispatch(commonActions.list(entity, response.data));
        })
            .catch(response => dispatch(errorHandler(response.data.error)));
    };
}

export function fetchById(entity, id) {
    return function (dispatch) {
        dispatch(apiAction.apiRequest());
        return apiService.fetch(Converter.getPathParam(entity, id)).then((response) => {
            dispatch(commonActions.selectItem(entity, response.data));
        })
            .catch(response => dispatch(errorHandler(response.data.error)));
    };
}

export function updateSelectedItem(entity, key, value) {
    return {
        type: ActionType.UPDATE_SELECTED_ITEM,
        entity: entity,
        key: key,
        value: value
    }
}

export function errorHandler(dispatch, error, type) {
    let errorMessage = (error.data.error) ? error.data.error : error.data;

    // NOT AUTHENTICATED ERROR
    if (error.status === 401) {
        errorMessage = 'You are not authorized to do this. Please login and try again.';
    }

    dispatch({
        type,
        payload: errorMessage,
    });
}