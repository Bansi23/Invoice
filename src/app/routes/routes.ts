import { LayoutComponent } from '../layout/layout.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { ItemListComponent } from './item-list/item-list.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { CreateInvoicesComponent } from './create-invoices/create-invoices.component';
import { PaymentIntegrationComponent } from './payment-integration/payment-integration.component';
import { ChildComponent } from './payment-integration/child/child.component';

export const routes = [

    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'createinvoices', pathMatch: 'full' },
            { path: 'createinvoices', component: CreateInvoicesComponent },
            { path: 'customerlist', component: CustomerListComponent },
            { path: 'itemlist', component: ItemListComponent },
            { path: 'invoiceslist', component: InvoiceListComponent },
            { path: 'paymentPaypal', component: PaymentIntegrationComponent},
        ]
    },

    // Not found
    { path: '**', redirectTo: 'createinvoices' }

];
