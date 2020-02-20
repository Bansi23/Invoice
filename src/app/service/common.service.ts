import { Injectable } from '@angular/core';
import { ToasterService } from 'angular2-toaster';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  displayToaster(type: number, title, body?) {
    const messageType = type == 1 ? 'success' : type == 2 ? 'error' : type == 3 ? 'warning' : type == 4 ? 'info' : 'error';
    this.toasterService.pop(messageType, title, body);
  }

  customerData() {
    return [
      { "id": 1, "cname": "bansi", 'mono': 1234567890, 'mail': 'bansi@gmail.com', 'address': 'Ahemdabaad' },
      { "id": 2, "cname": "diya", 'mono': 5456656623, 'mail': 'diya@gmail.com', 'address': 'Rajkot' },
      { "id": 3, "cname": "darsh", 'mono': 6548201873, 'mail': 'darsh@gmail.com', 'address': 'Gandhinagar' },
      { "id": 4, "cname": "jiya", 'mono': 3654789251, 'mail': 'jiya@gmail.com', 'address': 'Amareli' },
      { "id": 5, "cname": "abc", 'mono': 1547965230, 'mail': 'abc@gmail.com', 'address': 'Bhuj' },
      { "id": 6, "cname": "hits", 'mono': 3457535791, 'mail': 'hits@gmail.com', 'address': 'Ahemdabaad' },
      { "id": 7, "cname": "vir", 'mono': 987562416, 'mail': 'vir@gmail.com', 'address': 'Gandhinagar' },
      { "id": 8, "cname": "jinu", 'mono': 3654780196, 'mail': 'jinu@gmail.com', 'address': 'Rajkot' },
      { "id": 9, "cname": "bhavik", 'mono': 1586745032, 'mail': 'bhavik@gmail.com', 'address': 'amreli' },
      { "id": 10, "cname": "Aaru", 'mono': 9975412056, 'mail': 'aaru@gmail.com', 'address': 'Bhuj' },
      { "id": 11, "cname": "Sushma", 'mono': 7852874884, 'mail': 'Sushma@gmail.com', 'address': 'amd' }
    ]
  }

  itemData() {
    return [
      { "id": 1, "iname": "COMPUTER", 'rate': 100 },
      { "id": 2, "iname": "CUSTOM", 'rate': 300 },
      { "id": 3, "iname": "EXTRA FACILITY", 'rate': 500 },
      { "id": 4, "iname": "TV", 'rate': 7000 },
      { "id": 5, "iname": "LED", 'rate': 1000 },
      { "id": 6, "iname": "LAPTOP", 'rate': 1100 },
      { "id": 7, "iname": "TABLAT", 'rate': 1200 }
    ]
  }

  constructor(private toasterService: ToasterService) { }
}
