import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { HomeComponent } from './components/home/home.component';
import { PfmComponent } from './components/pfm/pfm.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { IgxButtonModule, IgxCardModule, IgxIconModule, IgxRippleModule, IgxAvatarModule } from 'igniteui-angular';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IgxDatePickerModule } from "igniteui-angular";
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { ChooseCategoryComponent } from './components/choose-category/choose-category.component';
import { SplitComponent } from './components/split/split.component';
import { ErrorComponent } from './components/error/error.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { SplitsComponent } from './components/splits/splits.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PfmComponent,
    ChooseCategoryComponent,
    SplitComponent,
    ErrorComponent,
    SplitsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    MatBadgeModule,
    IgxAvatarModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatPaginatorModule,
    MatTableModule,
    IgxCardModule,
    IgxButtonModule,
    IgxIconModule,
    IgxAvatarModule,
    IgxRippleModule,
    MatDatepickerModule,
    MatFormFieldModule,
    IgxDatePickerModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    MatDialogModule,
    NgApexchartsModule,
    MatDividerModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
