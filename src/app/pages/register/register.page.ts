import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {
  nombre!: FormControl;
  apellido!: FormControl;
  email!: FormControl;
  password!: FormControl;

  registerForm!: FormGroup;

  constructor() { 
     this.initFrom()
  }

  ngOnInit() {
   
  }

  public doRegister(){
    console.log(this.registerForm.value);
    
  }

  private initFrom(){
    this.nombre = new FormControl('', [Validators.required]) 
    this.apellido = new FormControl('', [Validators.required])
      this.email = new FormControl('', [Validators.email, Validators.required])
      this.password = new FormControl('', [Validators.required])

      this.registerForm = new FormGroup({
        nombre: this.nombre,
        apellido: this.apellido,
        email: this.email,
        password:  this.password
      })
  }
}
