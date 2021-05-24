import { Injectable } from "@angular/core";
import { MsalService } from "@azure/msal-angular";
import { AccountInfo, AuthenticationResult } from "@azure/msal-browser";
import { BehaviorSubject } from "rxjs";
import { User } from "../model/user";

@Injectable({ providedIn: 'root' })
export class AuthService {
    private isAuthenticated = new BehaviorSubject<boolean>(false)
    private user = new BehaviorSubject<User | undefined>(undefined)
    private account = new BehaviorSubject<AccountInfo | undefined>(undefined)

    isAuthenticated$ = this.isAuthenticated.asObservable()
    user$ = this.user.asObservable()
    account$ = this.account.asObservable()

    constructor(private msalService: MsalService) {
        this.loadUser()
    }

    login() {
        this.msalService.loginPopup()
            .subscribe(r => this.handleSuccessResponse(r))
    }

    logout() {
        this.msalService.logoutPopup()
            .subscribe(() => {
                this.isAuthenticated.next(false)
                this.account.next(undefined)
                this.user.next(undefined)
                localStorage.removeItem("user")
            })
    }

    private handleSuccessResponse(result: AuthenticationResult) {
        if (result) {
            this.account.next(result.account!)
            this.setUser({
                username: result.account?.name ?? "",
                idToken: result.idToken
            })
        }
    }

    private setUser(user: User) {
        localStorage.setItem("user", JSON.stringify(user))
        this.user.next(user)
        this.isAuthenticated.next(true)
    }

    private loadUser() {
        const rawUser = localStorage.getItem("user") ?? ""
        if (rawUser) {
            const user = JSON.parse(rawUser)
            this.user.next(user)
            this.isAuthenticated.next(true)
        }
    }
}