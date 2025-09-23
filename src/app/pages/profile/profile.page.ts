import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/shared/services/user/user';
import { Auth } from 'src/app/core/providers/auth/auth';
import { Query } from 'src/app/core/providers/query/query';
import { ToastController } from '@ionic/angular';
import { Auth as FirebaseAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage {
  form: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private auth: Auth, private query: Query, private toast: ToastController, private fbAuth: FirebaseAuth, private router: Router) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      currentPassword: [''],
      password: ['', [Validators.minLength(6)]],
    });
  }

  async ionViewWillEnter() {
    // Cargar datos reales desde Firestore por UID
    try {
      // Reinicia para evitar que valores viejos queden visibles mientras cargan los reales
      this.form.reset({
        name: '',
        lastName: '',
        email: this.auth.getEmail() ?? '',
        currentPassword: '',
        password: ''
      });

      // Esperar a que el uid esté disponible
      const uid = await this.auth.waitForUid();
      if (!uid) {
        // Al menos prellenar el email si existe sesión
        const mail = this.auth.getEmail() ?? '';
        if (mail) this.emailCtrl.setValue(mail);
        return;
      }
      const res = await this.query.readOneByField('users', 'uid', uid);
      const data = res?.data ?? {};
      // Preferimos el email de la sesión actual; si no hay, usamos el del doc
  const email = this.auth.getEmail() ?? data.email ?? '';
      // Evitar casos donde el "apellido" terminó con un email por error previo
      const safeLastName = (data.lastName && /@/.test(data.lastName)) ? '' : (data.lastName ?? '');
      this.form.patchValue({
        name: data.name ?? '',
        lastName: safeLastName,
        email,
        // Mostramos una máscara en UI; NO es la real contraseña
        currentPassword: '',
        password: ''
      });
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
      let { name, lastName, email, password, currentPassword } = this.form.getRawValue(); // incluye email deshabilitado
      // Evita guardar correos en el apellido por autocompletado indebido
      if (lastName && /@/.test(lastName)) {
        lastName = '';
      }
      // Busca doc del usuario y actualiza; si no existe, crea uno nuevo
      const existing = await this.query.readOneByField('users', 'uid', uid);
      if (existing) {
        await this.query.update('users', existing.id, { name, lastName, email });
      } else {
        await this.query.create('users', { uid, name, lastName, email });
      }

      // Actualizar contraseña si el usuario cambió el campo (no guardar '********')
      let passwordChanged = false;
      if (password && this.fbAuth.currentUser) {
        try {
          // Exigir contraseña actual cuando se intenta cambiar
          if (!currentPassword) {
            const warn = await this.toast.create({ message: 'Escribe tu contraseña actual para cambiarla.', duration: 2000, color: 'warning' });
            warn.present();
            throw new Error('missing-current-password');
          }
          // Reautenticar
          if (this.fbAuth.currentUser.email) {
            const cred = EmailAuthProvider.credential(this.fbAuth.currentUser.email, currentPassword);
            await reauthenticateWithCredential(this.fbAuth.currentUser, cred);
          }
          await updatePassword(this.fbAuth.currentUser, password);
          const tp = await this.toast.create({ message: 'Contraseña actualizada', duration: 1500, color: 'success' });
          tp.present();
          passwordChanged = true;
          // Forzar cerrar sesión para que el siguiente login sea con la nueva contraseña
          await this.auth.logOut();
          await this.router.navigate(['/login'], { replaceUrl: true });
        } catch (e:any) {
          let msg = 'No se pudo actualizar la contraseña';
          if (e?.code === 'auth/requires-recent-login') msg = 'Por seguridad, vuelve a iniciar sesión para cambiar la contraseña.';
          if (e?.code === 'auth/wrong-password') msg = 'La contraseña actual no es correcta.';
          const tt = await this.toast.create({ message: msg, duration: 2000, color: 'warning' });
          tt.present();
        }
      }
      if (!passwordChanged) {
        const t = await this.toast.create({ message: 'Perfil actualizado', duration: 1500, color: 'success' });
        t.present();
      }
    } finally {
      this.loading = false;
    }
  }

  // Controles tipados para el componente app-input
  get nameCtrl() { return this.form.get('name') as import('@angular/forms').FormControl; }
  get lastNameCtrl() { return this.form.get('lastName') as import('@angular/forms').FormControl; }
  get emailCtrl() { return this.form.get('email') as import('@angular/forms').FormControl; }
  get currentPasswordCtrl() { return this.form.get('currentPassword') as import('@angular/forms').FormControl; }
  get passwordCtrl() { return this.form.get('password') as import('@angular/forms').FormControl; }
}
