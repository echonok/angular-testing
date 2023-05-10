import { CoursesService } from './courses.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { COURSES, findLessonsForCourse } from '../../../../server/db-data';
import { Course } from '../model/course';
import { HttpErrorResponse } from '@angular/common/http';

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

  it('should find course by id', () => {
    coursesService.findCourseById(12).subscribe((course) => {
      expect(course).withContext('No course').toBeTruthy();
      expect(course.id).withContext('incorrect number of courses').toBe(12)
    });
    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual('GET');
    req.flush(COURSES[12]);
  });

  it('should save course by id', () => {
    const changes: Partial<Course> = { titles: { description: 'test' } };
    coursesService.saveCourse(12, changes).subscribe((course) => {
      expect(course).withContext('No course').toBeTruthy();
      expect(course.id).withContext('incorrect id').toBe(12);
    });
    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body.titles.description).toEqual(changes.titles.description);
    req.flush({ ...COURSES[12], ...changes });
  });

  it('should give an error', () => {
    const changes: Partial<Course> = { titles: { description: 'test' } };
    coursesService.saveCourse(12, changes).subscribe(
      () => fail('the save break'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      },
    );
    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual('PUT');
    req.flush('Save course', { status: 500, statusText: 'Internal error' });
  });

  it('should find a list of lessons', () => {
    coursesService.findLessons(12).subscribe((lessons) => {
        expect(lessons).toBeTruthy();
        expect(lessons.length).toBe(3)
      },
    );
    const request = httpTestingController.expectOne((req) => req.url === '/api/lessons');
    expect(request.request.method).toEqual('GET');
    expect(request.request.params.get('courseId')).toEqual('12');
    expect(request.request.params.get('filter')).toEqual('');
    expect(request.request.params.get('sortOrder')).toEqual('asc');
    expect(request.request.params.get('pageNumber')).toEqual('0');
    expect(request.request.params.get('pageSize')).toEqual('3');
    request.flush({ payload: findLessonsForCourse(12).slice(0, 3) });
  });

  afterEach(() => {
    httpTestingController.verify();
  })
});
