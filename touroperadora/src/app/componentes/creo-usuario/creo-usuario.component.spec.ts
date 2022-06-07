import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreoUsuarioComponent } from './creo-usuario.component';

describe('CreoUsuarioComponent', () => {
  let component: CreoUsuarioComponent;
  let fixture: ComponentFixture<CreoUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreoUsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreoUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
