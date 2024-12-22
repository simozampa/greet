import { FacebookAuthResponse } from "..";

export const initFacebookSdk = () => {
    return new Promise<void>((resolve, reject) => {

        // Load the Facebook SDK asynchronously
        window.fbAsyncInit = () => {
            window.FB.init({
                appId: '664911185502818',
                status: true,
                cookie: true,
                xfbml: true,
                version: 'v2.4'
            });

            // Resolve the promise when the SDK is loaded            
            resolve();
        };
    })
}

export const getFacebookLoginStatus = () => {
    return new Promise((resolve, reject) => {
        window.FB.getLoginStatus((response: any) => {
            resolve(response);
        });
    });
}

export const fbLogin = () => {
    return new Promise<FacebookAuthResponse>((resolve) => {
        window.FB.login((response: FacebookAuthResponse) => {
            resolve(response)
        }, {
            scope: 'instagram_basic, pages_show_list, business_management, instagram_manage_insights, pages_read_engagement'
        })
    })
}

export const fbLogout = () => {
    return new Promise<boolean>((resolve) => {
        window.FB.getLoginStatus(function (response: any) {
            if (response.status === 'connected') {
                window.FB.logout(function (response: any) {
                    resolve(true)
                });
            } else {
                console.error("The person is not logged into your webpage or we are unable to tell!");
            }
        });
    });
}