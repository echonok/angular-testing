import { CoursesService } from './courses.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { COURSES } from '../../../../server/db-data';

describe('CoursesService', () => {
  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        CoursesService,
      ],
    });

    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);

  })

  it('should retrieve data', () => {
    coursesService.findAllCourses().subscribe((courses) => {
      expect(courses).withContext('No courses').toBeTruthy();
      expect(courses.length).withContext('incorrect number of courses').toBe(12)
      const course = courses.find((c) => c.id === 12);
      expect(course.titles.description).toBe('Angular Testing Course');
    });
    const req = httpTestingController.expectOne('/api/courses');
    expect(req.request.method).toEqual('GET');
    req.flush({ payload: Object.values(COURSES) });
  });
});
