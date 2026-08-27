import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Proyecto } from 'src/app/model/proyecto';
import { FileUploadService } from 'src/app/service/file-upload.service';
import { SProyectoService } from 'src/app/service/s-proyecto.service';

@Component({
  selector: 'app-edit-proyecto',
  templateUrl: './edit-proyecto.component.html',
  styleUrls: ['./edit-proyecto.component.css'],
  standalone: false
})
export class EditProyectoComponent implements OnInit {
  proyectoLab: Proyecto = null;

  availableCategories = [
    { id: 'backend', label: 'Backend y APIs', icon: 'bi-hdd-network' },
    { id: 'funcional', label: 'Analista Funcional', icon: 'bi-diagram-3' },
    { id: 'datos', label: 'Datos y SQL', icon: 'bi-database' },
    { id: 'qa', label: 'QA y Testing', icon: 'bi-shield-check' }
  ];

  selectedCategories: string[] = [];

  uploadMode: 'file' | 'url' = 'file';
  isUploadingImage: boolean = false;
  uploadError: string = '';

  constructor(
    private sProyecto: SProyectoService,
    private fileUploadService: FileUploadService,
    private activatedRouter: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.activatedRouter.snapshot.params['id'];
    this.sProyecto.detail(id).subscribe({
      next: (data) => {
        this.proyectoLab = data;
        if (data.categorias) {
          this.selectedCategories = data.categorias.split(',').map(c => c.trim()).filter(c => c.length > 0);
        }
        if (this.selectedCategories.length === 0) {
          this.selectedCategories = ['backend'];
        }
      },
      error: () => {
        alert('Error al cargar el proyecto.');
        this.router.navigate(['']);
      }
    });
  }

  toggleCategory(catId: string): void {
    const index = this.selectedCategories.indexOf(catId);
    if (index > -1) {
      if (this.selectedCategories.length > 1) {
        this.selectedCategories.splice(index, 1);
      }
    } else {
      this.selectedCategories.push(catId);
    }
  }

  isCategorySelected(catId: string): boolean {
    return this.selectedCategories.includes(catId);
  }

  setUploadMode(mode: 'file' | 'url'): void {
    this.uploadMode = mode;
    this.uploadError = '';
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file && this.proyectoLab) {
      if (!file.type.startsWith('image/')) {
        this.uploadError = 'Por favor selecciona un archivo de imagen válido (PNG, JPG, WebP, GIF, SVG).';
        return;
      }

      this.isUploadingImage = true;
      this.uploadError = '';

      this.fileUploadService.upload(file).subscribe({
        next: (res) => {
          this.isUploadingImage = false;
          this.proyectoLab.img = res.url;
        },
        error: (err) => {
          this.isUploadingImage = false;
          this.uploadError = err.error?.mensaje || 'Error al subir la imagen al servidor. Tamaño máximo 5MB.';
        }
      });
    }
  }

  removeImage(): void {
    if (this.proyectoLab) {
      this.proyectoLab.img = '';
      this.uploadError = '';
    }
  }

  onUpdate(): void {
    const id = this.activatedRouter.snapshot.params['id'];
    this.proyectoLab.categorias = this.selectedCategories.join(',');
    this.sProyecto.update(id, this.proyectoLab).subscribe({
      next: () => {
        this.router.navigate(['']);
      },
      error: () => {
        alert('Error al modificar el proyecto.');
        this.router.navigate(['']);
      }
    });
  }
}
