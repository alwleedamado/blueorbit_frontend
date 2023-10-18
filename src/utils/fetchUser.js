export const fetchUser =() => {
    const userProfile = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();
    return userProfile;
}