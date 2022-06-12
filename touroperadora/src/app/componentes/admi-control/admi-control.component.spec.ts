import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmiControlComponent } from './admi-control.component';

describe('AdmiControlComponent', () => {
  let component: AdmiControlComponent;
  let fixture: ComponentFixture<AdmiControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmiControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmiControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
