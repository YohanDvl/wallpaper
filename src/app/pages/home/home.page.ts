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

  constructor(private readonly authSrv: Auth,
    private readonly router: Router,
    private readonly fileSrv: File,
    private readonly uploaderSrv: UpLoader,
    private readonly urlSrv: GlobalUrl,
    private readonly langSrv: Language,
    private actionSheetCtrl: ActionSheetController,
    private translate: TranslateService
  ) { }

  ngOnInit() {

  }

  public languageChanger(event: any){
    const el = event.currentTarget as HTMLElement;
    const lang = el.getAttribute('data-lang');
    this.langSrv.changeLang(lang ?? 'en');
  }

    public async logOut(){
   await this.authSrv.logOut();
    this.router.navigate(['/login']);
  }

  public async pickImage(){
    this.img = await this.fileSrv.pickImage();

   const path = await this.uploaderSrv.upload('imagen',
       `${Date.now()}-${this.img.name}`,
       this.img.mimeType,
       this.img.data);
       console.log(path);

      //  const hola = await this.uploaderSrv.getUrls('images', path as any);
      //  console.log(hola);

       this.image = await this.uploaderSrv.getUrl('imagen', path);

      //  this.imgUrl.push(this.image);

       this.urlSrv.setUrl(this.image); //Seteamos la url para hacerla global con el servicio

       this.urlSrv.addUrl(this.image);//Array glodal de imagenes

  }

  setLanguage(lang: 'en' | 'es') {
    this.translate.use(lang);
  }

  async openSettings() {
    const sheet = await this.actionSheetCtrl.create({
      header: 'Configuración',
      buttons: [
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

}
