import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"nueva-clinica-vitalis","appId":"1:859664901147:web:be9aa8fc998e46fe3684be","storageBucket":"nueva-clinica-vitalis.firebasestorage.app","apiKey":"AIzaSyAyFJ6CikkTc-h6JIUug5kba34873WTRNM","authDomain":"nueva-clinica-vitalis.firebaseapp.com","messagingSenderId":"859664901147"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
