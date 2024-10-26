import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicGridStackExampleComponent } from './basic-grid-stack-example.component';

describe('BasicGridStackExampleComponent', () => {
  let component: BasicGridStackExampleComponent;
  let fixture: ComponentFixture<BasicGridStackExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicGridStackExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicGridStackExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
