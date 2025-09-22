import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Firebase / AngularFire
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

// Entorno
import { environment } from 'src/environments/environment';

// Tus servicios
import { Auth } from './providers/auth/auth';
import { Query } from './providers/query/query';
import { NativeToast } from './providers/nativeToast/native-toast';
import { File } from './providers/file/file';
import { UpLoader } from './providers/upLoader/up-loader';
import { Capacitor } from '@capacitor/core';

const providers = [Auth, Query, NativeToast, File, UpLoader];

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    // 🔹 Inicializar Firebase
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),

    // 🔹 Tus servicios
    ...providers
  ]
})
export class CoreModule implements OnInit {
  constructor(private readonly fileSrv: File) {
    if (Capacitor.isNativePlatform()) {
      this.ngOnInit();
    }
  }

  async ngOnInit() {
    await this.fileSrv.requestPermissions();
  }
}

