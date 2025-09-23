import { Component, OnInit } from '@angular/core';
import myCustomPlugin, { WallpaperTarget } from 'src/app/plugins/myCustomPlugin';
import { GlobalUrl } from 'src/app/core/providers/globalUrl/global-url';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-sheet-modal',
  templateUrl: './sheet-modal.component.html',
  styleUrls: ['./sheet-modal.component.scss'],
  standalone: false
})
export class SheetModalComponent  implements OnInit {
   public actionSheetButtons = [
    {
      text: 'Fijar como pantalla principal',
      handler: () => this.applyWallpaper('home')
    },
    {
      text: 'Fijar como pantalla de bloqueo',
      handler: () => this.applyWallpaper('lock')
    },
    {
      text: 'Fijar en ambas',
      handler: () => this.applyWallpaper('both')
    },
    {
      text: 'Cancelar',
      role: 'cancel'
    }
  ];

    private async applyWallpaper(target: WallpaperTarget){
      try {
        const url = this.urlSrv.getUrl();
        if (!url) return;
        const resp = await myCustomPlugin.setWallpaper({ url, target });
        console.log('Wallpaper aplicado', resp);
        await this.presentToast(
          target === 'both'
            ? 'Fondo aplicado a principal y bloqueo'
            : target === 'lock'
              ? 'Fondo aplicado a pantalla de bloqueo'
              : 'Fondo aplicado a pantalla principal',
          'success'
        );
      } catch (e) {
        console.error(e);
        await this.presentToast('No se pudo aplicar el fondo', 'danger');
      }
    }
  constructor(private readonly urlSrv: GlobalUrl, private toastCtrl: ToastController) { }

  ngOnInit() {}

  private async presentToast(message: string, color: 'success' | 'warning' | 'danger' | 'medium' = 'medium'){
    const t = await this.toastCtrl.create({
      message,
      duration: 1800,
      position: 'bottom',
      color,
      buttons: [
        { text: 'OK', role: 'cancel' }
      ]
    });
    await t.present();
  }

}
