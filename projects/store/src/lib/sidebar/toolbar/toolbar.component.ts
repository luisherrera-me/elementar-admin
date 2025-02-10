import { Component, Input } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { DicebearComponent } from '@elementar/components/avatar';
import { HDividerComponent } from '@elementar/components/divider';

@Component({
  selector: 'emr-sidebar-toolbar',
  imports: [
    MatBadge,
    MatIcon,
    MatIconButton,
    MatTooltip,
    DicebearComponent,
    HDividerComponent
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})

export class ToolbarComponent {
  @Input() subscription: string;
  @Input() email: string;
  @Input() name: string;
}
