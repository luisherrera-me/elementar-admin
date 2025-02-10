import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterDeviceDialogComponent } from './register-device-dialog.component';

describe('RegisterDeviceDialogComponent', () => {
  let component: RegisterDeviceDialogComponent;
  let fixture: ComponentFixture<RegisterDeviceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterDeviceDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterDeviceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
