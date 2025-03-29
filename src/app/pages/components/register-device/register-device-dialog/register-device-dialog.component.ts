import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule, NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { DeviceService } from '../../../../core/services/device/device.service';


@Component({
  selector: 'app-register-device-dialog',
  standalone: true,
  imports: [
    CommonModule,
    NgFor,  
    MatOptionModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatDialogModule
  ],
  templateUrl: './register-device-dialog.component.html',
  styleUrl: './register-device-dialog.component.scss'
})
export class RegisterDeviceDialogComponent {
  registerForm: FormGroup;
  isSubmitting = false;
  ciudades: any[] = []; // Lista de ciudades dinámicas filtradas por departamento

  departamentos = [
    { id: 1, nombre: 'Antioquia' },
    { id: 2, nombre: 'Cundinamarca' },
    { id: 3, nombre: 'Valle del Cauca' }
  ];

  todasLasCiudades = [
    { id: 101, nombre: 'Medellín', departamentoId: 1 },
    { id: 102, nombre: 'Envigado', departamentoId: 1 },
    { id: 201, nombre: 'Bogotá', departamentoId: 2 },
    { id: 301, nombre: 'Cali', departamentoId: 3 },
    { id: 302, nombre: 'Palmira', departamentoId: 3 }
  ];

  constructor(
    private fb: FormBuilder,
    private deviceService: DeviceService,
    public dialogRef: MatDialogRef<RegisterDeviceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.registerForm = this.fb.group({
      sensorName: ['', Validators.required],
      model: ['', Validators.required],
      mac: ['', [Validators.required, Validators.pattern(/^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/i)]],
      department: [1, Validators.required],
      city: [101, Validators.required],
      switchOutput: [false]
    });

    // Inicializar ciudades según el departamento por defecto
    this.onDepartamentoChange(this.registerForm.value.departament);
  }

  filtrarCiudades(departamentoId: number): void {
    this.ciudades = this.todasLasCiudades.filter(c => c.departamentoId === departamentoId);
    this.registerForm.get('city')?.setValue(this.ciudades.length ? this.ciudades[0].id : null);
  }

  onDepartamentoChange(departamentoId: number): void {
    this.ciudades = this.todasLasCiudades.filter(c => c.departamentoId === departamentoId);
    const ciudadSeleccionada = this.registerForm.value.city;
    this.registerForm.patchValue({ 
      department: departamentoId,
      city: this.ciudades.length ? this.ciudades[0].id : null
    });
  }

  save(): void {
    if (this.registerForm.valid) {
      this.isSubmitting = true;
      this.deviceService.registerDevice(this.registerForm.value).subscribe({
        next: (response) => {
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Error al registrar el dispositivo:', error);
          this.isSubmitting = false;
        }
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}