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
  one_minute = this.hour_stavka / 60

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

  Govno: number = 0

  moneyAll

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


  compute_houl_working(){
    this.service.getAllDays()
      .subscribe(res => {
        this.res_array = res
        console.log(res)
        let total_hours: number = 0
        let total_minutes: number = 0
        let MinutesAll: number = 0
        let MoneyAll: number = 0

        for(let i = 0; i < this.res_array.length; i++){
          total_hours += this.res_array[i].hours 
          total_minutes += this.res_array[i].minutes  
          
        }

        console.log('Часы', total_hours)
        console.log('Минуты', total_minutes)

        this.total_hours = total_hours
        this.total_minutes = total_minutes % 60

        this.houl_minutes = total_minutes

        
        MinutesAll = (total_hours * 60)+total_minutes
        MoneyAll = MinutesAll*this.one_minute
        console.log('DEngi vse', MoneyAll)

        this.moneyAll = MoneyAll
        
         this.total_days = this.res_array.length
        

      })
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
