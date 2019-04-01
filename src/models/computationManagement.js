import {computationManagement} from '../api';
import {message} from 'antd';

export default {
    namespace : 'computationManagement',
    state : {
        data: []
    },
    reducers : {
        queryListSuccess(state, {payload}) {
            return {
                ...state,
                ...payload
            };
        }
    },
    effects : {
        * p_list({
            payload: params
        }, {call, put}) {

            const {jsonResult} = yield call(computationManagement.p_list, params);

            yield put({
                type: 'queryListSuccess',
                payload: {
                    pendingData: jsonResult.data
                }
            });
        },
        * p_save({
            payload: params
        }, {call, put}) {
            yield put({
                type: 'queryListSuccess',
                payload: {
                    p_data: params
                }
            });
        },
        * p_detail({
            payload: params
        }, {call, put}) {

            const {jsonResult} = yield call(computationManagement.p_detail, params);

            yield put({
                type: 'queryListSuccess',
                payload: {
                    pDetail: jsonResult.data
                }
            });
        },
        * p_add({ payload: {  params, func } }, { call, put }) {
            const { jsonResult } = yield call(computationManagement.p_add, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * p_delete({ payload: {  params, func } }, { call, put }) {
            const { jsonResult } = yield call(computationManagement.p_delete, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * p_update({
            payload: {
                params,
                func
            }
        }, {call, put}) {
            const {jsonResult} = yield call(computationManagement.p_update, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * h_list({
            payload: params
        }, {call, put}) {

            const {jsonResult} = yield call(computationManagement.h_list, params);

            yield put({
                type: 'queryListSuccess',
                payload: {
                    throughData: jsonResult.data
                }
            });
        },
        * h_save({
            payload: params
        }, {call, put}) {
            yield put({
                type: 'queryListSuccess',
                payload: {
                    h_data: params
                }
            });
        },
        * h_detail({
            payload: params
        }, {call, put}) {

            const {jsonResult} = yield call(computationManagement.h_detail, params);

            yield put({
                type: 'queryListSuccess',
                payload: {
                    hDetail: jsonResult.data
                }
            });
        },
        * h_add({ payload: {  params, func } }, { call, put }) {
            const { jsonResult } = yield call(computationManagement.h_add, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * h_delete({ payload: {  params, func } }, { call, put }) {
            const { jsonResult } = yield call(computationManagement.h_delete, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * h_update({
            payload: {
                params,
                func
            }
        }, {call, put}) {
            const {jsonResult} = yield call(computationManagement.h_update, params);
            if (typeof func === 'function') {
                func();
            }
        }
    }
};
