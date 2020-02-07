import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // { path: '', loadChildren: './modules/home/home.module#HomeModule' },
  { path: '', redirectTo: 'manual', pathMatch: 'full' },
  { path: 'manual', loadChildren: './modules/manual/manual.module#ManualModule' },
  { path: 'location', loadChildren: './modules/location/location.module#LocationModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
