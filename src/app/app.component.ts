import { Component } from '@angular/core';
import { CalcService, Day } from './calc.service'
import { FormGroup, FormControl } from '@angular/forms';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(private service: CalcService){}

  stavka = 1500
  hour_stavka = this.stavka / 8
  send_res: string = ''
  send_confirm: boolean = false
  days: any
  form: FormGroup
  date: Date = new Date()
  res_array

  total_hours
  total_minutes
  total_days
  total_money
  
  houl_minutes

  hours_value_ui = 0
  minutes_value_ui = 0

  dirka = 0

  ngOnInit(){
    this.getDays()
    this.form = new FormGroup({
      date: new FormControl(''),
      hours: new FormControl(0.0),
      minutes: new FormControl(0.0),
      overtime: new FormControl(0.0) 
    })
    this.compute_houl_working()
    console.log(this.res_array)
  }

  hoursMinus(){
    if(this.hours_value_ui == 0){
      return
    }else{
      this.hours_value_ui--
    }
  }

  hoursPlus(){
    this.hours_value_ui++
  }

  minutesMinus(){
    if(this.minutes_value_ui == 0){
      return
    }else{
      this.minutes_value_ui--
    }
  }

  minutesPlus(){
    this.minutes_value_ui++
  }


  minutesMinus10(){
    if(this.minutes_value_ui == 0){
      return
    }else{
      this.minutes_value_ui -= 10
    }
  }

  minutesPlus10(){
    this.minutes_value_ui += 10
  }


  


  compute_houl_working(){
    this.service.getAllDays()
      .subscribe(res => {
        this.res_array = res

        let total_hours = 0
        let total_minutes = 0
        //let vsego_vremeni = ''
        

        for(let i = 0; i < this.res_array.length; i++){
          total_hours += this.res_array[i].hours     
        }

        for(let i = 0; i < this.res_array.length; i++){  
          total_minutes += this.res_array[i].minutes
        }
        
        this.total_hours = total_hours
        this.total_minutes = total_minutes % 60
        this.houl_minutes = total_minutes

        // 

        //vsego_vremeni = `${this.total_hours}.${this.houl_minutes}`
         
        
        this.total_days = this.res_array.length
        this.total_money = this.total_hours * this.hour_stavka
      })
  }

  record(){
    const formData = { ...this.form.value }
    //console.log(formData.hours)
    const obj = {
      hours: formData.hours,
      minutes: formData.minutes,
      overtime: this.computeOvertime(formData.hours, formData.minutes)
    }
    
    const rec = confirm('Точно записать или случайно нажал ?')
    if(!rec){
      return
    }
    
    this.service.record(obj)
      .subscribe(() => {
        this.getDays()
        this.send_confirm = true
        this.compute_houl_working()
        this.send_res = 'Recorded successfully !'
        setTimeout(() => {
          this.send_confirm = false
          this.send_res = ''
        }, 5000)
      })
        
  }

  computeOvertime(h, m): number{
    let overtime = 0
    if(h < 8){
      overtime = 0
    }else{
      h -= 8
      const str = `${h}.${m}`
      overtime = +str
      
    }
    
    return overtime
  }

  getDays(){
    this.service.getAllDays()
      .subscribe(res => {
        
        this.days = res
      })
  }



}
