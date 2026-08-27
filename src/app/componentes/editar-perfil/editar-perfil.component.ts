import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { persona } from 'src/app/model/persona.model';
import { FileUploadService } from 'src/app/service/file-upload.service';
import { PersonaService } from 'src/app/service/persona.service';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css'],
  standalone: false
})
export class EditarPerfilComponent implements OnInit {
  persona: persona = new persona(
    'Tomás',
    'Peresin',
    'assets/foto-perfil.jpg',
    'Especializado en diseño y construcción de arquitecturas backend robustas, modelado de bases de datos relacionales, relevamiento funcional y aseguramiento de calidad de software.',
    ''
  );
  personaId: number = 1;

  avatarUploadMode: 'file' | 'url' = 'file';
  bannerUploadMode: 'file' | 'url' = 'file';

  isUploadingAvatar: boolean = false;
  isUploadingBanner: boolean = false;

  avatarUploadError: string = '';
  bannerUploadError: string = '';

  isSaving: boolean = false;

  constructor(
    private personaService: PersonaService,
    private fileUploadService: FileUploadService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.personaService.getPersonas().subscribe({
      next: (data) => {
        if (data && (data.nombre || data.apellido || data.descripcion)) {
          this.persona = {
            id: data.id || 1,
            nombre: data.nombre || 'Tomás',
            apellido: data.apellido || 'Peresin',
            descripcion: data.descripcion || 'Especializado en diseño y construcción de arquitecturas backend robustas, modelado de bases de datos relacionales, relevamiento funcional y aseguramiento de calidad de software.',
            img: data.img || 'assets/foto-perfil.jpg',
            banner: data.banner || ''
          };
          this.personaId = data.id || 1;
        }
      },
      error: () => {
        // Fallback default values
        this.persona = new persona(
          'Tomás',
          'Peresin',
          'assets/foto-perfil.jpg',
          'Especializado en diseño y construcción de arquitecturas backend robustas, modelado de bases de datos relacionales, relevamiento funcional y aseguramiento de calidad de software.',
          ''
        );
      }
    });
  }

  setAvatarMode(mode: 'file' | 'url'): void {
    this.avatarUploadMode = mode;
    this.avatarUploadError = '';
  }

  setBannerMode(mode: 'file' | 'url'): void {
    this.bannerUploadMode = mode;
    this.bannerUploadError = '';
  }

  onAvatarSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.avatarUploadError = 'Por favor selecciona un formato de imagen válido (PNG, JPG, WebP).';
        return;
      }

      this.isUploadingAvatar = true;
      this.avatarUploadError = '';

      this.fileUploadService.upload(file).subscribe({
        next: (res) => {
          this.isUploadingAvatar = false;
          this.persona.img = res.url;
        },
        error: (err) => {
          this.isUploadingAvatar = false;
          this.avatarUploadError = err.error?.mensaje || 'Error al subir la imagen de perfil. Máx 5MB.';
        }
      });
    }
  }

  onBannerSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.bannerUploadError = 'Por favor selecciona un formato de imagen válido (PNG, JPG, WebP).';
        return;
      }

      this.isUploadingBanner = true;
      this.bannerUploadError = '';

      this.fileUploadService.upload(file).subscribe({
        next: (res) => {
          this.isUploadingBanner = false;
          this.persona.banner = res.url;
        },
        error: (err) => {
          this.isUploadingBanner = false;
          this.bannerUploadError = err.error?.mensaje || 'Error al subir el banner. Máx 5MB.';
        }
      });
    }
  }

  removeAvatar(): void {
    this.persona.img = '';
    this.avatarUploadError = '';
  }

  removeBanner(): void {
    this.persona.banner = '';
    this.bannerUploadError = '';
  }

  onUpdate(): void {
    if (!this.persona.nombre || !this.persona.apellido) {
      return;
    }

    this.isSaving = true;
    this.personaService.update(this.personaId, this.persona).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['']);
      },
      error: () => {
        this.isSaving = false;
        alert('Hubo un error al actualizar los datos del perfil.');
      }
    });
  }
}
