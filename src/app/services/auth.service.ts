import {
  Injectable,
  signal
} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
  
export class AuthService {
currentUser =
  signal('');
  isLoggedIn =
    signal(false);

constructor() {

  const user =
    localStorage.getItem(
      'logged_user'
    );

  this.isLoggedIn.set(
    !!user
  );

  this.currentUser.set(
    user || ''
  );
}

  login(
  email: string,
  password: string
) {

  const validEmail =
    'admin@gmail.com';

  const validPassword =
    'admin123';

  if (
    email === validEmail &&
    password === validPassword
  ) {

    localStorage.setItem(
      'logged_user',
      email
    );

    this.isLoggedIn.set(true);
 this.currentUser.set(
  email
);
    return true;
  }

    return false;
   
}

  logout() {

    localStorage.removeItem(
      'logged_user'
    );

    this.isLoggedIn.set(false);
    this.currentUser.set('');
  }
}