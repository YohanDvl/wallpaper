import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  email!: FormControl;
  password!: FormControl;

  loginForm!: FormGroup;

  constructor() {
    this.initForm();
  }

  ngOnInit() {
  }

  private initForm(){
    this.email = new FormControl('', [Validators.email, Validators.required]);
    this.password = new FormControl('', [Validators.required]);

    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password,
    })
  }
  onLogin(){
    console.log(this.loginForm.value);
    
  }
}
