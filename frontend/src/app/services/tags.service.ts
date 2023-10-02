import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../config';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  isNewTagModal: boolean = false;
  isModifyTagModal: boolean = false;

  tags: string[] = [];

  private _selectedTag = new BehaviorSubject<string>('');
  SelectedTag$ = this._selectedTag.asObservable();

  //  creates observable for tags variable
  private _tags = new BehaviorSubject<string[]>(['']);
  tags$ = this._tags.asObservable();

  constructor(private http: HttpClient) {}

  getTags() {
    return firstValueFrom(this.http.get<any>(AppConfig.baseUrl + '/tags'));
  }

  async setTags() {
    // gets tags from the db
    const resTags = await this.getTags();
    this.tags = [];
    // stores the tags retrieved from db into the observable
    resTags.forEach((tag: any) => {
      this.tags.push(tag.tagname);
    });
    // updates the observable
    this._tags.next(this.tags);
  }

  setSelectedTag(tagname: string) {
    // updates observable
    this._selectedTag.next(tagname);
  }

  createTag(tagname: any) {
    return firstValueFrom(
      this.http.post<any>(AppConfig.baseUrl + '/tags/addTag', tagname)
    );
  }

  openNewTagModal(command: string) {
    if (command === 'open') {
      this.isNewTagModal = true;
    } else if (command === 'close') {
      this.isNewTagModal = false;
    }
  }
}
