import { Component, AfterViewChecked, Input, OnInit } from '@angular/core';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

//declare let paypal: any;
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
// let ammount = 1;

@Component({
  selector: 'app-payment-integration',
  templateUrl: './payment-integration.component.html',
  styleUrls: ['./payment-integration.component.scss']
})
export class PaymentIntegrationComponent implements OnInit {

  finalAmount = new FormControl(1, Validators.required);


  //   showSuccess: boolean;
  //   //val: number = 1;
  //   // @Input() val;

  //   constructor() { }
  //   addScript: boolean = false;
  //   paypalLoad: boolean = true;


  //   paypalConfig = {
  //     env: 'sandbox',
  //     client: {
  //       sandbox: 'Af2rOF93RV_MOKvQxtWnW1T4_ljG0_VeDSWHLDJYDv5PyQ0oJANgOAY5i3kD2KjvrpkEcwOz3tGfpcjb',
  //       //production: 'AROrrjG3Cd_gXM0mouQ8sLwKq6QS7qxDHJulLzgT-k10jgnqjpDU2Mf9FW_3xuszzfPVV1epCpZ7zWto'
  //     },
  //     commit: true,
  //     payment: (data, actions) => {
  //       return actions.payment.create({
  //         payment: {
  //           transactions: [
  //             { amount: { total: this.finalAmount.value, currency: 'INR' } }
  //           ]
  //         }
  //       });
  //     },
  //     onAuthorize: (data, actions) => {
  //       return actions.payment.execute().then((payment) => {
  //         console.log('Authpayment', payment)
  //         //Do something when payment is successful.
  //       })
  //     }
  //   };

  //   ngAfterViewChecked(): void {
  //     if (!this.addScript) {
  //       this.addPaypalScript().then(() => {
  //         paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn');
  //         this.paypalLoad = false;
  //       })
  //     }
  //     //allowed: [ paypal.FUNDING.CREDIT ]
  //   }

  //   addPaypalScript() {
  //     this.addScript = true;
  //     return new Promise((resolve, reject) => {
  //       let scripttagElement = document.createElement('script');
  //       scripttagElement.src = 'https://www.paypalobjects.com/api/checkout.js';
  //       scripttagElement.onload = resolve;
  //       document.body.appendChild(scripttagElement);
  //     })
  //   }
  public payPalConfig?: IPayPalConfig;

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'sb',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: '30.99',
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: '30.99'
                }
              }
            },
            items: [
              {
                name: 'Enterprise Subscription',
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'EUR',
                  value: '30.99',
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }

  constructor() { }

  ngOnInit() {
    this.initConfig();
  }
}
