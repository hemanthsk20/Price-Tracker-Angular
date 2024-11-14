import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalsModalsComponent } from './portals-modals.component';

describe('PortalsModalsComponent', () => {
  let component: PortalsModalsComponent;
  let fixture: ComponentFixture<PortalsModalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortalsModalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortalsModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
