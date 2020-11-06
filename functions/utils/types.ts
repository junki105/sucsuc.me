// import { Context } from 'aws-lambda'
// AWS Lambda と Netlify Functionで仕様が異なるのでTypeを再定義

export interface Context {
    callbackWaitsForEmptyEventLoop: boolean;
    functionName: string;
    functionVersion: string;
    invokedFunctionArn: string;
    memoryLimitInMB: string;
    awsRequestId: string;
    logGroupName: string;
    logStreamName: string;
    identity?: CognitoIdentity;
    clientContext?: ClientContext;

    getRemainingTimeInMillis(): number;

    // Functions for compatibility with earlier Node.js Runtime v0.10.42
    // No longer documented, so they are deprecated, but they still work
    // as of the 12.x runtime, so they are not removed from the types.

    /** @deprecated Use handler callback or promise result */
    done(error?: Error, result?: any): void;
    /** @deprecated Use handler callback with first argument or reject a promise result */
    fail(error: Error | string): void;
    /** @deprecated Use handler callback with second argument or resolve a promise result */
    succeed(messageOrObject: any): void;
    // Unclear what behavior this is supposed to have, I couldn't find any still extant reference,
    // and it behaves like the above, ignoring the object parameter.
    /** @deprecated Use handler callback or promise result */
    succeed(message: string, object: any): void;
}

export interface CognitoIdentity {
    cognitoIdentityId: string;
    cognitoIdentityPoolId: string;
}

export interface ClientContext {
    user: User;
    identity: Identity;
}

export interface User {
    exp: string;
    sub: string;
    email: string|null;
    app_metadata: Metadata,
    user_metadata: Metadata,
}

export interface Metadata {
    [k: string]: string | null;
}

export interface Identity {
    url: string;
    token: string;
}