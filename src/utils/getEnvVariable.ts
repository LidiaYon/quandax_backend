import * as dotenv from "dotenv";
dotenv.config();

export const getEnvVariable = (key: string, errorOnUndefined = true): string => {
  
    const value = process.env[key];

    if (value === undefined || value === null) {
        if (errorOnUndefined) {
            const msg = `The environment variable ${key} is not set.`;
            throw new Error(msg);
        }
        return "";
    }
    return value;
};