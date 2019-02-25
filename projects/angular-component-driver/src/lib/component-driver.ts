import { ComponentFixture, TestBedStatic } from '@angular/core/testing'
import { Type } from '@angular/core'
import { By } from '@angular/platform-browser'

type PublicPart<T> = { [P in keyof T]: T[P] }

export class ComponentDriver<T = any> implements PublicPart<ComponentFixture<T>> {
  injector: { get(token: any, notFoundValue?: any): any }

  // ComponentFixture implementation
  componentRef = this.fixture.componentRef
  ngZone = this.fixture.ngZone
  debugElement = this.fixture.debugElement
  componentInstance = this.fixture.componentInstance
  nativeElement = this.fixture.nativeElement
  elementRef = this.fixture.elementRef
  changeDetectorRef = this.fixture.changeDetectorRef
  detectChanges(checkNoChanges?: boolean): void {
    this.fixture.detectChanges(checkNoChanges)
  }
  checkNoChanges(): void {
    this.fixture.checkNoChanges()
  }
  autoDetectChanges(autoDetect?: boolean): void {
    this.fixture.autoDetectChanges(autoDetect)
  }
  isStable(): boolean {
    return this.fixture.isStable()
  }
  whenStable(): Promise<any> {
    return this.fixture.whenStable()
  }
  whenRenderingDone(): Promise<any> {
    return this.fixture.whenRenderingDone()
  }
  destroy(): void {
    this.fixture.destroy()
  }

  constructor(private fixture: ComponentFixture<T>, public TestBed: TestBedStatic) {
    this.injector = { get: TestBed.get }
  }

  protected querySelector<U = HTMLElement>(selector: string): U {
    const debugElement = this.debugElement.query(By.css(selector))
    return debugElement ? debugElement.nativeElement : null
  }

  protected querySelectorAll<U = HTMLElement>(selector: string): U[] {
    return this.debugElement.queryAll(By.css(selector)).map(element => element.nativeElement)
  }

  protected queryDirective<U>(directive: Type<U>): U {
    const debugElement = this.debugElement.query(By.directive(directive))
    return debugElement ? debugElement.injector.get(directive) : null
  }

  protected queryDirectiveAll<U>(directive: Type<U>): U[] {
    return this.debugElement
      .queryAll(By.directive(directive))
      .map(debugElement => debugElement.injector.get(directive))
  }
}
