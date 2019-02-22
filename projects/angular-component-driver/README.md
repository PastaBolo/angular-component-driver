# AngularComponentDriver

Test your Angular components in an easiest way with component drivers ! 🚕

## Table of contents

- [Set up](#set-up)
- [Accessing the fixture properties](#accessing-the-fixture-properties)
- [Query DOM elements, Directives and Components](#query-dom-elements-directives-and-components)
- [Accessing the injector](#accessing-the-injector)
- [Mock services with spies](#mock-services-with-spies)
- [Accessing the TestBed](#accessing-the-TestBed)
- [Example](#example)

## Set up

### 1 - driver creation

Create a class that extends the ComponentDriver class :

```ts
class MyComponentDriver extends ComponentDriver<MyComponent> {}
```

### 2 - componentTestingSetup usage

The `componentTestingSetup` is used to set up the component driver. Create a function that returns the result of the `componentTestingSetup` by passing at least your component class and the driver associated to the component :

```ts
function testingSetup() {
  return componentTestingSetup({
    componentClass: MyComponent,
    driver: MyComponentDriver
  })
}
```

Other optional parameters can be defined in the conf passed to this method :

```ts
{
  componentClass: any
  driver: any
  servicesToStub?: any[]
  declarations?: any[]
  providers?: any[]
  imports?: any[]
}
```

- `servicesToSub` (_optional_) refers to the services that need a mock by creating a Spy. It uses the [jasmine-auto-spies](https://github.com/hirezio/jasmine-auto-spies) package under the hood.
- `declarations`, `providers`, `imports` are optionals and are used in the same way that if you declare the TestBed configurations (because it uses the TestBed behind the scenes)

### 3 - get your component driver

Get your component driver by calling the `componentTestingSetup` method returned by `componentTestingSetup`

```ts
describe('ComponentDriver', () => {
  let questionComponentDriver: QuestionComponentDriver

  beforeEach(() => {
    myComponentDriver = testingSetup().createComponentDriver()
  })
})
```

## Accessing the fixture properties

You can easily access to the fixture properties like this :

```ts
myComponentDriver.componentInstance
myComponentDriver.detectChanges()
...
```

## Query DOM elements, Directives and Components

You can access to DOM elements, directives and components defined inside the component you are testing.

In your MyComponentDriver class, you have to add the appropriate methods to query what you need. For example :

```ts
class MyComponentDriver extends ComponentDriver<MyComponent> {
  get questionElement() {
    return this.querySelector('.my-element')
  }
  get buttonElements() {
    return this.querySelectorAll<HTMLButtonElement>('button')
  }
  get firstMyDirective() {
    return this.queryDirective(MyDirective)
  }
  get myChildComponents() {
    return this.queryDirectiveAll(MyChildComponent)
  }
}
```

The ComponentDriver class exposes 4 methods to query elements and directives (components) :

```ts
querySelector<T = HTMLElement>: (cssSelector: string) => T

querySelectorAll<T = HTMLElement>: (cssSelector: string) => T[]

queryDirective<T>: (directive: Type<T>) => T

queryDirectiveAll<T>: (directive: Type<T>) => T[]
```

For `querySelector` and `querySelectorAll` methods, you can specify the type of the queried element (_HTMLElement by default_).

For `queryDirective` and `queryDirectiveAll` methods, you don't have to specify the type, it is automatically returned.

## Accessing the injector

You can easily access to the injector to get services :

```ts
import { Spy } from 'jasmine-auto-spies'

describe('ComponentDriver', () => {
  let myServiceSpy: Spy<MyService>

  beforeEach(() => {
    myServiceSpy = myComponentDriver.injector.get(MyService)
  })
})
```

## Mock services with spies

[jasmine-auto-spies](https://github.com/hirezio/jasmine-auto-spies) is used behind the scenes, click on the link to get more informations about how to create mocks in the easiest way you can find 😉

_"Creating spies has never been EASIER! 💪👏_", Shai Reznik, author of jasmine-auto-spies

1. add services to mock in the conf via the servicesToStub array
2. access to the spied service via the injector
3. mock the returned values of the service methods your component use

```ts
function testingSetup() {
  return componentTestingSetup({
    componentClass: MyComponent,
    driver: MyComponentDriver,
    // 1 - add services to mock here
    servicesToStub: [myService]
  })
}

describe('ComponentDriver', () => {
  let myComponentDriver: MyComponentDriver
  let myServiceSpy: Spy<MyService>

  beforeEach(() => {
    myComponentDriver = testingSetup().createComponentDriver()
    // 2 - get the spied service via the injector
    myServiceSpy = myComponentDriver.injector.get(MyService)
    // 3 - Mock the returned value, visit the jasmine-auto-spies page to get more informations
    questionServiceSpy.getQuestion.and.nextWith(questionData)
  })
})
```

## Accessing the TestBed

the `componentTestingSetup` method sets up the TestBed under the hood. You still can access it if needed like this :

```
componentDriver.TestBed
```

---

## Example

In this example, we use the [jasmine-given](https://github.com/searls/jasmine-given) library to write our test suite with `Given`, `When`, `Then` functions.

- `Given` : describe the input
- `When` : describe the action
- `Then` : describe the output

> You can use one of my other packages [angular-karma-gwt](https://github.com/PastaBolo/angular-karma-gwt) to setup everything you need to use `jasmine-given` and some other cool stuff. A simple `ng add angular-karma-gwt` will download the packages and set up everything you need automatically.

### Our app

Let's assume that our app is composed by :

- a question component
- a service component
- an answer directive binded to our element that display the answers

```ts
@Component({
  template: `
    <div class="question">{{ questionData.question }}</div>
    <div *ngFor="let answer of questionData.answers" [answerDirective]="answer">{{ answer }}</div>
    <button>Previous</button>
    <button>Next</button>
  `
})
class QuestionComponent {
  questionData: QuestionData

  constructor(questionService: QuestionService) {
    questionService
      .getQuestion()
      .pipe(first())
      .subscribe(question => {
        console.log('question')
        this.questionData = question
      })
  }
}

@Injectable()
class QuestionService {
  @AsyncSpyable() // => Decorator from the jasmine-auto-spies package
  getQuestion(): Observable<QuestionData> {
    return of(null)
  }
}

@Directive({
  selector: '[answerDirective]'
})
class AnswerDirective {
  @Input('answerDirective') answer: string
}
```

### 1 - Create your component driver class

This class can be empty and only extend the ComponentDriver class. But here, we added some methods to query some elements (DOM and directives) of our component to test the UI.

You can query child component in the same way you query directives (components are directives).

```ts
class QuestionComponentDriver extends ComponentDriver<QuestionComponent> {
  get questionElement() {
    return this.querySelector('.question')
  }
  get buttonElements() {
    return this.querySelectorAll<HTMLButtonElement>('button')
  }
  get firstAnswerDirective() {
    return this.queryDirective(AnswerDirective)
  }
  get answerDirectives() {
    return this.queryDirectiveAll(AnswerDirective)
  }
}
```

2 - Write your test suite

```ts
function testingSetup() {
  return componentTestingSetup({
    componentClass: QuestionComponent,
    driver: QuestionComponentDriver,
    servicesToStub: [QuestionService],
    declarations: [AnswerDirective]
  })
}

describe('QuestionComponent', () => {
  let questionComponentDriver: QuestionComponentDriver
  let questionServiceSpy: Spy<QuestionService>

  beforeEach(() => {
    questionComponentDriver = testingSetup().createComponentDriver()
    questionServiceSpy = questionComponentDriver.injector.get(QuestionService)
  })

  // jasmine-given magic here
  describe('GIVEN a question is available THEN it is displayed', () => {
    let questionData: QuestionData

    // Input
    Given(() => {
      questionData = {
        question: 'What do you prefer ?',
        answers: ['pizza', 'burger']
      }

      questionServiceSpy.getQuestion.and.nextWith(questionData)
    })

    // Action
    When(() => {
      questionComponentDriver.detectChanges()
    })

    // Output
    Then(() => {
      // testing our component data
      expect(questionComponentDriver.componentInstance.questionData).toEqual(questionData)

      // testing the DOM element that displays the question
      expect(questionComponentDriver.questionElement.textContent).toContain(questionData.question)

      // testing the buttons 'previous' and 'next'
      const [btnPrevious, btnNext] = questionComponentDriver.buttonElements
      expect(btnPrevious.textContent).toContain('Previous')
      expect(btnNext.textContent).toContain('Next')

      // testing the first AnswerDirective
      expect(questionComponentDriver.firstAnswerDirective.answer).toBe(questionData.answers[0])

      //testing all the AnswerDirectives
      const [firstAnswer, secondAnswer] = questionComponentDriver.answerDirectives
      expect(firstAnswer.answer).toBe(questionData.answers[0])
      expect(secondAnswer.answer).toBe(questionData.answers[1])
    })
  })
})
```
