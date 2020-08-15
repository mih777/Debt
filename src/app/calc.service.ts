import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

export interface Day{
  _id: string,
  hours: number,
  minutes: number,
  overtime: number  
}

@Injectable({
  providedIn: 'root'
})
export class CalcService {

  prod_url: string = ''

  local_url: string = 'http://localhost:3000'

  days: Day[] = []

  constructor(private http: HttpClient) { }

  record(body: any): Observable<Day[]>{
    return this.http.post<Day[]>(`${this.local_url}/api/debt/create`, body)
  }

  getAllDays(){
    return this.http.get(`${this.local_url}/api/debt/get/debt`)
  }

  updateDay(id: string, body: Day): Observable<Day>{
    return this.http.put<Day>(`${this.local_url}/api/debt/update/${id}`, body)
  }

  

}
