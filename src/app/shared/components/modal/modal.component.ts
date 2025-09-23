import { Component, OnInit } from '@angular/core';
import myCustomPlugin from 'src/app/plugins/myCustomPlugin';
import { GlobalUrl } from '../../../core/providers/globalUrl/global-url';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: false,
})
export class ModalComponent  implements OnInit {

  constructor(
    private readonly urlSrv: GlobalUrl,
  ) { }

  ngOnInit() {}

    public async callPlugin(){
      const url = this.urlSrv.getUrl();
      if (!url) return;
      console.log('Calling plugin with setWallpaper...');
      const resp = await myCustomPlugin.setWallpaper({ url, target: 'home' });
      console.log('LOG: RESPONSE FROM PLUGIN', JSON.stringify(resp));
    }

}
