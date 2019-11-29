import { Component, OnInit, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { QuestionService } from './services/question.service';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { Question, Option } from './questions.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  UI_STATES = {
    loading : 'LOADING',
    questionsLoaded : 'QUESTIONS_LOADED',
    formSubmitted : 'FORM_SUBMITTED',
    formErrorResponse : 'FORM_RESPONSE_ERROR'
  };

  uiState: string = this.UI_STATES.loading;
  questionsForm: FormGroup;
  formSuccessState;

  currentQuestionIndex = 0;

  constructor(
    @Inject('NAVIGATOR') private navigator: any,
    @Inject('WINDOW') private window: any,
    private questionService: QuestionService,
    private formBuilder: FormBuilder,
    private changeDetectionRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getAllQuestions();
    console.log(this.navigator);
    this.window.addEventListener('online', this.markForCheck);
    this.window.addEventListener('offline', this.markForCheck);
  }

  ngOnDestroy(){
    this.window.removeEventListener('online', this.markForCheck);
    this.window.removeEventListener('offline', this.markForCheck);
  }

  markForCheck(){
    this.changeDetectionRef.markForCheck();
  }

  getAllQuestions() {
    this.questionService.getAllQuestions()
      .subscribe(response => {
        this.questionsForm = this.createQuestionsForm(response);
        console.log(this.questionsForm);
        this.uiState = this.UI_STATES.questionsLoaded;
      })
  }

  createQuestionsForm(questions: Question[]): FormGroup {
    return this.formBuilder.group({
      questionsForm: this.getQuestionsFormArray(questions)
    });
  }

  getQuestionsFormArray(questions: Question[]): FormArray {
    let questionsFormArray: FormArray = new FormArray([]);
    questions.forEach((question) => {
      questionsFormArray.push(this.getQuestionsForm(question));
    });
    return questionsFormArray;
  }

  getQuestionsForm(question: Question): FormGroup {
    return this.formBuilder.group({
      id: [question.id],
      question: [question.question],
      options: this.getOptionsFormArray(question.options),
      answer: [null, [Validators.required]]
    });
  }

  getOptionsFormArray(options: Option[]): FormArray {
    let formArray = new FormArray([]);
    options.forEach((option) => {
      formArray.push(this.getOptionsForm(option));
    });
    return formArray;
  }

  getOptionsForm(option: Option): FormGroup {
    return this.formBuilder.group({
      description: [option.description],
      option: [option.option]
    });
  }

  onPrevClickHandler() {
    this.currentQuestionIndex--;
  }
  onNextClickHandler() {
    this.currentQuestionIndex++;
  }

  onSubmit(form: FormGroup) {
    this.questionService.postResult(this.transformPayload(form.value.questionsForm))
      .subscribe(response => {
        this.uiState = this.UI_STATES.formSubmitted;
        this.formSuccessState = response;
      })
  }

  transformPayload(questions: Question[]) {
    return questions.map((question) => {
      return {
        id: question.id,
        selectedOption: question.answer
      }
    });
  }

}
