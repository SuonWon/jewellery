export const pause = (duration) => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
};