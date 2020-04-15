import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SymplTextComponent } from './sympl-text.component';

describe('SymplTextComponent', () => {
  let component: SymplTextComponent;
  let fixture: ComponentFixture<SymplTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SymplTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SymplTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
