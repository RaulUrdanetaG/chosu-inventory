import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Location } from 'src/app/interfaces/locations';
import { Owner } from 'src/app/interfaces/owners';
import { Tag } from 'src/app/interfaces/tags';
import { LocationService } from 'src/app/services/location.service';
import { OwnersService } from 'src/app/services/owners.service';
import { TagsService } from 'src/app/services/tags.service';

@Component({
  selector: 'app-update-modal',
  templateUrl: './update-modal.component.html',
  styleUrls: ['./update-modal.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class UpdateModalComponent {
  @ViewChild('updateOwnerInput') updateOwnerInput: ElementRef | undefined;
  @ViewChild('updateTagInput') updateTagInput: ElementRef | undefined;
  @ViewChild('updateLocationInput') updateLocationInput: ElementRef | undefined;

  ownerForm: FormGroup;
  tagForm: FormGroup;
  locationForm: FormGroup;
  isValid: boolean = true;
  exists: boolean = false;
  currentOwner: Owner = { _id: '', owner: '' };
  currentTag: Tag = { _id: '', tagname: '' };
  currentLocation: Location = { _id: '', location: '' };

  isLoading: boolean = false;

  constructor(
    public ownersService: OwnersService,
    public tagsService: TagsService,
    public locationsService: LocationService
  ) {
    this.ownerForm = new FormGroup({
      owner: new FormControl(),
    });
    this.tagForm = new FormGroup({
      tagname: new FormControl(),
    });
    this.locationForm = new FormGroup({
      location: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.ownersService.SelectedOwner$.subscribe((owner) => {
      this.currentOwner = owner;
      this.ownerForm.get('owner')?.setValue(owner.owner);
    });
    this.tagsService.SelectedTag$.subscribe((tag) => {
      this.currentTag = tag;
      this.tagForm.get('tagname')?.setValue(tag.tagname);
    });
    this.locationsService.SelectedLocation$.subscribe((location) => {
      this.currentLocation = location;
      this.locationForm.get('location')?.setValue(location.location);
    });
  }

  async onSubmitOwner() {
    this.isLoading = true;
    if (this.ownerForm.valid) {
      this.isValid = true;

      // process input tag to maintain a structure for the update, and sedns previous tag to know wich tag to update
      const processedOwner = {
        _id: this.currentOwner?._id,
        owner:
          this.ownerForm.value.owner.charAt(0).toUpperCase() +
          this.ownerForm.value.owner.slice(1).toLowerCase(),
        prevOwner: this.currentOwner.owner,
      };

      // updates the tag in the tags and items db
      await this.ownersService.updateOwner(processedOwner);

      this.ownersService.setOwners();
      this.ownersService.isUpdateOwnerModal = false;
    } else {
      this.isValid = false;
    }
    this.isLoading = false;
  }

  async onSubmitTag() {
    this.isLoading = true;
    if (this.tagForm.valid) {
      this.isValid = true;

      // process input tag to maintain a structure for the update, and sedns previous tag to know wich tag to update
      const porcessedTag = {
        _id: this.currentTag?._id,
        tagname:
          this.tagForm.value.tagname.charAt(0).toUpperCase() +
          this.tagForm.value.tagname.slice(1).toLowerCase(),
        prevTag: this.currentTag.tagname,
      };

      // updates the tag in the tags and items db
      await this.tagsService.updateTag(porcessedTag);

      this.tagsService.setTags();
      this.tagsService.isUpdateTagModal = false;
    } else {
      this.isValid = false;
    }
    this.isLoading = false;
  }

  async onSubmitLocation() {
    this.isLoading = true;
    if (this.locationForm.valid) {
      this.isValid = true;

      // process input tag to maintain a structure for the update, and sedns previous tag to know wich tag to update
      const porcessedTag = {
        _id: this.currentLocation?._id,
        location:
          this.locationForm.value.location.charAt(0).toUpperCase() +
          this.locationForm.value.location.slice(1).toLowerCase(),
        prevLocation: this.currentLocation.location,
      };

      // updates the tag in the tags and items db
      await this.locationsService.updateLocation(porcessedTag);

      this.locationsService.setLocations();
      this.locationsService.isUpdateLocationModal = false;
    } else {
      this.isValid = false;
    }
    this.isLoading = false;
  }

  ngAfterViewInit(): void {
    this.updateOwnerInput?.nativeElement.focus();
    this.updateTagInput?.nativeElement.focus();
    this.updateLocationInput?.nativeElement.focus();
  }
}
