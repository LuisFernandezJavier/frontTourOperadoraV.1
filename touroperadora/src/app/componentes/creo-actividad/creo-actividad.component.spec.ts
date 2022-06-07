import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreoActividadComponent } from './creo-actividad.component';

describe('CreoActividadComponent', () => {
  let component: CreoActividadComponent;
  let fixture: ComponentFixture<CreoActividadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreoActividadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreoActividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
