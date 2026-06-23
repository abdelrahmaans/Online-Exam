import { Component, inject, OnInit } from '@angular/core';
import { DiplomasService } from '../../../core/services/diplomas/diplomas.service';
import { Daum } from '../../../core/models/diplomas.interface';

@Component({
  selector: 'app-admin-diplomas',
  imports: [],
  templateUrl: './diplomas.component.html',
  styleUrl: './diplomas.component.css',
})
export class DiplomasComponent implements OnInit {
  private readonly diplomasService = inject(DiplomasService);

  diplomas: Daum[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadDiplomas();
  }

  private loadDiplomas(): void {
    this.diplomasService.getAllDiplomas().subscribe({
      next: (response) => {
        this.diplomas = response.payload?.data ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load diplomas.';
        this.isLoading = false;
      },
    });
  }

  deleteDiploma(diploma: Daum): void {
    if (!window.confirm(`Delete ${diploma.title}?`)) {
      return;
    }

    this.diplomasService.deleteDiploma(diploma.id).subscribe({
      next: () => {
        this.diplomas = this.diplomas.filter((item) => item.id !== diploma.id);
      },
      error: () => {
        this.errorMessage = 'Unable to delete this diploma.';
      },
    });
  }
}
