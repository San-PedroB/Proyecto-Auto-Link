import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViajesEnCursoPage } from './viajes-en-curso.page';

describe('ViajesEnCursoPage', () => {
  let component: ViajesEnCursoPage;
  let fixture: ComponentFixture<ViajesEnCursoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViajesEnCursoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
