import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartProductsSoldComponent } from './chart-products-sold/chart-products-sold.component';
import { ChartUserResidenceComponent } from './chart-user-residence/chart-user-residence.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DialogAddPurchaseComponent } from './dialog-add-purchase/dialog-add-purchase.component';
import { DialogAddUserComponent } from './dialog-add-user/dialog-add-user.component';
import { DialogEditAboutUserComponent } from './dialog-edit-about-user/dialog-edit-about-user.component';
import { DialogEditAddressUserComponent } from './dialog-edit-address-user/dialog-edit-address-user.component';
import { KanbanComponent } from './kanban/kanban.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { LoginComponent } from './login/login.component';
import { ProductsComponent } from './products/products.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { UserComponent } from './user/user.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTreeModule } from '@angular/material/tree';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { NgApexchartsModule } from "ng-apexcharts";
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { DialogChangeStateComponent } from './dialog-change-state/dialog-change-state.component';




@NgModule({
  declarations: [
    AppComponent,
    ChartProductsSoldComponent,
    ChartUserResidenceComponent,
    DashboardComponent,
    DialogAddPurchaseComponent,
    DialogAddUserComponent,
    DialogEditAboutUserComponent,
    DialogEditAddressUserComponent,
    KanbanComponent,
    LegalNoticeComponent,
    LoginComponent,
    ProductsComponent,
    SidenavComponent,
    UserComponent,
    UserDetailsComponent,
    DialogChangeStateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    FormsModule,
    MatProgressBarModule,
    MatCardModule,
    MatMenuModule,
    MatTreeModule,
    DragDropModule,
    MatSnackBarModule,
    provideFirebaseApp(() => initializeApp({ "projectId": "simple-crm-2d008", "appId": "1:651292357158:web:1c0159cd692e3691d8ece7", "storageBucket": "simple-crm-2d008.appspot.com", "apiKey": "AIzaSyBBz_Mh-ZK_uL81UfYcn_TajI_nBadb7xY", "authDomain": "simple-crm-2d008.firebaseapp.com", "messagingSenderId": "651292357158" })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    BrowserAnimationsModule,
    NgApexchartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
