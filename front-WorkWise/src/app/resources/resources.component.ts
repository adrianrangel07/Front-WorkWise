import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ResourcesService, Resource } from '../services/resources.service';
import { NavbarAcordionComponent } from '../reutilzar/navbar-acordion/navbar-acordion.component';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarAcordionComponent,],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.css',
})
export class ResourcesComponent implements OnInit {
  resources: Resource[] = [];
  filteredResources: Resource[] = [];
  categories: any[] = [];
  searchQuery: string = '';
  selectedCategory: string = 'all';
  selectedType: string = 'all';
  isLoading: boolean = true;

  constructor(private resourcesService: ResourcesService) {}

  ngOnInit(): void {
    this.loadResources();
    this.loadCategories();
  }

  loadResources(): void {
    this.isLoading = true;
    this.resourcesService.getResources().subscribe({
      next: (resources) => {
        this.resources = resources;
        this.filteredResources = resources;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading resources:', error);
        this.isLoading = false;
      },
    });
  }

  loadCategories(): void {
    this.resourcesService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
    });
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.resourcesService.searchResources(this.searchQuery).subscribe({
        next: (resources) => {
          this.filteredResources = resources;
        },
      });
    } else {
      this.applyFilters();
    }
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  onTypeChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.resources;

    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter((r) => r.category === this.selectedCategory);
    }

    if (this.selectedType !== 'all') {
      filtered = filtered.filter((r) => r.type === this.selectedType);
    }

    this.filteredResources = filtered;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = 'all';
    this.selectedType = 'all';
    this.filteredResources = this.resources;
  }

  getTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      video: '🎬',
      document: '📄',
      article: '📝',
      tip: '💡',
    };
    return icons[type] || '📁';
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      video: 'Video',
      document: 'Documento',
      article: 'Artículo',
      tip: 'Tip',
    };
    return labels[type] || 'Recurso';
  }

  getCategoryLabel(category: string): string {
    const labels: { [key: string]: string } = {
      interview: 'Entrevistas',
      'job-search': 'Búsqueda de Empleo',
      cv: 'CV y Documentos',
      career: 'Desarrollo Profesional',
      general: 'General',
    };
    return labels[category] || category;
  }

  openVideo(url: string): void {
    window.open(url, '_blank');
  }

  downloadDocument(url: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop() || 'documento';
    link.click();
  }

  readContent(resource: Resource): void {
    alert(`Abriendo: ${resource.title}\n\n${resource.description}`);
  }
}
