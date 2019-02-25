import { Component, Directive, Injectable, Input } from '@angular/core'
import { Observable, of } from 'rxjs'
import { first } from 'rxjs/operators'

import { AsyncSpyable } from 'jasmine-auto-spies'

import { ComponentDriver } from './component-driver'

export interface QuestionData {
  question: string
  answers: string[]
}

@Directive({
  selector: '[answerDirective]'
})
export class AnswerDirective {
  @Input('answerDirective') answer: string
}

@Directive({
  selector: '[nonexistentDirective]'
})
export class NonexistentDirective {}

@Injectable()
export class QuestionService {
  @AsyncSpyable()
  getQuestion(): Observable<QuestionData> {
    return of(null)
  }
}

@Component({
  template: `
    <div class="question">{{ questionData.question }}</div>
    <div *ngFor="let answer of questionData.answers" [answerDirective]="answer">{{ answer }}</div>
    <button>Previous</button>
    <button>Next</button>
  `
})
export class QuestionComponent {
  questionData: QuestionData

  constructor(questionService: QuestionService) {
    questionService
      .getQuestion()
      .pipe(first())
      .subscribe(question => {
        this.questionData = question
      })
  }
}

export class QuestionComponentDriver extends ComponentDriver<QuestionComponent> {
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

  get nonexistentElement() {
    return this.querySelector('.non-existent')
  }

  get nonexistentElements() {
    return this.querySelectorAll('.non-existent')
  }

  get nonexistentDirective() {
    return this.queryDirective(NonexistentDirective)
  }

  get nonexistentDirectives() {
    return this.queryDirectiveAll(NonexistentDirective)
  }
}
