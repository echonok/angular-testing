import { CalculatorService } from './calculator.service';
import { LoggerService } from './logger.service';
import { TestBed } from '@angular/core/testing';

describe('CalculateService', () => {

  let loggerSpy: any;
  let calculator: CalculatorService;

  beforeEach(() => {
    loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);
    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        { provide: LoggerService, useValue: loggerSpy },
      ]
    })
    calculator = TestBed.inject(CalculatorService);
  });

  it('should add tow numbers', () => {
    const res = calculator.add(2, 2);
    expect(res).toEqual(4);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });

  it('should subtract tow numbers', () => {
    const res = calculator.subtract(4, 2);
    expect(res).withContext('unexpected subtraction').toEqual(2);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });
});
