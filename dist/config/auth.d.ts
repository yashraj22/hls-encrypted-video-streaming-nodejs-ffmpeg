export declare const auth: {
    handler: (request: Request) => Promise<Response>;
    api: {
        signInOAuth: {
            <C extends [import("better-call").Context<"/sign-in/social", {
                method: "POST";
                requireHeaders: true;
                query: import("zod").ZodOptional<import("zod").ZodObject<{
                    currentURL: import("zod").ZodOptional<import("zod").ZodString>;
                }, "strip", import("zod").ZodTypeAny, {
                    currentURL?: string | undefined;
                }, {
                    currentURL?: string | undefined;
                }>>;
                body: import("zod").ZodObject<{
                    callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                    provider: import("zod").ZodEnum<["github", ...("apple" | "discord" | "facebook" | "github" | "google" | "microsoft" | "spotify" | "twitch" | "twitter" | "dropbox" | "linkedin")[]]>;
                }, "strip", import("zod").ZodTypeAny, {
                    provider: "apple" | "discord" | "facebook" | "github" | "google" | "microsoft" | "spotify" | "twitch" | "twitter" | "dropbox" | "linkedin";
                    callbackURL?: string | undefined;
                }, {
                    provider: "apple" | "discord" | "facebook" | "github" | "google" | "microsoft" | "spotify" | "twitch" | "twitter" | "dropbox" | "linkedin";
                    callbackURL?: string | undefined;
                }>;
                use: import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, void>, import("better-call").EndpointOptions>[];
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                url: string;
                state: {
                    raw: string;
                    hash: string;
                };
                codeVerifier: string;
                redirect: boolean;
            }>;
            path: "/sign-in/social";
            options: {
                method: "POST";
                requireHeaders: true;
                query: import("zod").ZodOptional<import("zod").ZodObject<{
                    currentURL: import("zod").ZodOptional<import("zod").ZodString>;
                }, "strip", import("zod").ZodTypeAny, {
                    currentURL?: string | undefined;
                }, {
                    currentURL?: string | undefined;
                }>>;
                body: import("zod").ZodObject<{
                    callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                    provider: import("zod").ZodEnum<["github", ...("apple" | "discord" | "facebook" | "github" | "google" | "microsoft" | "spotify" | "twitch" | "twitter" | "dropbox" | "linkedin")[]]>;
                }, "strip", import("zod").ZodTypeAny, {
                    provider: "apple" | "discord" | "facebook" | "github" | "google" | "microsoft" | "spotify" | "twitch" | "twitter" | "dropbox" | "linkedin";
                    callbackURL?: string | undefined;
                }, {
                    provider: "apple" | "discord" | "facebook" | "github" | "google" | "microsoft" | "spotify" | "twitch" | "twitter" | "dropbox" | "linkedin";
                    callbackURL?: string | undefined;
                }>;
                use: import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, void>, import("better-call").EndpointOptions>[];
            };
            method: import("better-call").Method | import("better-call").Method[];
            headers: Headers;
        };
        getSession: {
            <C extends [import("better-call").Context<"/get-session", {
                method: "GET";
                requireHeaders: true;
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                session: {
                    id: string;
                    userId: string;
                    expiresAt: Date;
                    ipAddress?: string | undefined | undefined;
                    userAgent?: string | undefined | undefined;
                };
                user: {
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    image?: string | undefined | undefined;
                    role: string;
                    isActive: boolean;
                    avatar?: string | undefined;
                };
            } | null>;
            path: "/get-session";
            options: {
                method: "GET";
                requireHeaders: true;
            };
            method: import("better-call").Method | import("better-call").Method[];
            headers: Headers;
        };
        signOut: {
            <C extends [(import("better-call").Context<"/sign-out", {
                method: "POST";
            }> | undefined)?]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                success: boolean;
            }>;
            path: "/sign-out";
            options: {
                method: "POST";
            };
            method: import("better-call").Method | import("better-call").Method[];
            headers: Headers;
        };
        signUpEmail: {
            <C extends [import("better-call").Context<"/sign-up/email", {
                method: "POST";
                query: import("zod").ZodOptional<import("zod").ZodObject<{
                    currentURL: import("zod").ZodOptional<import("zod").ZodString>;
                }, "strip", import("zod").ZodTypeAny, {
                    currentURL?: string | undefined;
                }, {
                    currentURL?: string | undefined;
                }>>;
                body: import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    email: import("zod").ZodString;
                    password: import("zod").ZodString;
                    callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                    password: string;
                    email: string;
                    name: string;
                    callbackURL?: string | undefined;
                }, {
                    password: string;
                    email: string;
                    name: string;
                    callbackURL?: string | undefined;
                }> & import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    role: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodUndefined]>;
                    avatar: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodUndefined]>;
                    isActive: import("zod").ZodUnion<[import("zod").ZodBoolean, import("zod").ZodUndefined]>;
                }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                    name: string;
                    role?: string | undefined;
                    avatar?: string | undefined;
                    isActive?: boolean | undefined;
                }, {
                    name: string;
                    role?: string | undefined;
                    avatar?: string | undefined;
                    isActive?: boolean | undefined;
                }>;
                use: import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, void>, import("better-call").EndpointOptions>[];
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                user: {
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    image?: string | undefined | undefined;
                    role: string;
                    isActive: boolean;
                    avatar?: string | undefined;
                };
                session: null;
            } | {
                user: {
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    image?: string | undefined | undefined;
                    role: string;
                    isActive: boolean;
                    avatar?: string | undefined;
                };
                session: {
                    id: string;
                    userId: string;
                    expiresAt: Date;
                    ipAddress?: string | undefined | undefined;
                    userAgent?: string | undefined | undefined;
                };
            }>;
            path: "/sign-up/email";
            options: {
                method: "POST";
                query: import("zod").ZodOptional<import("zod").ZodObject<{
                    currentURL: import("zod").ZodOptional<import("zod").ZodString>;
                }, "strip", import("zod").ZodTypeAny, {
                    currentURL?: string | undefined;
                }, {
                    currentURL?: string | undefined;
                }>>;
                body: import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    email: import("zod").ZodString;
                    password: import("zod").ZodString;
                    callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                    password: string;
                    email: string;
                    name: string;
                    callbackURL?: string | undefined;
                }, {
                    password: string;
                    email: string;
                    name: string;
                    callbackURL?: string | undefined;
                }> & import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    role: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodUndefined]>;
                    avatar: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodUndefined]>;
                    isActive: import("zod").ZodUnion<[import("zod").ZodBoolean, import("zod").ZodUndefined]>;
                }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                    name: string;
                    role?: string | undefined;
                    avatar?: string | undefined;
                    isActive?: boolean | undefined;
                }, {
                    name: string;
                    role?: string | undefined;
                    avatar?: string | undefined;
                    isActive?: boolean | undefined;
                }>;
                use: import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, void>, import("better-call").EndpointOptions>[];
            };
            method: import("better-call").Method | import("better-call").Method[];
            headers: Headers;
        };
        signInEmail: {
            <C extends [import("better-call").Context<"/sign-in/email", {
                method: "POST";
                body: import("zod").ZodObject<{
                    email: import("zod").ZodString;
                    password: import("zod").ZodString;
                    callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                    dontRememberMe: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodBoolean>>;
                }, "strip", import("zod").ZodTypeAny, {
                    password: string;
                    email: string;
                    callbackURL?: string | undefined;
                    dontRememberMe?: boolean | undefined;
                }, {
                    password: string;
                    email: string;
                    callbackURL?: string | undefined;
                    dontRememberMe?: boolean | undefined;
                }>;
                use: import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, void>, import("better-call").EndpointOptions>[];
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                user: {
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    image?: string | undefined;
                };
                session: any;
                redirect: boolean;
                url: string | undefined;
            }>;
            path: "/sign-in/email";
            options: {
                method: "POST";
                body: import("zod").ZodObject<{
                    email: import("zod").ZodString;
                    password: import("zod").ZodString;
                    callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                    dontRememberMe: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodBoolean>>;
                }, "strip", import("zod").ZodTypeAny, {
                    password: string;
                    email: string;
                    callbackURL?: string | undefined;
                    dontRememberMe?: boolean | undefined;
                }, {
                    password: string;
                    email: string;
                    callbackURL?: string | undefined;
                    dontRememberMe?: boolean | undefined;
                }>;
                use: import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, void>, import("better-call").EndpointOptions>[];
            };
            method: import("better-call").Method | import("better-call").Method[];
            headers: Headers;
        };
        forgetPassword: {
            <C extends [import("better-call").Context<"/forget-password", {
                method: "POST";
                body: import("zod").ZodObject<{
                    email: import("zod").ZodString;
                    redirectTo: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    email: string;
                    redirectTo: string;
                }, {
                    email: string;
                    redirectTo: string;
                }>;
                use: import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, void>, import("better-call").EndpointOptions>[];
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                status: boolean;
            }>;
            path: "/forget-password";
            options: {
                method: "POST";
                body: import("zod").ZodObject<{
                    email: import("zod").ZodString;
                    redirectTo: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    email: string;
                    redirectTo: string;
                }, {
                    email: string;
                    redirectTo: string;
                }>;
                use: import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, void>, import("better-call").EndpointOptions>[];
            };
            method: import("better-call").Method | import("better-call").Method[];
            headers: Headers;
        };
        resetPassword: {
            <C extends [import("better-call").Context<"/reset-password", {
                query: import("zod").ZodOptional<import("zod").ZodObject<{
                    token: import("zod").ZodOptional<import("zod").ZodString>;
                    currentURL: import("zod").ZodOptional<import("zod").ZodString>;
                }, "strip", import("zod").ZodTypeAny, {
                    currentURL?: string | undefined;
                    token?: string | undefined;
                }, {
                    currentURL?: string | undefined;
                    token?: string | undefined;
                }>>;
                method: "POST";
                body: import("zod").ZodObject<{
                    newPassword: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    newPassword: string;
                }, {
                    newPassword: string;
                }>;
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                status: boolean;
            }>;
            path: "/reset-password";
            options: {
                query: import("zod").ZodOptional<import("zod").ZodObject<{
                    token: import("zod").ZodOptional<import("zod").ZodString>;
                    currentURL: import("zod").ZodOptional<import("zod").ZodString>;
                }, "strip", import("zod").ZodTypeAny, {
                    currentURL?: string | undefined;
                    token?: string | undefined;
                }, {
                    currentURL?: string | undefined;
                    token?: string | undefined;
                }>>;
                method: "POST";
                body: import("zod").ZodObject<{
                    newPassword: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    newPassword: string;
                }, {
                    newPassword: string;
                }>;
            };
            method: import("better-call").Method | import("better-call").Method[];
            headers: Headers;
        };
        verifyEmail: {
            <C extends [import("better-call").Context<"/verify-email", {
                method: "GET";
                query: import("zod").ZodObject<{
                    token: import("zod").ZodString;
                    callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                }, "strip", import("zod").ZodTypeAny, {
                    token: string;
                    callbackURL?: string | undefined;
                }, {
                    token: string;
                    callbackURL?: string | undefined;
                }>;
                use: import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, void>, import("better-call").EndpointOptions>[];
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                user: any;
                status: boolean;
            }>;
            path: "/verify-email";
            options: {
                method: "GET";
                query: import("zod").ZodObject<{
                    token: import("zod").ZodString;
                    callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                }, "strip", import("zod").ZodTypeAny, {
                    token: string;
                    callbackURL?: string | undefined;
                }, {
                    token: string;
                    callbackURL?: string | undefined;
                }>;
                use: import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, void>, import("better-call").EndpointOptions>[];
            };
            method: import("better-call").Method | import("better-call").Method[];
            headers: Headers;
        };
        sendVerificationEmail: {
            <C extends [import("better-call").Context<"/send-verification-email", {
                method: "POST";
                query: import("zod").ZodOptional<import("zod").ZodObject<{
                    currentURL: import("zod").ZodOptional<import("zod").ZodString>;
                }, "strip", import("zod").ZodTypeAny, {
                    currentURL?: string | undefined;
                }, {
                    currentURL?: string | undefined;
                }>>;
                body: import("zod").ZodObject<{
                    email: import("zod").ZodString;
                    callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                }, "strip", import("zod").ZodTypeAny, {
                    email: string;
                    callbackURL?: string | undefined;
                }, {
                    email: string;
                    callbackURL?: string | undefined;
                }>;
                use: import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, void>, import("better-call").EndpointOptions>[];
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                status: boolean;
            }>;
            path: "/send-verification-email";
            options: {
                method: "POST";
                query: import("zod").ZodOptional<import("zod").ZodObject<{
                    currentURL: import("zod").ZodOptional<import("zod").ZodString>;
                }, "strip", import("zod").ZodTypeAny, {
                    currentURL?: string | undefined;
                }, {
                    currentURL?: string | undefined;
                }>>;
                body: import("zod").ZodObject<{
                    email: import("zod").ZodString;
                    callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                }, "strip", import("zod").ZodTypeAny, {
                    email: string;
                    callbackURL?: string | undefined;
                }, {
                    email: string;
                    callbackURL?: string | undefined;
                }>;
                use: import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, void>, import("better-call").EndpointOptions>[];
            };
            method: import("better-call").Method | import("better-call").Method[];
            headers: Headers;
        };
        changeEmail: {
            <C extends [import("better-call").Context<"/user/change-email", {
                method: "POST";
                query: import("zod").ZodOptional<import("zod").ZodObject<{
                    currentURL: import("zod").ZodOptional<import("zod").ZodString>;
                }, "strip", import("zod").ZodTypeAny, {
                    currentURL?: string | undefined;
                }, {
                    currentURL?: string | undefined;
                }>>;
                body: import("zod").ZodObject<{
                    newEmail: import("zod").ZodString;
                    callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                }, "strip", import("zod").ZodTypeAny, {
                    newEmail: string;
                    callbackURL?: string | undefined;
                }, {
                    newEmail: string;
                    callbackURL?: string | undefined;
                }>;
                use: (import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, void>, import("better-call").EndpointOptions> | import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, {
                    session: {
                        session: {
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        };
                        user: {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        };
                    };
                }>, import("better-call").EndpointOptions>)[];
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                user: any;
                status: boolean;
            }>;
            path: "/user/change-email";
            options: {
                method: "POST";
                query: import("zod").ZodOptional<import("zod").ZodObject<{
                    currentURL: import("zod").ZodOptional<import("zod").ZodString>;
                }, "strip", import("zod").ZodTypeAny, {
                    currentURL?: string | undefined;
                }, {
                    currentURL?: string | undefined;
                }>>;
                body: import("zod").ZodObject<{
                    newEmail: import("zod").ZodString;
                    callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                }, "strip", import("zod").ZodTypeAny, {
                    newEmail: string;
                    callbackURL?: string | undefined;
                }, {
                    newEmail: string;
                    callbackURL?: string | undefined;
                }>;
                use: (import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, void>, import("better-call").EndpointOptions> | import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, {
                    session: {
                        session: {
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        };
                        user: {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        };
                    };
                }>, import("better-call").EndpointOptions>)[];
            };
            method: import("better-call").Method | import("better-call").Method[];
            headers: Headers;
        };
        changePassword: {
            <C extends [import("better-call").Context<"/user/change-password", {
                method: "POST";
                body: import("zod").ZodObject<{
                    newPassword: import("zod").ZodString;
                    currentPassword: import("zod").ZodString;
                    revokeOtherSessions: import("zod").ZodOptional<import("zod").ZodBoolean>;
                }, "strip", import("zod").ZodTypeAny, {
                    newPassword: string;
                    currentPassword: string;
                    revokeOtherSessions?: boolean | undefined;
                }, {
                    newPassword: string;
                    currentPassword: string;
                    revokeOtherSessions?: boolean | undefined;
                }>;
                use: import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, {
                    session: {
                        session: {
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        };
                        user: {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        };
                    };
                }>, import("better-call").EndpointOptions>[];
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                id: string;
                email: string;
                emailVerified: boolean;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                image?: string | undefined;
            }>;
            path: "/user/change-password";
            options: {
                method: "POST";
                body: import("zod").ZodObject<{
                    newPassword: import("zod").ZodString;
                    currentPassword: import("zod").ZodString;
                    revokeOtherSessions: import("zod").ZodOptional<import("zod").ZodBoolean>;
                }, "strip", import("zod").ZodTypeAny, {
                    newPassword: string;
                    currentPassword: string;
                    revokeOtherSessions?: boolean | undefined;
                }, {
                    newPassword: string;
                    currentPassword: string;
                    revokeOtherSessions?: boolean | undefined;
                }>;
                use: import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, {
                    session: {
                        session: {
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        };
                        user: {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        };
                    };
                }>, import("better-call").EndpointOptions>[];
            };
            method: import("better-call").Method | import("better-call").Method[];
            headers: Headers;
        };
        setPassword: {
            <C extends [import("better-call").Context<"/user/set-password", {
                method: "POST";
                body: import("zod").ZodObject<{
                    newPassword: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    newPassword: string;
                }, {
                    newPassword: string;
                }>;
                use: import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, {
                    session: {
                        session: {
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        };
                        user: {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        };
                    };
                }>, import("better-call").EndpointOptions>[];
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                id: string;
                email: string;
                emailVerified: boolean;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                image?: string | undefined;
            }>;
            path: "/user/set-password";
            options: {
                method: "POST";
                body: import("zod").ZodObject<{
                    newPassword: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    newPassword: string;
                }, {
                    newPassword: string;
                }>;
                use: import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, {
                    session: {
                        session: {
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        };
                        user: {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        };
                    };
                }>, import("better-call").EndpointOptions>[];
            };
            method: import("better-call").Method | import("better-call").Method[];
            headers: Headers;
        };
        updateUser: {
            <C extends [import("better-call").Context<"/user/update", {
                method: "POST";
                body: import("zod").ZodObject<{
                    name: import("zod").ZodOptional<import("zod").ZodString>;
                    image: import("zod").ZodOptional<import("zod").ZodString>;
                }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                    name?: string | undefined;
                    image?: string | undefined;
                }, {
                    name?: string | undefined;
                    image?: string | undefined;
                }> & import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    role: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodUndefined]>;
                    avatar: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodUndefined]>;
                    isActive: import("zod").ZodUnion<[import("zod").ZodBoolean, import("zod").ZodUndefined]>;
                }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                    name: string;
                    role?: string | undefined;
                    avatar?: string | undefined;
                    isActive?: boolean | undefined;
                }, {
                    name: string;
                    role?: string | undefined;
                    avatar?: string | undefined;
                    isActive?: boolean | undefined;
                }>;
                use: (import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, void>, import("better-call").EndpointOptions> | import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, {
                    session: {
                        session: {
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        };
                        user: {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        };
                    };
                }>, import("better-call").EndpointOptions>)[];
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                user: any;
            }>;
            path: "/user/update";
            options: {
                method: "POST";
                body: import("zod").ZodObject<{
                    name: import("zod").ZodOptional<import("zod").ZodString>;
                    image: import("zod").ZodOptional<import("zod").ZodString>;
                }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                    name?: string | undefined;
                    image?: string | undefined;
                }, {
                    name?: string | undefined;
                    image?: string | undefined;
                }> & import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    role: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodUndefined]>;
                    avatar: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodUndefined]>;
                    isActive: import("zod").ZodUnion<[import("zod").ZodBoolean, import("zod").ZodUndefined]>;
                }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                    name: string;
                    role?: string | undefined;
                    avatar?: string | undefined;
                    isActive?: boolean | undefined;
                }, {
                    name: string;
                    role?: string | undefined;
                    avatar?: string | undefined;
                    isActive?: boolean | undefined;
                }>;
                use: (import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, void>, import("better-call").EndpointOptions> | import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, {
                    session: {
                        session: {
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        };
                        user: {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        };
                    };
                }>, import("better-call").EndpointOptions>)[];
            };
            method: import("better-call").Method | import("better-call").Method[];
            headers: Headers;
        };
        deleteUser: {
            <C extends [import("better-call").Context<"/user/delete", {
                method: "POST";
                body: import("zod").ZodObject<{
                    password: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    password: string;
                }, {
                    password: string;
                }>;
                use: import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, {
                    session: {
                        session: {
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        };
                        user: {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        };
                    };
                }>, import("better-call").EndpointOptions>[];
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : null>;
            path: "/user/delete";
            options: {
                method: "POST";
                body: import("zod").ZodObject<{
                    password: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    password: string;
                }, {
                    password: string;
                }>;
                use: import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, {
                    session: {
                        session: {
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        };
                        user: {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        };
                    };
                }>, import("better-call").EndpointOptions>[];
            };
            method: import("better-call").Method | import("better-call").Method[];
            headers: Headers;
        };
        forgetPasswordCallback: {
            <C extends [import("better-call").Context<"/reset-password/:token", {
                method: "GET";
                query: import("zod").ZodObject<{
                    callbackURL: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    callbackURL: string;
                }, {
                    callbackURL: string;
                }>;
                use: import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, void>, import("better-call").EndpointOptions>[];
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : never>;
            path: "/reset-password/:token";
            options: {
                method: "GET";
                query: import("zod").ZodObject<{
                    callbackURL: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    callbackURL: string;
                }, {
                    callbackURL: string;
                }>;
                use: import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, void>, import("better-call").EndpointOptions>[];
            };
            method: import("better-call").Method | import("better-call").Method[];
            headers: Headers;
        };
        listSessions: {
            <C extends [import("better-call").Context<"/user/list-sessions", {
                method: "GET";
                use: import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, {
                    session: {
                        session: {
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        };
                        user: {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        };
                    };
                }>, import("better-call").EndpointOptions>[];
                requireHeaders: true;
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : import("better-auth").Prettify<{
                id: string;
                userId: string;
                expiresAt: Date;
                ipAddress?: string | undefined | undefined;
                userAgent?: string | undefined | undefined;
            }>[]>;
            path: "/user/list-sessions";
            options: {
                method: "GET";
                use: import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, {
                    session: {
                        session: {
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        };
                        user: {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        };
                    };
                }>, import("better-call").EndpointOptions>[];
                requireHeaders: true;
            };
            method: import("better-call").Method | import("better-call").Method[];
            headers: Headers;
        };
        revokeSession: {
            <C extends [import("better-call").Context<"/user/revoke-session", {
                method: "POST";
                body: import("zod").ZodObject<{
                    id: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    id: string;
                }, {
                    id: string;
                }>;
                use: import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, {
                    session: {
                        session: {
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        };
                        user: {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        };
                    };
                }>, import("better-call").EndpointOptions>[];
                requireHeaders: true;
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                status: boolean;
            }>;
            path: "/user/revoke-session";
            options: {
                method: "POST";
                body: import("zod").ZodObject<{
                    id: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    id: string;
                }, {
                    id: string;
                }>;
                use: import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, {
                    session: {
                        session: {
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        };
                        user: {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        };
                    };
                }>, import("better-call").EndpointOptions>[];
                requireHeaders: true;
            };
            method: import("better-call").Method | import("better-call").Method[];
            headers: Headers;
        };
        revokeSessions: {
            <C extends [import("better-call").Context<"/user/revoke-sessions", {
                method: "POST";
                use: import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, {
                    session: {
                        session: {
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        };
                        user: {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        };
                    };
                }>, import("better-call").EndpointOptions>[];
                requireHeaders: true;
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                status: boolean;
            }>;
            path: "/user/revoke-sessions";
            options: {
                method: "POST";
                use: import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, {
                    session: {
                        session: {
                            id: string;
                            userId: string;
                            expiresAt: Date;
                            ipAddress?: string | undefined;
                            userAgent?: string | undefined;
                        };
                        user: {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | undefined;
                        };
                    };
                }>, import("better-call").EndpointOptions>[];
                requireHeaders: true;
            };
            method: import("better-call").Method | import("better-call").Method[];
            headers: Headers;
        };
    };
    options: {
        database: {
            id: string;
            create<T extends {
                id?: string;
            } & Record<string, any>, R = T>(data: {
                model: string;
                data: T;
                select?: string[];
            }): Promise<any>;
            findOne<T>(data: {
                model: string;
                where: import("better-auth").Where[];
                select?: string[];
            }): Promise<any>;
            findMany<T>(data: {
                model: string;
                where?: import("better-auth").Where[];
                limit?: number;
                sortBy?: {
                    field: string;
                    direction: "asc" | "desc";
                };
                offset?: number;
            }): Promise<any[]>;
            update<T>(data: {
                model: string;
                where: import("better-auth").Where[];
                update: Record<string, any>;
            }): Promise<any>;
            delete<T>(data: {
                model: string;
                where: import("better-auth").Where[];
            }): Promise<void>;
            deleteMany(data: {
                model: string;
                where: import("better-auth").Where[];
            }): Promise<void>;
        };
        emailAndPassword: {
            enabled: true;
            requireEmailVerification: true;
        };
        session: {
            expiresIn: number;
            updateAge: number;
        };
        user: {
            additionalFields: {
                role: {
                    type: "string";
                    defaultValue: string;
                };
                name: {
                    type: "string";
                    required: true;
                };
                avatar: {
                    type: "string";
                    required: false;
                };
                isActive: {
                    type: "boolean";
                    defaultValue: boolean;
                };
            };
        };
    };
    $Infer: {
        Session: {
            session: {
                id: string;
                userId: string;
                expiresAt: Date;
                ipAddress?: string | undefined | undefined;
                userAgent?: string | undefined | undefined;
            };
            user: {
                id: string;
                email: string;
                emailVerified: boolean;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                image?: string | undefined | undefined;
                role: string;
                isActive: boolean;
                avatar?: string | undefined;
            };
        };
    };
};
export type Session = typeof auth.$Infer.Session;
//# sourceMappingURL=auth.d.ts.map