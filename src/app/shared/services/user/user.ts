import { Injectable } from '@angular/core';
import { Auth } from 'src/app/core/providers/auth/auth';
import { Query } from 'src/app/core/providers/query/query';
import { IUserCreate } from 'src/interfaces/user.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class User {
  private profileSubject = new BehaviorSubject<{ name: string; lastName: string } | null>(null);

  constructor(private readonly authSrv: Auth, private readonly querySrv: Query){}

  async create(user: IUserCreate): Promise<void> {
    try {
      console.log(user);

     const uid = await this.authSrv.register(user.email, user.password);
      await this.querySrv.create("users",   {
        uid,
        name: user.name,
        lastName: user.lastName
      });
      this.profileSubject.next({ name: user.name, lastName: user.lastName });
      console.log("wiiiii");

    } catch (error) {
      console.log(error);

    }
  }

  setProfile(name: string, lastName: string) {
    this.profileSubject.next({ name, lastName });
  }

  getProfile$(): Observable<{ name: string; lastName: string } | null> {
    return this.profileSubject.asObservable();
  }
}
