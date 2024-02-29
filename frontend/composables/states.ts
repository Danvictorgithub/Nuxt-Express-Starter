interface UserObj {
    username: string,
    id: number,
}
export const useUserObj = () => useState<UserObj>("userObj", () => {
    return {
        isLoggedIn: false,
        username: "",
        id: 0,
    }
});
