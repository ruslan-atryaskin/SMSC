import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {ContactsCreateComponent} from "./contacts-create/contacts-create.component";
import {ContactsUpdateComponent} from "./contacts-update/contacts-update.component";
import {ContactsUpdateResolve} from "./contacts-update/contacts-update.resolve";
import {ContactsDeleteComponent} from "./contacts-delete/contacts-delete.component";

const CUSTOMERS_CONTACTS_ROUTE_PROVIDER = [
    {
        path: 'create',
        component: ContactsCreateComponent
    },
    {
        path: 'update/:contactId',
        component: ContactsUpdateComponent,
        resolve: {update: ContactsUpdateResolve}
    },
    {
        path: 'delete/:contactId',
        component: ContactsDeleteComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(CUSTOMERS_CONTACTS_ROUTE_PROVIDER)],
    exports: [RouterModule]
})
export class CustomersContactsRoutingModule {
}
