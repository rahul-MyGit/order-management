import Redis from 'ioredis';
import {ENV} from '../config/index'

const redis = new Redis(ENV.REDIS_URL);

export const get = async (key: string) => {
    return await redis.get(key);
};

export const setex = async (key: string, seconds: number, value: string) => {
    await redis.setex(key, seconds, value);
};

export const exists = async (key: string) => {
    return await redis.exists(key);
};

export const quit = async () => {
    await redis.quit();
};
