export const isAuthenticated = () => {
    const token = localStorage.getItem('acess');
    

    return token ? true : false;
};