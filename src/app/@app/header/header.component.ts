import { Component, inject, Input, OnInit, viewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import { MatBadge } from '@angular/material/badge';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { SoundEffectDirective, ThemeManagerService } from '@elementar/components/core';
import { LayoutApiService } from '@elementar/components/layout';
import { DicebearComponent } from '@elementar/components/avatar';
import { AssistantSearchComponent, NotificationsPopoverComponent } from '@elementar/store/header';
import { PopoverTriggerForDirective } from '@elementar/components/popover';
import { AuthService } from '../../core/services/auth.service';
@Component({
  selector: 'app-header',
  imports: [
    MatIcon,
    CommonModule,
    MatIconButton,
    MatBadge,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    DicebearComponent,
    MatDivider,
    MatButton,
    MatTooltip,
    RouterLink,
    AssistantSearchComponent,
    MatAnchor,
    SoundEffectDirective,
    NotificationsPopoverComponent,
    PopoverTriggerForDirective
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {
    'class': 'block w-full h-full'
  }
})
export class HeaderComponent implements OnInit{
  protected _themeManager = inject(ThemeManagerService);
  private _layoutApi = inject(LayoutApiService);
  users: any = null;
  @Input()
  sidebarHidden = false;

  toggleSidebar(): void {
    if (!this.sidebarHidden) {
      this._layoutApi.hideSidebar('root');
    } else {
      this._layoutApi.showSidebar('root');
    }

    this.sidebarHidden = !this.sidebarHidden;
  }
  ngOnInit() {
    this.loadUsers();
  }

  constructor(
        private authService: AuthService
      ) {}
    
      logout(): void {
  
        this.authService.logout();
      }
  
    loadUsers(): void {
      const userData = this.authService.getUserStorage(); 
      //console.log("usuario data", userData) Obtén el usuario desde el servicio
      if (userData) {
        this.users = userData;
      }
    }
}
