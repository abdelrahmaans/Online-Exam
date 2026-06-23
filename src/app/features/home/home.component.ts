import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DiplomasService } from '../../core/services/diplomas/diplomas.service';
import { Daum, Metadata } from '../../core/models/diplomas.interface';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private readonly _diplomasService = inject(DiplomasService);
  private readonly themes = ['theme-flutter', 'theme-ai', 'theme-backend', 'theme-data', 'theme-testing', 'theme-security'];

  diplomasList: Daum[] = [];
  metadata: Metadata | null = null;
  responseStatus = false;
  responseCode = 0;

  ngOnInit(): void {
    this.getAllDiplomas();
  }

  getAllDiplomas(): void {
    this._diplomasService.getAllDiplomas().subscribe({
      next: (response) => {
        this.responseStatus = response.status;
        this.responseCode = response.code;
        this.diplomasList = response.payload?.data ?? [];
        this.metadata = response.payload?.metadata ?? null;
      },
      error: () => {
        this.responseStatus = false;
        this.responseCode = 0;
        this.diplomasList = [];
        this.metadata = null;
      }
    });
  }

  getThemeClass(index: number): string {
    return this.themes[index % this.themes.length];
  }

}
