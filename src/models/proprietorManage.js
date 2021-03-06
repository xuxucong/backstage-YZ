import {proprietorManage} from '../api';

export default {
    namespace : 'proprietorManage',
    state : {
        list: {}
    },
    effects : {
        * serch({ payload: params}, {call, put}){
            const {jsonResult} = yield call(proprietorManage.query, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    list: jsonResult.data
                }
            });
        },
        * detail({payload: params}, {call, put}) {            
            const {jsonResult} = yield call(proprietorManage.detail, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    detail: jsonResult.data
                }
            });
        },
        * approve({payload: {params,func}}, {call, put}) {
            if(!params.approveMemo){
                delete params.approveMemo
            }
            const {jsonResult} = yield call(proprietorManage.approve, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * save({payload: params}, {call, put}) {
            yield put({
                type: 'serchSuccess',
                payload: {
                    saveSeslect: params
                }
            });
        },

        // * answer({payload: {params,func}}, {call, put}) {
        //     const {jsonResult} = yield call(proprietorManage.answer, params);
        //     if (typeof func === 'function') {
        //         func();
        //     }
        // },
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