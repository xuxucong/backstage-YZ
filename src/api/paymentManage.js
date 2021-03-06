import xFetch, {get, post} from '../util/xFetch';
import Service from '../service';

const API = {
    query: `/${Service.platformType}/user/room/bind/list`, //查询
    detail: `/${Service.platformType}/user/room/bind/detail`, //详情
}

export const query = async(params) => post(API.query, params);
export const detail = async(params) => post(API.detail, params);
