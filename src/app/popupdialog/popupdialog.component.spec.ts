import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupdialogComponent } from './popupdialog.component';

describe('PopupdialogComponent', () => {
  let component: PopupdialogComponent;
  let fixture: ComponentFixture<PopupdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
