import {
  ComponentFixture,
  fakeAsync,
  flush,
  flushMicrotasks,
  TestBed,
  waitForAsync
} from '@angular/core/testing';
import { CoursesModule } from '../courses.module';
import { DebugElement } from '@angular/core';

import { HomeComponent } from './home.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CoursesService } from '../services/courses.service';
import { HttpClient } from '@angular/common/http';
import { COURSES } from '../../../../server/db-data';
import { setupCourses } from '../common/setup-test-data';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { click } from '../common/test-utils';

describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: any;

  const beginnerCourses = setupCourses().filter((c) => c.category === 'BEGINNER');
  const advancedCourses = setupCourses().filter((c) => c.category === 'ADVANCED');

  beforeEach(waitForAsync(() => {

    const CoursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);

    TestBed
      .configureTestingModule({
        imports: [
          CoursesModule,
          NoopAnimationsModule,
        ],
        providers: [
          { provide: CoursesService, useValue: CoursesServiceSpy }
        ],
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        coursesService = TestBed.inject(CoursesService);
      });

  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display only beginner courses', () => {
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mdc-tab'));
    expect(tabs.length).withContext('Unexpected number of tabs found').toBe(1);
  });

  it('should display only advanced courses', () => {
    coursesService.findAllCourses.and.returnValue(of(advancedCourses));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mdc-tab'));
    expect(tabs.length).withContext('Unexpected number of tabs found').toBe(1);
  });

  it('should display both tabs', () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mdc-tab'));
    expect(tabs.length).withContext('Unexpected number of tabs found').toBe(2);
  });

  it('should display advanced courses when tab clicked', () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mdc-tab'));
    click(tabs[1]);
    fixture.detectChanges();
    const cardTitles = el.queryAll(By.css('.mat-mdc-card-title'));
    expect(cardTitles.length).withContext('Could not find card titles').toBeGreaterThan(0);
    expect(cardTitles[0].nativeElement.textContent).withContext('Could not find first title').toContain('Angular Security Course - Web Security Fundamentals');
  });

});


