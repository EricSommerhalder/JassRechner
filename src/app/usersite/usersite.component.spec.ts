import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersiteComponent } from './usersite.component';

describe('UsersiteComponent', () => {
  let component: UsersiteComponent;
  let fixture: ComponentFixture<UsersiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
