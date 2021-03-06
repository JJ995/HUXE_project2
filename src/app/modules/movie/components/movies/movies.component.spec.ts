import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesComponent } from './movies.component';
import { Apollo } from 'apollo-angular';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { ApolloTestingModule } from 'apollo-angular/testing';

describe('MoviesComponent', () => {
  let component: MoviesComponent;
  let buttonElement: HTMLElement;
  let button: HTMLElement;
  let fixture: ComponentFixture<MoviesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoviesComponent ],
      providers: [
        Apollo
      ],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        ApolloTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;
    buttonElement = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('search window test', () => {
    component.searchQuery = 'fight club';
    component.onSubmit();
    expect(component.searchActive).toBe(true);
    component.backToList();
    expect(component.searchActive).toBe(false);
  });

  it('show back to my movies button after search', () => {
    component.searchQuery = 'fight club';
    component.onSubmit();
    expect(component.searchActive).toBe(true);
    fixture.detectChanges();
    button = buttonElement.querySelector('button');
    expect(button.innerText).toContain('Back to favorites');
  });
});
