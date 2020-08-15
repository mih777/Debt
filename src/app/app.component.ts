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

  ngOnInit(){
    this.getDays()
    this.form = new FormGroup({
      date: new FormControl(''),
      hours: new FormControl(0.0),
      minutes: new FormControl(0.0),
      overtime: new FormControl(0.0) 
    })
    this.compute_houl_working()
  }


  compute_houl_working(){
    this.service.getAllDays()
      .subscribe(res => {
        this.res_array = res
        // console.log(this.res_array[1].hours)
        //const qwert = this.compute_all_hours(this.res_array)

        let total_hours = 0
        let total_minutes = 0
        for(let i = 0; i < this.res_array.length; i++){
          total_hours += this.res_array[i].hours  
          total_minutes += this.res_array[i].minutes
        }
        console.log('total minutes from hours',total_hours*60)
        console.log('total_minutes',total_minutes)
        console.log('total hours', ((total_hours*60)+total_minutes)/60)
        console.log('total Days', this.res_array.length)


        //console.log('Total Money', this.res_array.length)
        //console.log('Дней', )
        //console.log('Часов', )
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
        this.getDays()
        this.send_res = 'Recorded successfully !'
        setTimeout(() => {
          this.send_confirm = false
          this.send_res = ''
        }, 5000)
      })
        
  }

  computeOvertime(h, m): number{
    let calc = 0
    if(h < 8){
      calc = 0
    }else{
      const res = ((h * 60) + m) / 60 
      calc = res - 8
    }
    
    return calc
  }

  getDays(){
    this.service.getAllDays()
      .subscribe(res => {
        //console.log(res)
        //console.log(this.date)
        this.days = res
      })
  }



}
