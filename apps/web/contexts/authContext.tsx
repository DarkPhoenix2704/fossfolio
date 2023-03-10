import React, { createContext, useState, useMemo, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import Session from 'supertokens-auth-react/recipe/session';
import { getAuthorisationURLWithQueryParamsAndSetState } from 'supertokens-auth-react/recipe/thirdparty';
import api from '@app/api';
import { Child, User } from '@app/types';

interface Prop {
    user: User | null;
    isUserLoading: boolean;
    setUser: React.Dispatch<User | null>;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    isProfileComplete: boolean;
    getData: () => Promise<void>;
    isUserExist: boolean;
}

export const AuthContext = createContext({} as Prop);

export const AuthProvider = ({ children }: Child) => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isUserLoading, setUserLoading] = useState<boolean>(false);
    const [isProfileComplete, setIsProfileComplete] = useState<boolean>(false);
    const [isUserExist, setUserExist] = useState<boolean>(false);
    const { doesSessionExist } = Session;

    // listening for route change events
    Router.events.on('routeChangeStart', () => {
        // when route change loading screen popup
        setUserLoading(true);
    });
    Router.events.on('routeChangeComplete', () => {
        setUserLoading(false);
    });

    const getData = async () => {
        try {
            const { data } = await api.get('/user');
            if (!data.success) {
                throw new Error();
            }
            if (data.success && data.data === null) {
                router.push('/error');
            }
            if (data.success && data.data) {
                setUser(data.data);
                if (data.data) setIsProfileComplete(true);
            }
        } catch {
            router.push('/error');
        }
    };

    useEffect(() => {
        (async () => {
            const resp = await doesSessionExist();
            setUserExist(resp);
        })();
    }, [doesSessionExist]);

    const login = async () => {
        setUserLoading(true);
        try {
            const authUrl = await getAuthorisationURLWithQueryParamsAndSetState({
                providerId: 'github',
                // this url is based on what url you set on github dashboard callback url
                authorisationURL: `${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}/auth/callback/github`,
            });
            router.push(authUrl);
        } catch (err: any) {
            router.push('/error');
        } finally {
            setUserLoading(false);
        }
    };

    const logout = async () => {
        setUserLoading(true);
        await Session.signOut();
        setUserLoading(false);
        setUser(null);
    };

    const value = useMemo(
        () => ({
            user,
            isUserLoading,
            isProfileComplete,
            setUser,
            login,
            logout,
            getData,
            isUserExist,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [doesSessionExist, isUserLoading, user, setUser, isProfileComplete],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
