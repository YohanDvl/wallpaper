import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from 'src/app/core/providers/auth/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
 email!: FormControl;
 password!: FormControl;
 loginForm!: FormGroup;
  constructor(private readonly authSrv: Auth, private readonly router: Router) {
    this.initForm();
  }

  ngOnInit() {
  }

  public async onLogin(){
    
    console.log(this.loginForm.value);
    console.log("login hecho");
   try {
     await this.authSrv.login(this.email.value, this.password.value);
     console.log("login exitoso");
   } catch (e) {
     console.error('Error en login', e);
   }

  }

  private initForm(){
    this.email = new FormControl('', [Validators.email, Validators.required]);
    this.password = new FormControl('', [Validators.required]);


    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password,
    })
  }

  // Asegura que al volver desde logout, el formulario esté limpio
  ionViewWillEnter() {
    this.loginForm.reset();
  }

}
