import { TestBed } from '@angular/core/testing'
import { Provider } from '@angular/core'

import { createSpyFromClass } from 'jasmine-auto-spies'

interface SetupConf {
  componentClass: any
  driver: any
  servicesToStub?: any[]
  declarations?: any[]
  providers?: any[]
  imports?: any[]
}

export function componentTestingSetup({
  componentClass,
  driver: ComponentDriver,
  servicesToStub = [],
  declarations = [],
  providers = [],
  imports = []
}: SetupConf) {
  servicesToStub = servicesToStub.map<Provider>(serviceClass => ({
    provide: serviceClass,
    useValue: createSpyFromClass(serviceClass)
  }))

  TestBed.configureTestingModule({
    declarations: [componentClass].concat(declarations),
    providers: providers.concat(servicesToStub),
    imports
  })

  return {
    createComponentDriver() {
      return new ComponentDriver(TestBed.createComponent(componentClass), TestBed)
    }
  }
}
