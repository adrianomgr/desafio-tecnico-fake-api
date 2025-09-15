import { Injectable, ResourceRef, inject } from '@angular/core';
import { User } from '@app/domain/model/user';
import { AuthApiService } from '@app/infrastructure/api/auth.api.service';

@Injectable({
  providedIn: 'root',
})
export class HeaderFacadeService {
  private readonly authApiService = inject(AuthApiService);

  logout(): void {
    this.authApiService.logout();
  }

  get getProfile(): ResourceRef<User | undefined> {
    return this.authApiService.getProfile;
  }
}
