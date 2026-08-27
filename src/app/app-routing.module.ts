import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditEducacionComponent } from './componentes/educacion/edit-educacion.component';
import { NewEducacionComponent } from './componentes/educacion/new-educacion.component';
import { EditExperienciaComponent } from './componentes/experiencia/edit-experiencia.component';
import { NewExperienciaComponent } from './componentes/experiencia/new-experiencia.component';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { EditProyectoComponent } from './componentes/proyectos/edit-proyecto.component';
import { NewProyectosComponent } from './componentes/proyectos/new-proyectos.component';
import { SignInComponent } from './componentes/sign-in/sign-in.component';
import { EditSkillComponent } from './componentes/skills/edit-skill.component';
import { NewSkillsComponent } from './componentes/skills/new-skills.component';
import { RecuperarPasswordComponent } from './componentes/recuperar-password/recuperar-password.component';
import { CambiarPasswordComponent } from './componentes/cambiar-password/cambiar-password.component';
import { EditarPerfilComponent } from './componentes/editar-perfil/editar-perfil.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'nuevaexp', component: NewExperienciaComponent},
  {path: 'editexp/:id', component: EditExperienciaComponent},
  {path: 'editedu/:id', component: EditEducacionComponent},
  {path: 'nuevaedu', component: NewEducacionComponent},
  {path: 'editskill/:id', component: EditSkillComponent},
  {path: 'nuevaskill', component: NewSkillsComponent},
  {path: 'editproyecto/:id', component: EditProyectoComponent},
  {path: 'nuevoproyecto', component: NewProyectosComponent},
  {path: 'nuevousuario', component: SignInComponent},
  {path: 'recuperar-password', component: RecuperarPasswordComponent},
  {path: 'cambiar-password', component: CambiarPasswordComponent},
  {path: 'editar-perfil', component: EditarPerfilComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
