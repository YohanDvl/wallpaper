import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { GlobalUrl } from 'src/app/core/providers/globalUrl/global-url';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone:false
})
export class CardComponent  implements OnInit, OnDestroy {
  @Input() src: string = '';


  public imgUrl: string[] = [];
  private sub?: Subscription;



  constructor(private readonly urlSrv: GlobalUrl) { }

  ngOnInit() {
    this.imgUrl = this.urlSrv.getUrls();
    this.sub = this.urlSrv.getUrls$().subscribe(urls => {
      this.imgUrl = urls;
    });
  }

  setNewUrl(url: string){
    this.urlSrv.setUrl(url);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

}
