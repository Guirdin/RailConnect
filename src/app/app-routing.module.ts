import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'detail-gare',
    loadChildren: () => import('./detail-gare/detail-gare.module').then( m => m.DetailGarePageModule)
  },
  {
    path: 'creation-profil',
    loadChildren: () => import('./creation-profil/creation-profil.module').then( m => m.CreationProfilPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
