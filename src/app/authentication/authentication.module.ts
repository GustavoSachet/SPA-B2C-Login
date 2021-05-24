import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserCacheLocation, IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { environment } from 'src/environments/environment';
import { MsalModule, MsalService, MSAL_INSTANCE } from '@azure/msal-angular';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';

const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.b2cConfig.clientId,
      authority: environment.b2cConfig.authority,
      redirectUri: 'http://localhost:4200',
      postLogoutRedirectUri: 'http://localhost:4200',
      knownAuthorities: [environment.b2cConfig.authorityDomain],
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: isIE, // set to true for IE 11
    },
  });
}

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    MsalModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    MsalService,
  ]
})

export class AuthenticationModule { }