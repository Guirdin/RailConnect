import { Injectable, NgZone } from '@angular/core';
import { User } from "../user/user";
//import { Auth } from 'firebase/auth';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from "@angular/router";
import firebase from 'firebase/compat';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any; // Save logged in user data
  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,  
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {    
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    })
  }
  // Sign in with email/password
  async SignIn(email: string, password: string) {
    try {
          const result = await this.afAuth.signInWithEmailAndPassword(email, password);
          this.ngZone.run(() => {
              this.router.navigate(['dashboard']);
          });
          this.SetUserData(result.user);
      } catch (error) {
          window.alert(error.message);
      }
  }
  // Sign up with email/password
  async SignUp(email: string, password: string) {
    try {
          const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
          /* Call the SendVerificaitonMail() function when new user sign
          up and returns promise */
          //this.SendVerificationMail();
          this.SetUserData(result.user);
      } catch (error) {
          window.alert(error.message);
      }
  }
  // Send email verfificaiton when new user sign up
  /*SendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification()
    .then(() => {
      this.router.navigate(['verify-email-address']);
    })
  }*/
  // Reset Forggot password
  async ForgotPassword(passwordResetEmail: string) {
    try {
          await this.afAuth.sendPasswordResetEmail(passwordResetEmail);
          window.alert('Password reset email sent, check your inbox.');
      } catch (error) {
          window.alert(error);
      }
  }
  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }
  // Sign in with Google
  /*GoogleAuth() {
    return this.AuthLogin(new Auth.GoogleAuthProvider());
  }
  // Auth logic to run auth providers
  AuthLogin(provider) {
    return this.afAuth.signInWithPopup(provider)
    .then((result) => {
       this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        })
      this.SetUserData(result.user);
    }).catch((error) => {
      window.alert(error)
    })
  }
  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: firebase.User) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    })
  }
  // Sign out 
  async SignOut() {
    await this.afAuth.signOut();
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
  }
}