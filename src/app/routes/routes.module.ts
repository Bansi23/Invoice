import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslatorService } from '../core/translator/translator.service';
import { MenuService } from '../core/menu/menu.service';
import { SharedModule } from '../shared/shared.module';
import { PagesModule } from './pages/pages.module';
import { NgxPayPalModule } from 'ngx-paypal';

import { menu } from './menu';
import { routes } from './routes';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { ItemListComponent } from './item-list/item-list.component';
import { CreateInvoicesComponent } from './create-invoices/create-invoices.component';
import { PaymentIntegrationComponent } from './payment-integration/payment-integration.component';
import { ChildComponent } from './payment-integration/child/child.component';
import { TestPipe } from './test.pipe';

import { TestDemoComponent } from './payment-integration/test-demo/test-demo.component';



//import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
    imports: [
        NgxPayPalModule,
        SharedModule,
        RouterModule.forRoot(routes, { useHash: true }),
        PagesModule
    ],

    //[RouterModule.forRoot(routes , { useHash: true })],
    declarations: [InvoiceListComponent, CustomerListComponent, ItemListComponent, CreateInvoicesComponent, PaymentIntegrationComponent, ChildComponent, TestPipe, TestDemoComponent],
    exports: [
        RouterModule
    ]
})

export class RoutesModule {
    constructor(public menuService: MenuService, tr: TranslatorService) {
        menuService.addMenu(menu);
    }
}
