import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProfilePageRoutingModule } from './profile-routing.module';
import { ProfilePage } from './profile.page';
import { SharedModuleModule } from 'src/app/shared/shared-module-module';

@NgModule({
  declarations: [ProfilePage],
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule, SharedModuleModule, ProfilePageRoutingModule]
})
export class ProfilePageModule {}
