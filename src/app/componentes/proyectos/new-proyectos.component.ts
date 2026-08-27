import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Proyecto } from 'src/app/model/proyecto';
import { FileUploadService } from 'src/app/service/file-upload.service';
import { SProyectoService } from 'src/app/service/s-proyecto.service';

@Component({
  selector: 'app-new-proyectos',
  templateUrl: './new-proyectos.component.html',
  styleUrls: ['./new-proyectos.component.css'],
  standalone: false
})
export class NewProyectosComponent implements OnInit {
  nombre: string = '';
  descripcion: string = '';
  fecha: number = new Date().getFullYear();
  link: string = '';
  img: string = '';

  availableCategories = [
    { id: 'backend', label: 'Backend y APIs', icon: 'bi-hdd-network' },
    { id: 'funcional', label: 'Analista Funcional', icon: 'bi-diagram-3' },
    { id: 'datos', label: 'Datos y SQL', icon: 'bi-database' },
    { id: 'qa', label: 'QA y Testing', icon: 'bi-shield-check' }
  ];

  selectedCategories: string[] = ['backend'];

  uploadMode: 'file' | 'url' = 'file';
  isUploadingImage: boolean = false;
  uploadError: string = '';

  constructor(
    private sProyecto: SProyectoService,
    private fileUploadService: FileUploadService,
    private router: Router
  ) {}

  ngOnInit(): void {}

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
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.uploadError = 'Por favor selecciona un archivo de imagen válido (PNG, JPG, WebP, GIF, SVG).';
        return;
      }

      this.isUploadingImage = true;
      this.uploadError = '';

      this.fileUploadService.upload(file).subscribe({
        next: (res) => {
          this.isUploadingImage = false;
          this.img = res.url;
        },
        error: (err) => {
          this.isUploadingImage = false;
          this.uploadError = err.error?.mensaje || 'Error al subir la imagen al servidor. Tamaño máximo 5MB.';
        }
      });
    }
  }

  removeImage(): void {
    this.img = '';
    this.uploadError = '';
  }

  onCreate(): void {
    if (!this.nombre.trim() || !this.descripcion.trim() || !this.link.trim()) {
      return;
    }
    const categoriasStr = this.selectedCategories.join(',');
    const proyecto = new Proyecto(this.nombre.trim(), this.descripcion.trim(), this.fecha, this.link.trim(), this.img, categoriasStr);
    this.sProyecto.save(proyecto).subscribe({
      next: () => {
        this.router.navigate(['']);
      },
      error: () => {
        alert('Error al añadir el proyecto. Verifica los campos.');
      }
    });
  }
}