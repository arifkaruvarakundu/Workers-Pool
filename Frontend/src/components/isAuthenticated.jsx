export const isAuthenticated = () => {
    const token = localStorage.getItem('access');
    return token ? true : false;
};