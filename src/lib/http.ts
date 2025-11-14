import axios, { AxiosRequestConfig } from 'axios';

// type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

export const Http = async (
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    data?: any,
    headers?: Record<string, string>,
    config?: Omit<AxiosRequestConfig, 'method' | 'url' | 'data' | 'headers'>
): Promise<any> => {
    const instance = axios.create({
        timeout: 19500,
        headers: {
            Accept: '*/*',
            ...headers,
        },
    });

    const response = await instance.request({
        method,
        url,
        data,
        ...config,
    });
    return response;
};