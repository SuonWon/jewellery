export const pause = (duration) => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
};

export const currentDate = new Date().toISOString();

export const apiUrl = "http://localhost:3005/";