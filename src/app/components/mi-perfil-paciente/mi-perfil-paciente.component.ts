import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderPacienteComponent } from "../header-paciente/header-paciente.component";
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';
import { AlternarImagenDirective } from '../../directives/alternar-imagen.directive';
import { SpinnerDirective } from '../../directives/spinner.directive';
import { EstadoTurno, TurnosService } from '../../services/turnos.service';
import { Subscription } from 'rxjs';
import { CapitalizarPrimeraLetraPipe } from '../../pipes/capitalizar-primera-letra.pipe';

// import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mi-perfil-paciente',
  standalone: true,
  imports: [HeaderPacienteComponent, CommonModule, AlternarImagenDirective, SpinnerDirective, CapitalizarPrimeraLetraPipe],
  templateUrl: './mi-perfil-paciente.component.html',
  styleUrl: './mi-perfil-paciente.component.scss'
})

export class MiPerfilPacienteComponent implements OnInit, OnDestroy {
  usuario?: Usuario;
  isLoading: boolean = false;
  sub?: Subscription;
  misTurnosParaHC: any[] = [];

  constructor(
    private authService: AuthService,
    private turnosService: TurnosService
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.usuarioActual;

    this.isLoading = true;
    this.sub = this.turnosService
      .obtenerTurnosConUsuario('pacienteId', this.usuario?.id, 'especialistaId')
      .subscribe((respuesta: any) => {
        this.misTurnosParaHC = respuesta.sort(
          (a: any, b: any) => {
            return b.fecha - a.fecha;
          }
        );

        this.misTurnosParaHC = this.misTurnosParaHC.filter((turno) => {
          return turno.estado === EstadoTurno.realizado
        });

        console.log(this.misTurnosParaHC);
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

}
