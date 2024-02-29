export default defineNuxtPlugin(async () => {
    const token = useCookie('token');
    const API = useRuntimeConfig().public.API;
    if (token.value === undefined) {
        // return await navigateTo('/login'); 
    }
    else {
        // Verify token
        let isInvalidToken = null;
        const result: any = await $fetch<{
            email: string,
            id: number,
            cartCount: number,
        }>(`${API}/users/validate`, {
            headers: {
                Authorization: `Bearer ${token.value}`,
                ContentType: 'application/json',
            },
            method: 'GET',
        }).catch(async () => {
            isInvalidToken = true;
        });
        if (isInvalidToken) {
            const token = useCookie('token');
            token.value = null;
            // return await navigateTo('/login',{ redirectCode: 301 });
        }
        if (result) {
            const userObj = useUserObj();
            userObj.value = { ...result, isLoggedIn: true };
            // await navigateTo('/validated')
        }
    }
});

