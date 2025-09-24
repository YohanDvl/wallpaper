import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'src/app/core/providers/auth/auth';
import { File } from 'src/app/core/providers/file/file';
import { GlobalUrl } from 'src/app/core/providers/globalUrl/global-url';
import { Language } from 'src/app/core/providers/language/language';
import { UpLoader } from 'src/app/core/providers/upLoader/up-loader';
import { IImage } from 'src/interfaces/image.interface';
import { ActionSheetController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { User as UserService } from 'src/app/shared/services/user/user';
import { Query } from 'src/app/core/providers/query/query';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  public img!: IImage;
  // public imgUrl: string[] = [];
  public image: string = '';
  displayName = '';

  constructor(private readonly authSrv: Auth,
    private readonly router: Router,
    private readonly fileSrv: File,
    private readonly uploaderSrv: UpLoader,
    private readonly urlSrv: GlobalUrl,
    private readonly langSrv: Language,
    private actionSheetCtrl: ActionSheetController,
    private translate: TranslateService,
    private userSrv: UserService,
    private query: Query
  ) { }

  ngOnInit() {
    // Al iniciar, cargamos las imágenes del usuario actual
    this.refreshUserImages().catch(console.error);

    // Suscribirse a cambios del perfil para mostrar el nombre en Home
    this.userSrv.getProfile$().subscribe((p) => {
      if (p) {
        const full = `${p.name ?? ''} ${p.lastName ?? ''}`.trim();
        this.displayName = full;
      }
    });

    // Pre-cargar el nombre desde Firestore si aún no está en el store
    this.prefetchUserName().catch(console.error);
  }

  // También refrescar cada vez que la vista entra en foco
  ionViewWillEnter() {
    this.refreshUserImages().catch(console.error);
  }

  private async prefetchUserName() {
    const uid = await this.authSrv.waitForUid();
    if (!uid) return;
    const res = await this.query.readOneByField('users', 'uid', uid);
    const data = res?.data ?? {};
    const name = (data.name ?? '').trim();
    const lastName = (data.lastName ?? '').trim();
  const full = `${name}${lastName ? ' ' + lastName : ''}`.trim();
    if (full) this.displayName = full;
    if (name || lastName) this.userSrv.setProfile(name, lastName);
  }

  public languageChanger(event: any){
    const el = event.currentTarget as HTMLElement;
    const lang = el.getAttribute('data-lang');
    this.langSrv.changeLang(lang ?? 'en');
  }

    public async logOut(){
   await this.authSrv.logOut();
    // Navegación con replaceUrl para que no quede el estado previo en el stack
    this.router.navigate(['/login'], { replaceUrl: true });
      // limpia estado local/global de imágenes al cambiar de cuenta
      this.urlSrv.setUrls([]);
  }

  public async pickImage(){
    this.img = await this.fileSrv.pickImage();

   // Usar carpeta propia del usuario
   const uid = this.authSrv.getUid();
   if (!uid) {
     console.error('No hay sesión de usuario');
     return;
   }

   const path = await this.uploaderSrv.upload('imagen',
       `user_${uid}/${Date.now()}-${this.img.name}`,
       this.img.mimeType,
       this.img.data);
       console.log(path);

      //  const hola = await this.uploaderSrv.getUrls('images', path as any);
      //  console.log(hola);

  this.image = await this.uploaderSrv.getUrl('imagen', path);

      //  this.imgUrl.push(this.image);

    this.urlSrv.setUrl(this.image); // última URL

    // Recarga la lista completa desde el Storage del usuario
    await this.refreshUserImages();

  }

  setLanguage(lang: 'en' | 'es') {
    this.translate.use(lang);
  }

  async openSettings() {
    const sheet = await this.actionSheetCtrl.create({
      header: 'Configuración',
      buttons: [
        {
          text: 'Editar perfil',
          icon: 'person-circle',
          handler: () => this.router.navigate(['/profile'])
        },
        {
          text: 'Inglés',
          icon: 'language',
          handler: () => this.setLanguage('en')
        },
        {
          text: 'Español',
          icon: 'language',
          handler: () => this.setLanguage('es')
        },
        {
          text: 'Cerrar sesión',
          role: 'destructive',
          icon: 'log-out',
          handler: () => this.logOut?.()
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          icon: 'close'
        }
      ]
    });
    await sheet.present();
  }

  // public async callPlugin(){
  //   console.log('Calling plugin...');
  //   const resp = await myCustomPlugin.execute();
  //   console.log('LOG: RESPONSE FROM PLUGIN', JSON.stringify(resp));

  // }

  // Carga las imágenes del usuario logueado desde el bucket y actualiza el estado global
  private async refreshUserImages(): Promise<void> {
    // Espera a que el UID esté listo (tras login o hot-reload)
    const uid = await this.authSrv.waitForUid();
    if (!uid) {
      this.urlSrv.setUrls([]);
      return;
    }
    const folder = `user_${uid}`;
    const urls = await this.uploaderSrv.getUserFolderSignedUrls('imagen', folder);
    this.urlSrv.setUrls(urls);
  }

}
