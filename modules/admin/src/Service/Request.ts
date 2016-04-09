'use strict';
export interface RequestGetOptions {
    url:string;
    type:string;
    body?:string;
    userName?:string;
    userPass?:string;
}
export interface RequestGetResponse {
    string;
}
export class Request {
    private userName:string;
    private userPass:string;

    basicAuth(userName, userPass) {
        this.userName = userName;
        this.userPass = userPass;
    }

    httpRequest(options:RequestGetOptions):Promise<RequestGetResponse> {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.getResponseHeader('Content-Type');
            xhr.open(options.type, options.url, true, options.userName, options.userPass);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(this.userName + ':' + this.userPass));

            xhr.onload = function (ev: Event) {
                if (xhr.status === 200) {
                    resolve(xhr.responseText);
                } else {
                    reject(new Error(xhr.statusText));
                }
            };

            xhr.onabort = function(ev: Event) {
                reject(new Error(xhr.statusText));
            };

            xhr.onerror = function(ev: Event) {
                reject(new Error(xhr.statusText));
            };

            xhr.send(options.body);
        });
    }
}
