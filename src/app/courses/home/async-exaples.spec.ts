import { fakeAsync, flush, flushMicrotasks, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

describe('Async test', () => {
  it('Async test 1', (done: DoneFn) => {
    let test = false;
    setTimeout(() => {
      test = true;
      expect(test).toBeTruthy();
      done();
    }, 1_000);
  });

  it('Async test 2', fakeAsync(() => {
    let test = false;
    setTimeout(() => test = true, 1_000);
    tick(1_000);
    expect(test).toBeTruthy();
  }));

  it('Async test 3', fakeAsync(() => {
    let test = false;
    setTimeout(() => test = true, 1_000);
    flush();
    expect(test).toBeTruthy();
  }));

  it('Async test 4', fakeAsync(() => {
    let test = false;
    Promise.resolve().then(() => {
      test = true;
    });
    flushMicrotasks();
    expect(test).toBeTruthy();
  }));

  it('Async test 5', fakeAsync(() => {
    let counter = 0;
    Promise.resolve().then(() => {
      counter = counter + 10;
      setTimeout(() => counter = counter + 1, 1_000);
    });
    expect(counter).toEqual(0);
    flushMicrotasks();
    expect(counter).toEqual(10);
    tick(500);
    expect(counter).toEqual(10);
    tick(500);
    expect(counter).toEqual(11);
  }));

  it('Async test 6', fakeAsync(() => {
    let test = false;
    const test$ = of(test).pipe(
      delay(1_000),
    );
    test$.subscribe(() => {
      test = true;
    });
    tick(1_000);
    expect(test).toEqual(true);
  }));
});
