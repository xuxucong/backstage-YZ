import {channelAPI} from '../api';
import {message} from 'antd';

export default {
    namespace : 'channelAPI',
    state : {
        list: {}
    },
    effects : {
        * serch({ payload: params}, {call, put}){
            const {jsonResult} = yield call(channelAPI.query, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    list: jsonResult.data
                }
            });
        },
        * instAdd({
            payload: {
                params,
                func
            }
        }, {call, put}) {
            const {jsonResult} = yield call(channelAPI.instAdd, params);
            if (typeof func === 'function') {
                func();
            }

        },
        * save({
            payload: params
        }, {call, put}) {
            yield put({
                type: 'serchSuccess',
                payload: {
                    saveSeslect: params
                }
            });
        },
        * instDetail({
            payload: params
        }, {call, put}) {            
            const {jsonResult} = yield call(channelAPI.instDetail, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    ItemDetail: jsonResult.data
                }
            });
        },
        * instDelete({
        payload: {params, func}
        }, {call, put}) {
            const {jsonResult} = yield call(channelAPI.instDelete, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * update({
        payload: {
            params,
            func
        }
        }, {call, put}) {
            const {jsonResult} = yield call(channelAPI.instUpdate, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * getErrorData({
            payload: params
        }, {call, put}) {
            const {jsonResult} = yield call(abnormalityReport.queryError, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    errorData: jsonResult.data
                }
            });
        },
        * issueOrder({
            payload: params
        }, {call, put}) {
            const {jsonResult} = yield call(abnormalityReport.issueOrder, params);
        },
        * closeOrder({
            payload: params
        }, {call, put}) {
            const {jsonResult} = yield call(abnormalityReport.closeOrder, params);
        }
    },
    reducers : {
        serchSuccess(state, {payload}) {
            return {
                ...state,
                ...payload
            };
        }
    }
}