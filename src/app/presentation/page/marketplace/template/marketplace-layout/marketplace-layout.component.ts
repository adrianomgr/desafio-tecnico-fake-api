import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MarketplaceHeaderComponent } from '../marketplace-header/marketplace-header.component';

@Component({
  selector: 'app-marketplace-layout',
  standalone: true,
  imports: [RouterOutlet, MarketplaceHeaderComponent],
  templateUrl: './marketplace-layout.component.html',
  styleUrl: './marketplace-layout.component.scss',
})
export class MarketplaceLayoutComponent {}
