import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostulacionesResueltasComponent } from './postulaciones-resueltas.component';

describe('PostulacionesResueltasComponent', () => {
  let component: PostulacionesResueltasComponent;
  let fixture: ComponentFixture<PostulacionesResueltasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostulacionesResueltasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostulacionesResueltasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
