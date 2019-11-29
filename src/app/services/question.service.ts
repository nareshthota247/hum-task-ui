import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Question } from '../questions.model';
import { of } from 'rxjs';
import { MockQuestioner } from '../questions.mock';

const API_BASE = 'http://localhost:8082/';
const API_URLS = {
  questions : `${API_BASE}hum/questionnaire`
}

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(
    @Inject('NAVIGATOR') private navigator: any,
    private readonly http: HttpClient
  ) { }

  getAllQuestions(){
    if(this.navigator.onLine){
      return this.http.get<Question[]>(API_URLS.questions);
    }
    return of(MockQuestioner);
  }

  postResult(result){
    return this.http.post(API_URLS.questions, result);
  }

}
