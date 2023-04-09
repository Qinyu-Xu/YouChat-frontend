/**
 * @note 本文件是一个网络请求 wrapper 示例，其作用是将所有网络请求汇总到一个函数内处理
 *       我们推荐你在大作业中也尝试写一个网络请求 wrapper，本文件可以用作参考
 */

import axios, {AxiosError} from "axios";

const network = axios.create({
    baseURL: "",
});

enum NetworkErrorType {
    CORRUPTED_RESPONSE,
    UNKNOWN_ERROR,
}

export class NetworkError extends Error {
    type: NetworkErrorType;
    message: string;

    constructor(
        _type: NetworkErrorType,
        _message: string,
    ) {
        super();

        this.type = _type;
        this.message = _message;
    }

    toString(): string { return this.message; }
    valueOf(): Object { return this.message; }
}

export const request = async (
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    data?: any,
) => {
    const response = await network.request({ method, url, data })
        .catch((err: AxiosError) => {
            if(err.code === 'ERR_BAD_REQUEST') {
                return {
                    data: {
                        code: 1,
                        info: "Error: Not Found!"
                    }
                };
            }
        });
    if (response?.data.code === 0) {
        return { ...response.data, code: 0 };
    } else {
        return { ...response?.data };
    }
};

const csrf_token = async () => {
    return await request('api/csrf/get_token', 'GET', '');
}

const get_token = () => {
    csrf_token().then((res: any) => {
        const token = res.token;
        network.interceptors.request.use(config => {
            config.headers['X-CSRFToken'] = token;
            return config;
        });
    });
};

get_token();