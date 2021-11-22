import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PfmComponent } from './components/pfm/pfm.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'pfm', component: PfmComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
