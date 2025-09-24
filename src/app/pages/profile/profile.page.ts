import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Auth } from 'src/app/core/providers/auth/auth';
import { Query } from 'src/app/core/providers/query/query';
import { ToastController } from '@ionic/angular';
import { User as UserService } from 'src/app/shared/services/user/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage {
  form: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private auth: Auth, private query: Query, private toast: ToastController, private userSrv: UserService) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  async ionViewWillEnter() {
    try {
      // Limpiar antes de cargar
      this.form.reset({ name: '', lastName: '' });
      const uid = await this.auth.waitForUid();
      if (!uid) return;
      const res = await this.query.readOneByField('users', 'uid', uid);
      const data = res?.data ?? {};
      const safeLastName = (data.lastName && /@/.test(data.lastName)) ? '' : (data.lastName ?? '');
      this.form.patchValue({
        name: data.name ?? '',
        lastName: safeLastName,
      });
      // Empuja al store para que Home pueda saludar con el nombre
      this.userSrv.setProfile(this.form.get('name')?.value || '', this.form.get('lastName')?.value || '');
    } catch (e) {
      console.error('Error cargando perfil:', e);
    }
  }

  async save() {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    try {
      const uid = this.auth.getUid();
      if (!uid) return;
      let { name, lastName } = this.form.getRawValue();
      if (lastName && /@/.test(lastName)) lastName = '';
      const existing = await this.query.readOneByField('users', 'uid', uid);
      if (existing) {
        await this.query.update('users', existing.id, { name, lastName });
      } else {
        await this.query.create('users', { uid, name, lastName });
      }
      // Actualiza el store para reflejar el cambio en Home
      this.userSrv.setProfile(name, lastName);
      const t = await this.toast.create({ message: 'Perfil actualizado', duration: 1500, color: 'success' });
      t.present();
    } finally {
      this.loading = false;
    }
  }

  // Controles tipados
  get nameCtrl() { return this.form.get('name') as FormControl; }
  get lastNameCtrl() { return this.form.get('lastName') as FormControl; }
}
