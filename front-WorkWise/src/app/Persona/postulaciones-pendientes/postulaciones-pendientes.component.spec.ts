import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostulacionesPendientesComponent } from './postulaciones-pendientes.component';

describe('PostulacionesPendientesComponent', () => {
  let component: PostulacionesPendientesComponent;
  let fixture: ComponentFixture<PostulacionesPendientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostulacionesPendientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostulacionesPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
