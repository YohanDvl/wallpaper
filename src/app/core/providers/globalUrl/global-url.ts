import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalUrl {
  private imgUrl: string = '';
  private imgUrls: string[] = [];
  private urlsSubject = new BehaviorSubject<string[]>([]);

  setUrl(url: string){
    this.imgUrl = url;
  }

  getUrl(): string{
    return this.imgUrl;
  }

  setUrls(urls: string[]){
    this.imgUrls = urls;
    this.urlsSubject.next([...this.imgUrls]);
  }

  getUrls(): string[]{
    return this.imgUrls;
  }

  getUrls$(): Observable<string[]> {
    return this.urlsSubject.asObservable();
  }

  addUrl(url: string){
    this.imgUrls.push(url);
    this.urlsSubject.next([...this.imgUrls]);
  }

  removeUrl(url: string){
    this.imgUrls = this.imgUrls.filter(u => u !== url);
    this.urlsSubject.next([...this.imgUrls]);
    if (this.imgUrl === url) {
      this.imgUrl = '';
    }
  }

}
