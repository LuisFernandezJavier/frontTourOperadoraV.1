import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreoItinerarioComponent } from './creo-itinerario.component';

describe('CreoItinerarioComponent', () => {
  let component: CreoItinerarioComponent;
  let fixture: ComponentFixture<CreoItinerarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreoItinerarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreoItinerarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
