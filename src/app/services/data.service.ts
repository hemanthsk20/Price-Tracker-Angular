import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private machineDataUrl = 'assets/data/LH-JSON-data.json';

  constructor(private http: HttpClient) { }

  getMachineData(): Observable<any[]> {
    let machineData = this.http.get<any[]>(this.machineDataUrl);
    return machineData;
  }
}
