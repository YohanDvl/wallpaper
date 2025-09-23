import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  standalone: false,
})
export class InputComponent  implements OnInit {
@Input() type: string = '';
@Input() label: string = '';
@Input() placeholder: string = '';
@Input() control: FormControl = new FormControl();
@Input() disabled: boolean = false;
@Input() autocomplete: string = 'off';

  constructor() { }

  ngOnInit() {}

  public onType(event: any){
    const value = event?.detail?.value ?? event?.target?.value ?? '';
    if (this.control.value !== value) {
      this.control.setValue(value);
    }
  }

}
